import './App.css';
import Login from "./components/Login.js";
import AnalyzeEmails from "./components/AnalyzeEmails.js";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {useEffect, React} from "react";
import {gapi} from "gapi-script";
import 'bootstrap/dist/css/bootstrap.min.css';
import Error from "./components/Error.js";

function App() {
    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: ` https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid`,
            });
        }

        gapi.load('client:auth2', start);
    }, []);

    return (
        <Router>
            <div className="App">
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
    );
}

export default App;
