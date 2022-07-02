import React from 'react'
import '../App.css';
import {useHistory, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Card, Container, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loading from "./Loading.js";


function AnalyzeEmails() {
    const [loading, setLoading] = useState(true);
    const [snippets, setSnippets] = useState([]);
    const [csvFileName, setCsvFileName] = useState(null);
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
                } else {
                    throw Error(response.statusMessage);
                }
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
        // return fetch(`exporter?csvFileName=${csvFileName}`);
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

        <Container>
            {/*<GoogleLogout clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} onLogoutSuccess={handleLogout}*/}
            {/*              buttonText={'Logout'}/>*/}
            {loading && <Loading name={name}/>}
            <Container>
                {!loading &&
                    <Row style={{display: 'flex', flexDirection: 'row', margin: '30px'}}>
                        <h4 style={{color: 'red', flex: 7}}>Congrats {name}, we have found
                            top {snippets.length} snippets for
                            you.</h4>
                        <Button variant='danger' style={{flex: 1}} onClick={downloadCSVFile}>Export</Button>
                    </Row>}

            </Container>
            {snippets.map((snippet, index) => (
                <Card key={`card-${index}`} xs={4} style={{margin: '30px'}} bg='warning' text='light'>
                    <Card.Header className='text-white bg-danger'>Suggested Shortcut: /{snippet['shortcut']}
                    </Card.Header>
                    <Card.Body>
                        <Card.Text className='p-3 mb-2 text-light h5'>
                            {snippet['text']}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className='text-white bg-danger'>The snippet above was
                        found {snippet['occurrences']} times, using it with TextBlaze can save you up
                        to {snippet['timeSaved']} minutes of typing.</Card.Footer>
                </Card>

            ))}

        </Container>
    );
}

export default AnalyzeEmails;
