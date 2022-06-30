import React from 'react'
import {Container, Navbar, NavDropdown} from "react-bootstrap";
import logo from '../logo.png'

function Loading({name}) {
    console.log(`name is ${name}`);
    return (
        <Container>
            <div>Dear {name}. We are now analyzing your sent emails. Please wait!</div>
        </Container>
    );
}


export default Loading;
