import React, {useEffect, useState} from 'react'
import {Container, Navbar, NavDropdown} from "react-bootstrap";
import logo from '../logo.png'
import styles from './styles.module.css';
import {GoogleLogout} from "react-google-login";
import {useHistory} from "react-router-dom";

function Header() {
    const history = useHistory();
    const [userFullName, setUserFullName] = useState(null);
    useEffect(() => {
        setUserFullName(sessionStorage.getItem('user_full_name'));
        if (userFullName) {
            const menu = document.getElementById("navbarScrollingDropdown");
            menu.style.color = 'white';
        }

    });

    const handleLogout = () => {
        history.push('/');
        sessionStorage.clear();
    }

    return (
        <Navbar bg='danger'>
            <Container>
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
                {userFullName && <Navbar.Collapse className="justify-content-end" style={{display: 'flex'}}>
                    <Navbar.Text
                        style={{color: 'white', display: 'flex', alignItems: 'center'}}>
                        Signed in as: <NavDropdown title={userFullName}
                                                   id="navbarScrollingDropdown"
                                                   className={styles.menuLink}
                                                   bsPrefix={'nav-link menuLink'}>
                        <GoogleLogout
                            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                            buttonText="Logout"
                            onLogoutSuccess={handleLogout}
                            render={renderProps => (<NavDropdown.Item
                                onClick={renderProps.onClick}>Signout</NavDropdown.Item>)}
                        >
                        </GoogleLogout>

                    </NavDropdown>
                    </Navbar.Text>
                </Navbar.Collapse>}

            </Container>
        </Navbar>
    );
}

export default Header;
