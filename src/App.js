import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Landing from "./components/pages/Landing";
import About from "./components/pages/About";
import Shop from "./components/pages/shop/Shop";
import Header from "./components/Header/Header";
import Chatbot from "./components/bots/Chatbot";

const App = () => {
  return (
    <div className="container ">
      <Header />
      <Switch>
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/about" component={About} />
        <Route exact path="/" component={Landing} />
        <Redirect to="/" />
      </Switch>
      <Chatbot />
    </div>
  );
};

export default withRouter(App);
