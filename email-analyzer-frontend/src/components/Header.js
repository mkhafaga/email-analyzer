import React from 'react'
import {Container, Navbar, NavDropdown} from "react-bootstrap";
import logo from '../logo.png'

function Header({name}) {
    console.log(`name is ${name}`);
    return (
        <Navbar bg='danger'>
            <Container style={{margin: 0}}>
                <Navbar.Brand href="#home" style={{color: 'white', display: 'flex'}}>
                    <img
                        alt=""
                        src={logo}
                        width="60"
                        height="60"
                        className="d-inline-block align-top"
                    />{' '}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{fontWeight: 'bolder'}}>Text Blaze</div>
                        <div style={{fontWeight: 'bold', fontSize: 'small'}}>Email Analyzer</div>
                    </div>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}


export default Header;
