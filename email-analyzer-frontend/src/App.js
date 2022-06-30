import './App.css';
import Login from "./components/Login.js";
import AnalyzeEmails from "./components/AnalyzeEmails.js";
import {BrowserRouter as Router, Switch, Route, useHistory} from "react-router-dom";
import {useEffect, React, useState} from "react";
import {gapi} from "gapi-script";

import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Nav, Navbar} from "react-bootstrap";
import Header from "./components/Header.js";

function App() {
    console.log('Does it come to App?');
    const [name, setName] = useState('');
    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: 'https://mail.google.com/',
            });
        }

        gapi.load('client:auth2', start);
    }, []);

    console.log(`name in root: ${name}`);

    const history = useHistory();

    return (
        <Router>
            <div className="App">
                <Header name={name}/>
                {/*<ThemeProvider theme={theme}>*/}
                <Switch>
                    <Route path='/' exact>
                        <Login setName={setName}/>
                    </Route>
                    <Route path='/analyze-emails' exact>
                        <AnalyzeEmails/>
                    </Route>
                </Switch>
            </div>
        </Router>

    );
}

export default App;
