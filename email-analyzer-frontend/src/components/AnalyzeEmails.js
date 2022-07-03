import React from 'react'
import '../App.css';
import {useHistory, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Card, Container} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loading from "./Loading.js";
import Header from "./Header.js";
import styles from './styles.module.css';


function AnalyzeEmails() {
    const [loading, setLoading] = useState(true);
    const [snippets, setSnippets] = useState([]);
    const [csvFileName, setCsvFileName] = useState(null);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const location = useLocation();
    const history = useHistory();
    const [name, setName] = useState(null);


    useEffect(() => {
        const result = location.state;

        if (!result) {
            history.push('/');
            return;
        }
        setName(result.profileObj.name);

        function analyzeEmails() {
            return fetch('emails/analyze-sent-messages', {
                method: 'POST',
                body: JSON.stringify({
                    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                    clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
                    userId: result.profileObj.email,
                    token: result.tokenObj
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        };

        analyzeEmails().then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout();
                } else if (response.status === 404) {
                    setNoResultsFound(true);
                    setLoading(false);
                }
                throw Error(response.statusMessage);
            }
            return response.json();
        }).then(data => {
            setSnippets(data.top30Snippets);
            setCsvFileName(data.csvFileName);
            setLoading(false);
        }).catch(error => {
            console.log(`Caught error: ${JSON.stringify(error)}`);
        })
    }, []);

    const handleLogout = () => {
        console.log('User logged out!');
        history.push('/');
    }

    const downloadCSVFile = () => {
        fetch(`exporter/exportCsv?csvFileName=${csvFileName}`)
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${csvFileName}`);
                document.body.appendChild(link);
                link.click();
            });
    };

    return (
        <>
            <Header/>
            <Container style={{minWidth: '100%', display: 'flex', flexDirection: 'column'}}>
                {loading && <Loading name={name}/>}

                {!loading && !noResultsFound &&
                    <Container style={{minWidth: '100%', display: 'flex', marginTop: '30px'}}>
                        <h4 style={{color: 'red'}}>Congrats {name}, we have found
                            top {snippets.length} snippets for
                            you. You can export them and import them later to TextBlaze!</h4>

                        <Button style={{marginLeft: '10px', flex: 1}} variant='danger'
                                onClick={downloadCSVFile}>Export</Button>
                    </Container>}
                <Container style={{
                    display: 'flex', flexDirection: 'row', marginBottom: '30px', marginTop: '30px',
                    justifyContent: 'center'
                }}>
                    {noResultsFound &&
                        <h4 style={{color: 'red', textAlign: 'center'}}>Unfortunately, no results found!</h4>}
                </Container>
                {snippets.map((snippet, index) => (
                    <Card bg='warning' key={`card-${index}`} xs={4} style={{marginBottom: '30px'}}
                    >
                        <Card.Header as='h5' className='text-light'>Suggested Shortcut: /{snippet['shortcut']}
                        </Card.Header>
                        <Card.Body as='h6'>
                            <Card.Text className='p-3 mb-2 text-dark bg-white'>
                                {snippet['text']}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.bold}>The snippet above was
                            found {snippet['occurrences']} times, using it with TextBlaze can save you up
                            to {snippet['timeSaved']} minutes of typing.</Card.Footer>
                    </Card>

                ))}

            </Container>
        </>

    );
}

export default AnalyzeEmails;
