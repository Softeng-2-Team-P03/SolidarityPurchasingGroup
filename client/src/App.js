import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ProductList } from "./Components/ProductList/ProductList";
import { OrderList } from './Components/OrderList/OrderList';
import NavBar from './Components/NavBar/NavBar';
import HomePage from './Components/HomePage/HomePage';
import OrderSuccess from './Components/SuccessPage/OrderSuccess';
import { MyOrderList } from './Components/OrderList/MyOrderList';
import { FarmerHome } from './Components/FarmerHome/FarmerHome';
import { WareHouseHome } from './Components/WareHouseHome/WareHouseHome';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { React, useState, useEffect } from "react";
import API from './API';
import { LoginComponent } from './Components/LoginComponents/LoginComponent';
import { ClientList } from './Components/ClientList/ClientList';
import { ClientModal } from './Components/ClientList/AddClient';
import bookingApi from './api/booking-api';
import UnretrievedFood from "./Components/UnretrievedFood/UnretrievedFood";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(undefined);

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
    console.log(email+"  "+password);
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
    const id1 = setInterval(checkDate, 1000);
    checkDate();
    return () => clearInterval(id1)
  }, [])

  const checkDate = () => {
    let t = new Date(localStorage.getItem('virtualDate'));
    checkConfirmBookings(t);
    sendMails(t);
    checkConfirmBookingsPending(t);
    checkUnretrievedFood(t);
    sendTelegramNotification(t);
  }

  const checkConfirmBookings = (t) => {
    //Monday at 9:00:00
    if (t.getDay() === 1 && t.getHours() === 9 && t.getMinutes() === 0 && t.getSeconds() === 0) {
      console.log("Calling API to confirm bookings!")
      API.confirmAllBookings()
        .catch(err => console.error(err));
      console.log("API to confirm bookings has been called!")
    }
  }

  const sendMails = (t) => {
    //Monday at 9:00:05
    if (t.getDay() === 1 && t.getHours() === 9 && t.getMinutes() === 0 && t.getSeconds() === 5) {
      console.log("Calling API to send emails")
      API.sendMailNotifications()
        .catch(err => console.error(err));
      console.log("API to send emails has been called!")
    }
  }

  const checkConfirmBookingsPending = (t) => {
    //Monday at 23:59:00
    if (t.getDay() === 1 && t.getHours() === 23 && t.getMinutes() === 59 && t.getSeconds() === 0) {
      console.log("Calling API to check bookings in pending cancelation!")
      API.confirmAllBookingsPendingCancelation()
        .catch(err => console.error(err));
      console.log("API to check bookings in pending cancelation has been called!")
    }
  }

  const checkUnretrievedFood = (t) => {
    //Saturday at 9:00:00
    if (t.getDay() === 6 && t.getHours() === 9 && t.getMinutes() === 0 && t.getSeconds() === 0) {
      console.log("Calling API to send check for unretrieved food")
      bookingApi.addUnretrievedFood(localStorage.getItem('virtualDateToString'))
        .catch(err => console.error(err));
      console.log("API to check for unretrieved food has been called!")
    }
  }

  const sendTelegramNotification = (t) => {
    //Saturday at 9:00:00
    if (t.getDay() === 6 && t.getHours() === 9 && t.getMinutes() === 0 && t.getSeconds() === 0) {
      console.log("Calling API to send telegram notifications")
      API.sendAvailableProductsTGNotification()
        .catch(err => console.error(err));
      console.log("API to send telegram notifications has been called!")
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
              <ClientModal addClient={addClient}  userLoginCallback={userLoginCallback} user={user}></ClientModal></>
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
          <Route path='/unretrievedFood' render={() =>
              <UnretrievedFood></UnretrievedFood>
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
