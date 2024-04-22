import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";
import NotFound from "./NotFound";

function Main() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        {/* http://localhost:3000/nonexistentpage  */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default Main;
