import React, {useContext} from "react";
import {GoogleLogin} from 'react-google-login';
import {useHistory} from "react-router-dom";
import {Button, Card, Container, ListGroup} from "react-bootstrap";
import styles from './styles.module.css';
import logo from "../logo.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import {UserContext} from "../storage/UserContext.js";

function Login() {
    const {userFullName, setUserFullName} = useContext(UserContext);
    const steps = [
        'We will ask you to login to your Gmail.',
        'We will read your sent messages.',
        'We will analyze the sent emails.',
        'We will list the frequent snippets we discover.',
        'You can save the snippets list to import them later in Text Blaze and save your time.'
    ];
    const history = useHistory();

    const handleSuccess = (result) => {
        console.log(userFullName);
        //sessionStorage.setItem('user_full_name', result.profileObj.name);
        setUserFullName(result.profileObj.name);
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
                        {steps.map(step => (
                            <ListGroup.Item as="li" style={{border: 0}}>{step}</ListGroup.Item>
                        ))}
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
