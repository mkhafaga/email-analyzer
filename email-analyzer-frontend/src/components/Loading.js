import React from 'react'
import {Container, Spinner} from "react-bootstrap";

function Loading({name}) {
    return (
        <Container style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h2 style={{color: 'red'}}>Dear {name}. We are now analyzing your sent emails. Please wait!</h2>
            <Spinner animation="border" variant="warning"/>
        </Container>
    );
}

export default Loading;
