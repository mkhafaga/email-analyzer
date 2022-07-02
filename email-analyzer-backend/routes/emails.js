const express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const Trie = require('../utils/WordsTrie');
const objectstocsv = require('objects-to-csv');

router.post('/analyze-sent-messages', async function (request, response) {
    console.log('/analyze-sent-messages');
    const {clientId, clientSecret, userId, token} = request.body;
    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oAuth2Client.setCredentials(token);
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});
    let hasMore = true;
    let sentMessages = new Map();
    let pageToken = undefined;
    const messagePromises = [];

    try{

        while (hasMore) {

            let res;
            try {
                res = await gmail.users.messages.list({
                    userId,
                    labelIds: 'SENT',
                    maxResults: 500,
                    pageToken
                });
            } catch (error) {
                console.log(`error caught: ${JSON.stringify(error)}`);
                return response.status(error.code).send({error: error.message});
            }

            if (res.data) {
                res.data.messages.forEach(message => {
                    sentMessages.set(message.id, message);
                });
            }

            if (!res.data.nextPageToken) {
                hasMore = false;
            } else {
                pageToken = res.data.nextPageToken;
            }

            let count = 1;
            for (const id of sentMessages.keys()) {
                const messagePromise = new Promise(resolve => {
                    resolve(gmail.users.messages.get({
                        userId,
                        id,
                        fields: 'id,payload(parts/body/data),payload(parts/mimeType)',
                    }));
                });
                count++;
                messagePromises.push(messagePromise);
            }
        }

        let data;
        const myTrie = new Trie();
        try{
            data = await Promise.all(messagePromises);
        }catch (error) {
            console.log(`error caught: ${JSON.stringify(error)}`);
            return response.status(error.code).send({error: error.message});
        }

        const idMaps = new Map();
        data.forEach(sentEmail => {
            const data = sentEmail.data;
            if (data.payload && data.payload.parts) {
                data.payload.parts.forEach(part => {
                    if (part.mimeType === 'text/plain') {
                        if (idMaps.has(data.id)) {
                            idMaps.set(data.id, idMaps.get(data.id) + 1);
                        } else {
                            idMaps.set(data.id, 1);
                        }

                        let messageBody = new Buffer(part.body.data, 'base64').toString();
                        const timeStampRegex = /On \w{3}, \w{3} \d{1,2}, \d{4} at \d{1,2}:\d{1,2} (am|pm|PM|AM),? .*<\s*[^@]+@[^\.]+.[^>]+\s*>\s*wrote:/;
                        const timestampMatch = messageBody.match(timeStampRegex);
                        if (timestampMatch) {
                            messageBody = messageBody.substring(0, timestampMatch.index);
                        }
                        const signatureRegex = /--\s+\n/;
                        const signatureMatch = messageBody.match(signatureRegex);
                        if (signatureMatch) {
                            messageBody = messageBody.substring(0, signatureMatch.index);
                        }
                        messageBody = messageBody.replace(/\r\n/g, '\n');
                        messageBody = messageBody.replace(/\n\n/g, '\n');
                        messageBody = messageBody.replace(/\n/g, ' ').trim();

                        const currentMessage = sentMessages.get(data.id);
                        currentMessage.messageBody = messageBody;
                        sentMessages.set(data.id, currentMessage);

                        // const messageBodyWords = messageBody.split(' ');
                        const messageBodyWords = messageBody.match(/\S+/g);
                        if (messageBodyWords) {
                            for (let i = 0; i < messageBodyWords.length; i++) {
                                myTrie.add(messageBodyWords, myTrie.root, i);
                            }
                        }
                    }
                });
            }
        });

        const suffixes = myTrie.print();
        const toRemove = [];
        const suffixesSet = new Set(suffixes);
        for (let i = 0; i < suffixes.length; i++) {
            for (let j = 0; j < suffixes.length; j++) {
                if (i === j) {
                    continue;
                }
                if (suffixes[j]['text'].includes(suffixes[i]['text']) || !/\s+/.test(suffixes[i]['text'])) {
                    toRemove.push(suffixes[i]);
                    break;
                }
            }
        }

        toRemove.forEach(word => {
            suffixesSet.delete(word);
        });

        const snippets = Array.from(suffixesSet).sort((a, b) => b['text'].length*b['occurrences'] - a['text'].length*a['occurrences']);

        const shortcuts =  new Set();
        const top30Snippets = snippets.slice(0, 30);
        for(let i=0;i< top30Snippets.length;i++) {
            const snippetWords =  top30Snippets[i]['text'].split(' ');
            for(let j =0;j<snippetWords.length;j++){
                if(!shortcuts.has(snippetWords[j])){
                    shortcuts.add(snippetWords[j]);
                    top30Snippets[i]['shortcut'] = snippetWords[j];
                    break;
                }
            }
            if(!top30Snippets[i]['shortcut']){
                top30Snippets[i]['shortcut'] = snippetWords[0].concat(snippetWords[1]);
            }
        }
        const csv  = new objectstocsv(top30Snippets);
        const csvFileName = `${userId}-${Date.now()}.csv`;
        await csv.toDisk(`/tmp/${csvFileName}`);
        response.status(200);
        response.json({top30Snippets, csvFileName});

    }catch (e) {
        console.log(e);
    }

});

module.exports = router;
