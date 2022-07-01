import React from "react";
import {GoogleLogin} from 'react-google-login';
import {useHistory} from "react-router-dom";
import {Button, Card, Container, ListGroup, Row} from "react-bootstrap";
import styles from './styles.module.css';
import logo from "../logo.png";
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    const history = useHistory();

    const handleSuccess = (result) => {
        sessionStorage.setItem('user_full_name', result.profileObj.name);
        history.push('/analyze-emails', result);
    }

    const handleFailure = (result) => {
        console.log(result);
    }

    return (
        <Container className={styles.loginCardContainer}>
            <Card bg='warning' text='white' className={styles.loginCard}>
                <Card.Header as="h5">How to?</Card.Header>
                <Card.Body>
                    <ListGroup as="ol" numbered>
                        <ListGroup.Item as="li" style={{border: 0}}>We will ask you to login to your
                            Gmail.</ListGroup.Item>
                        <ListGroup.Item variant='warning' as="li" style={{border: 0}}>We will read your sent
                            messages.</ListGroup.Item>
                        <ListGroup.Item as="li" style={{border: 0}}>We will analyze the sent emails.</ListGroup.Item>
                        <ListGroup.Item as="li" style={{border: 0}}>We will list the frequent snippets we
                            discover.</ListGroup.Item>
                        <ListGroup.Item as="li" style={{border: 0}}>You can save the snippets list to import them later
                            in Text Blaze and save your time.</ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Login in with Google"
                onSuccess={handleSuccess}
                onFailure={handleFailure}
                redirectUri='/analyze-emails'
                isSignedIn={true}
                render={renderProps =>
                    (<Button variant='danger' className={styles.loginBtn}
                             onClick={renderProps.onClick}><img
                        alt=""
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}Login in with Google</Button>)
                }
                cookiePolicy={'single_host_origin'}
            />
        </Container>

    )
}

export default Login;
