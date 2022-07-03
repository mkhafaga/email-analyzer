import React from 'react'
import {Container, Navbar, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import Header from "./Header.js";

function Error() {
    return (
        <>
            <Header/>
            <Container style={{display: 'flex', justifyContent: 'center'}}>
                <Row>
                    <h1 style={{alignSelf: 'center', color: 'red', marginTop: '30px'}}>Page not found! Wanna
                        go <Link style={{color: 'orange'}} to={'/'}>Home</Link>?</h1>
                </Row>
                <Navbar pos/>
            </Container>
        </>

    );
}


export default Error;
