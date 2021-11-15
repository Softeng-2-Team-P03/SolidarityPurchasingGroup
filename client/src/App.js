import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductList from "./Components/ProductList/ProductList";
import { Container } from "react-bootstrap";
import OrderList from './Components/OrderList/OrderList';
import NavBar from './Components/NavBar/NavBar';
import HomePage from './Components/HomePage/HomePage';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import bookingApi from "./api/booking-api";
import productApi from "./api/product-api";
import { React, useState, useEffect } from "react";
import booking from './models/booking';
import API from './API';
import { LoginComponent } from './Components/LoginComponents/LoginComponent';
import { ClientList} from './Components/ClientList/ClientList';
import { ClientModal } from './Components/ClientList/AddClient';

const fakeOrders = [
  { orderID: 1, user: { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" }, bookingStartDate: "2021-20-11", totalPrice: 30, state: "issued", pickupTime: "2021-21-11 10:30", deliveryTime: "" },
  { orderID: 1, user: { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" }, bookingStartDate: "2021-20-11", totalPrice: 30, state: "issued", pickupTime: "", deliveryTime: "2021-21-11 10:30" },
  { orderID: 1, user: { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" }, bookingStartDate: "2021-20-11", totalPrice: 30, state: "issued", pickupTime: "2021-21-11 10:30", deliveryTime: "" },
  { orderID: 1, user: { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" }, bookingStartDate: "2021-20-11", totalPrice: 30, state: "issued", pickupTime: "", deliveryTime: "2021-21-11 10:30" },
  { orderID: 1, user: { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" }, bookingStartDate: "2021-20-11", totalPrice: 30, state: "issued", pickupTime: "2021-21-11 10:30", deliveryTime: "" },
  { orderID: 1, user: { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" }, bookingStartDate: "2021-20-11", totalPrice: 30, state: "issued", pickupTime: "", deliveryTime: "2021-21-11 10:30" },

];

function App() {
  const [orders, setOrders] = useState([...fakeOrders]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(undefined);


  // useEffect(()=> {
  //     let mounted = true;
  //     let products = [];
  //     const getAllProducts = async () => {
  //         products = await productApi.getAllProducts({page:0});
  //     };
  //     getAllProducts().then(data => {
  //         if (mounted){
  //             console.log("prodotti")
  //             console.log(products);

  //         }
  //     })
  //         .catch(err => {
  //             console.error(err);
  //         });
  //     return () => { mounted = false };
  // }, []);



  //   useEffect(()=> {
  //     let mounted = true;
  //     let order ;
  //     let products = [];

  //     products.push({productId:1,quantity:3,price:3});
  //     products.push({productId:2,quantity:4,price:5});
  //     const insertBooking = async () => {
  //       let order = {
  //         id:null,
  //         bookingStartDate:"2021-11-11",
  //         userId:null,
  //         totalPrice:150,
  //         pickupTime:"2021-12-11",
  //         deliveryTime:"",
  //         state:1,
  //         products:products};
  //        await bookingApi.addBooking(order);
  //     };
  //     insertBooking().then(data => {
  //         if (mounted){
  //             console.log("prodotti")


  //         }
  //     })
  //         .catch(err => {
  //             console.error(err);
  //         });
  //     return () => { mounted = false };
  // }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = await API.getUserInfo();
        setLoggedIn(true);
        setUser(userInfo);
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
    API.addNewClient(newClient).then(() => {
      //setClients(...clients, newClient);
    }).catch(/*err => handleErrors(err) */);
  };




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
            <OrderList orders={fakeOrders} ></OrderList>
          } />
          <Route exact path="/" render={() =>
            <HomePage loggedIn={loggedIn} userLogoutCallback={userLogoutCallback} />
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
