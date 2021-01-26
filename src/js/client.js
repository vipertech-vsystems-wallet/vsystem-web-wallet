import React from "react";
import ReactDOM from "react-dom";
import { HISTORY } from "./utils/constants";
import { Route, Router } from "react-router-dom";

// Pages
import Index from "./pages/Index";

const app = document.getElementById('app');

ReactDOM.render(
    <div>
        <Router history={HISTORY}>
            <Route exact component={Index}/>
        </Router>
    </div>,
app);