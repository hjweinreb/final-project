import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './Navbar'
import Form from './Form'
import PendingLinks from './PendingLinks';
import Submit from './Submit'
import VirusStats from './VirusStats'
import Foodbanks from './Foodbanks';
import WebScrape from './WebScrape';

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Switch>
        <div className="App">

          <Navbar />

          <Route path="/submit">
            <Submit />
          </Route>
          <Route exact path="/">
            <VirusStats></VirusStats>
            <Form></Form>
          </Route>
          <Route path="/foodbanks">
            <Foodbanks />
          </Route>

          <Route path="/webscrape">
            <WebScrape />
          </Route>

          <Route path="/pending">
            <PendingLinks />
          </Route>

        </div>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

