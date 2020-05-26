import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import UserCalendar from "./containers/calendar.js";
import AddUserInformation from "./containers/AddUserInformation.js";
import Jourlnal from "./components/journal.js";
import UserProfile from "./containers/userProfile";
import Statistics from "./containers/statistics.js";
import DisplayLogo from "./components/displayLogo";


import { Calendar } from "antd";

const BaseRouter = () => (
  <div>
      <Route exact path="/" component={DisplayLogo} />
      <Route exact path="/logowanie" component={Login} />
      <Route exact path="/rejestracja" component={Signup} />
      <Route exact path="/informacje-o-uzytkowniku" component={AddUserInformation} />
      <Route exact path="/kalendarz" component={UserCalendar} />
      <Route exact path="/kalendarz/:data" component={Jourlnal} />

      <Route exact path="/edycja-profilu" component={UserProfile} />
      <Route exact path="/statystyki" component={Statistics} />

  </div>
);

export default BaseRouter;