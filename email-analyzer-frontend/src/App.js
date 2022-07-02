import './App.css';
import Login from "./components/Login.js";
import AnalyzeEmails from "./components/AnalyzeEmails.js";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {useEffect, React, useState, useMemo} from "react";
import {gapi} from "gapi-script";

import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header.js";
import Error from "./components/Error.js";
import {UserContext} from "./storage/UserContext.js";

function App() {
    const [userFullName, setUserFullName] = useState(null);
    const providerValue = useMemo(() => ({userFullName, setUserFullName}), [userFullName, setUserFullName]);

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: 'https://mail.google.com/',
            });
        }

        gapi.load('client:auth2', start);
    }, []);

    return (<UserContext.Provider value={providerValue}>
            <Router>
                <div className="App">
                    <Header/>

                    <Switch>
                        <Route path='/' exact>
                            <Login/>
                        </Route>
                        <Route path='/analyze-emails' exact>
                            <AnalyzeEmails/>
                        </Route>
                        <Route component={Error}/>
                    </Switch>

                </div>
            </Router>
        </UserContext.Provider>
    );
}

export default App;
