// src/routes.js
import React from 'react';
// import { Router, Route } from 'react-router';
import { Redirect, BrowserRouter, Route, Link, History } from 'react-router-dom';
import Auth from './components/modules/Auth';
//signin sinup
import SignIn from './components/SignInUp/SignIn';
import SignUp from './components/SignInUp/SignUp';
import SignUpIP from './components/SignInUp/SignUpIP';
import ForgotPassword from './components/SignInUp/ForgotPassword';
import Color from './components/Static/socket_ex';
//static components
import Base from './components/Static/Base';
import Nav from './components/Static/Nav';
import Dashboard from './components/Static/Dashboard';
import Settings from './components/Static/Settings';
//user
import MyKontragents from './components/User/MyKontragents'
import AddKontragents from './components/User/AddKontragents'
import KontragentsRequest from './components/User/KontragentsRequest'
//create deal
import Deals from './components/Main/deals';
import FinishedDeals from './components/Main/finished_deals'
//get info about deal
import MyDealsParent from './components/InfoDeal/MyDealsParent'
import MyDealsHistory from './components/InfoDeal/MyDealsHistory'
// import DealInfoRedirect from './components/InfoDeal/DealInfoRedirect'
//not found doesnt work yets
import NotFound from './components/NotFound';

const Routes = (props) => (
    <BrowserRouter>
    <div>
     <Base />
     <Nav />
     <Route exact={true} path="/" render={() =>
        (Auth.isUserAuthenticated() ? (
            <div>
            <Deals />
            </div>
          ) : (
            <SignIn />
          )
        )}/>
        <Route  path="/color" render={() =>
        (Auth.isUserAuthenticated() ? (
            <Color />
          ) : (
            <SignIn />
          )
        )}/>
    <Route path="/signin" component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/signupip" component={SignUpIP} />
    <Route path="/mykontragents" component={MyKontragents} />
    <Route path="/addkontragents" component={AddKontragents} />
    <Route path="/kontragentrequest" component={KontragentsRequest} />
    <Route path="/forgotpassword" component={ForgotPassword} />

   
    <Route path="/deals" component={Deals} />
    <Route path="/finisheddeals" component={FinishedDeals} />
    
    <Route path="/mydeals" render={() =>(Auth.isUserAuthenticated() ? (<MyDealsParent />
          ) : (
            <SignIn />
          )
        )} />
     <Route path="/dashboard" render={() =>(Auth.isUserAuthenticated() ? (<Dashboard />
          ) : (
            <SignIn />
          )
        )} />
      <Route path="/settings" render={() =>(Auth.isUserAuthenticated() ? (<Settings />
          ) : (
            <SignIn />
          )
        )} />
        <Route path="/dealhistory" render={() =>(Auth.isUserAuthenticated() ? (<MyDealsHistory />
          ) : (
            <SignIn />
          )
        )} />

   
    <Route path="/color" component={Color} />
    <Route path="/logout" render={() => { Auth.deauthenticateUser(); return <Redirect to="/"/>; } }/>
    </div>
 </BrowserRouter>
);

export default Routes;