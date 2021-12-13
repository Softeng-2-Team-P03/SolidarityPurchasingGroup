import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ProductList } from "./Components/ProductList/ProductList";
import { OrderList } from './Components/OrderList/OrderList';
import NavBar from './Components/NavBar/NavBar';
import HomePage from './Components/HomePage/HomePage';
import OrderSuccess from './Components/SuccessPage/OrderSuccess';
import { MyOrderList } from './Components/OrderList/MyOrderList';
import FarmerHome from './Components/FarmerHome/FarmerHome';
import { WareHouseHome } from './Components/WareHouseHome/WareHouseHome';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { React, useState, useEffect } from "react";
import API from './API';
import { LoginComponent } from './Components/LoginComponents/LoginComponent';
import { ClientList } from './Components/ClientList/ClientList';
import { ClientModal } from './Components/ClientList/AddClient';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(undefined);
  let confirmBookingsDone = false;
  let dateDone;
  let confirmBookingsPending = false;
  let datePending;
  let emailSent = false;
  let dateEmail;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = await API.getUserInfo();
        setUser(userInfo);
        setLoggedIn(true);
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  const userLoginCallback = async (email, password) => {
    // Make POST request to authentication server
    try {
      const userInfo = await API.logIn({ username: email, password: password });
      setUser(userInfo);
      setMessage({ msg: `Welcome!`, type: 'text-success' });
      setLoggedIn(true);
    } catch (err) {
      setMessage({ msg: 'wrong email or password', type: 'text-danger' });
    }
  };

  const userLogoutCallback = () => {
    API.logOut().then(() => {
      setLoggedIn(false);
      setMessage('');
      setUser(undefined);
    });
  }

  const addClient = (newClient) => {
    API.addNewClient(newClient).catch(/*err => handleErrors(err) */);
  };

  useEffect(() => {
    const id1 = setInterval(checkConfirmBookings, 1000);
    const id2 = setInterval(checkConfirmBookingsPending, 1000);
    const id3 = setInterval(sendMails, 1000);
    checkConfirmBookings();
    checkConfirmBookingsPending();
    sendMails();
    return () => { clearInterval(id1); clearInterval(id2); clearInterval(id3) }
  }, [])

  const checkConfirmBookings = () => {
    let t = new Date(localStorage.getItem('virtualDate'));

    if (confirmBookingsDone === true && t.getTime() > dateDone.getTime()) { //already called API
      console.log("API to confirm bookings has been called!")
      confirmBookingsDone = false;
      return;
    }
    if (confirmBookingsDone === false && t.getDay() === 1 && t.getHours() === 9 && t.getMinutes() === 0 && t.getSeconds() <= 1) {
      API.confirmAllBookings()
        .catch(err => console.err(err));
      console.log("Called API to confirm bookings!")
      dateDone = new Date(t.getTime());
      confirmBookingsDone = true;
    }
  }

  const checkConfirmBookingsPending = () => {
    let t = new Date(localStorage.getItem('virtualDate'));

    if (confirmBookingsPending === true && t.getTime() > datePending.getTime()) { //already called API
      console.log("API to check bookings in pending cancelation has been called!")
      confirmBookingsPending = false;
      return;
    }
    if (confirmBookingsPending === false && t.getDay() === 1 && t.getHours() === 23 && t.getMinutes() === 59 && t.getSeconds() <= 1) {
      API.confirmAllBookingsPendingCancelation()
        .catch(err => console.err(err));
      console.log("Called API to check bookings in pending cancelation!")
      datePending = new Date(t.getTime());
      confirmBookingsPending = true;
    }
  }

  const sendMails = () => {
    let t = new Date(localStorage.getItem('virtualDate'));

    if (emailSent === true && t.getTime() > dateEmail.getTime()) { //already called API
      console.log("API to send emails has been called!")
      emailSent = false;
      return;
    }
    if (emailSent === false && t.getDay() === 1 && t.getHours() === 9 && t.getMinutes() === 0 && t.getSeconds() >= 10 && t.getSeconds() <= 11) {
      API.sendMailNotifications()
        .catch(err => console.err(err));
      console.log("Called API to send emails")
      dateEmail = new Date(t.getTime());
      emailSent = true;
    }
  }

  return (
    <>
      <NavBar loggedIn={loggedIn} user={user} userLogoutCallback={userLogoutCallback} />
      <Router>
        <Switch>
          <Route exact path="/login" render={() => (<>{loggedIn ? <Redirect to='/' /> :
            <LoginComponent userLoginCallback={userLoginCallback} message={message} />}</>)} />
          <Route path='/clients' render={() =>
            <ClientList ></ClientList>
          } />
          <Route path="/addClient" render={() => (
            <><HomePage />
              <ClientModal addClient={addClient}></ClientModal></>
          )} />
          <Route path="/products" render={() =>
            <ProductList loggedIn={loggedIn} user={user} />
          } />
          <Route path='/orders' render={() =>
            <OrderList />
          } />
          <Route path='/myOrders' render={() =>
            <MyOrderList loggedIn={loggedIn} user={user} ></MyOrderList>
          } />
          <Route path='/success' render={() =>
            <OrderSuccess />
          } />
          <Route exact path="/" render={() =>
            <HomePage loggedIn={loggedIn} user={user} userLogoutCallback={userLogoutCallback} />
          } />
          <Route path='/farmerHome' render={() =>
            <FarmerHome></FarmerHome>
          } />
          <Route path='/WareHouseHome' render={() =>
            <WareHouseHome></WareHouseHome>
          } />
          <Route render={() =>
            <Redirect to='/' />
          } />
        </Switch>
      </Router>

    </>
  );
}

export default App;
