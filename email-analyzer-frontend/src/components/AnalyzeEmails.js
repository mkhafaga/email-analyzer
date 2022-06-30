import React from 'react'
import '../App.css';
import {GoogleLogout} from 'react-google-login';
import {useHistory, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {Card, Container, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Styles from './styles.module.css';
import Loading from "./Loading.js";


function AnalyzeEmails() {
    const [loading, setLoading] = useState(true);
    const [snippets, setSnippets] = useState([]);
    const location = useLocation();
    const history = useHistory();
    const [name, setName] = useState(null);


    useEffect(() => {
        const result = location.state;

        if (!result) {
            history.push('/');
            return;
        }
        console.log(result.profileObj);
        setName(result.profileObj.name);

        function analyzeEmails() {
            console.log('does it come to the front end?');
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
            // console.log(`response: ${JSON.stringify(response)}`);
            // console.log(response);
            if (!response.ok) {
                if (response.status === 401) {
                    console.log(`response: ${JSON.stringify(response)}`);
                    handleLogout();
                } else {
                    throw Error(response.statusMessage);
                }
            }
            return response.json();
        }).then(data => {
            setSnippets(data.snippets.slice(0, 30));
            setLoading(false);
            console.log(`data: ${JSON.stringify(data)}`);
        }).catch(error => {
            console.log(`shit: ${JSON.stringify(error)}`);
        })
    }, []);

    const handleLogout = () => {
        console.log('User logged out!');
        history.push('/');
    }

    return (

        <Container>
            {/*<GoogleLogout clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} onLogoutSuccess={handleLogout}*/}
            {/*              buttonText={'Logout'}/>*/}
            {loading && <Loading name={name}/>}

            {snippets.map((snippet, index) => (
                <Card key={`card-${index}`} xs={4} style={{margin: '10px'}} bg='warning' text='light'>
                    <Card.Header className='text-white bg-danger'>Suggested Shortcut: </Card.Header>
                    <Card.Body>
                        <Card.Text className='p-3 mb-2 bg-white text-dark'>
                            {snippet['text']}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className='text-white bg-danger'>Using the snippet calculated above can save you up
                        to {snippet['timeSaved']} minutes of typing.</Card.Footer>
                </Card>

            ))}

        </Container>
    );
}

export default AnalyzeEmails;
