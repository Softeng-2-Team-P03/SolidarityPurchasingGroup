import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductList from "./Components/ProductList/ProductList";
import { Container } from "react-bootstrap";
import ClientList from './Components/ClientList/ClientList';
import { useState } from 'react';
import OrderList from './Components/OrderList/OrderList';
import NavBar from './Components/NavBar/NavBar';
import HomePage from './Components/HomePage/HomePage';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';


const fakeClients = [
  { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" },
  { userId: '2', name: "Mario", surname: "Rossi", email: "ma@gmail.com" },
  { userId: '3', name: "Mario", surname: "Rossi", email: "mb@gmail.com" },
  { userId: '4', name: "Mario", surname: "Rossi", email: "mc@gmail.com" },
];

const fakeProducts = [
  { name: "Cipolla", description: "Rossi", price: "0.10" },
  { name: "Cipollo", description: "Rossi", price: "0.10" },
  { name: "Cipollu", description: "Rossi", price: "0.10" },
  { name: "Mario", description: "Rossi", price: "0.10" },
  { name: "dsfsd", description: "Rossi", price: "0.10" },
  { name: "uytuty", description: "Rossi", price: "0.10" },
  { name: "fdsfsd", description: "Rossi", price: "0.10" },
];

const fakeOrders = [
  {orderID : 1, user : { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" }, bookingStartDate : "2021-20-11"  , totalPrice : 30 , state : "issued", pickupTime : "2021-21-11 10:30" ,deliveryTime : ""},
  {orderID : 1, user : { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" }, bookingStartDate : "2021-20-11"  , totalPrice : 30 , state : "issued", pickupTime : "" ,deliveryTime : "2021-21-11 10:30"},
  {orderID : 1, user : { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" }, bookingStartDate : "2021-20-11"  , totalPrice : 30 , state : "issued", pickupTime : "2021-21-11 10:30" ,deliveryTime : ""},
  {orderID : 1, user : { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" }, bookingStartDate : "2021-20-11"  , totalPrice : 30 , state : "issued", pickupTime : "" ,deliveryTime : "2021-21-11 10:30"},
  {orderID : 1, user : { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" }, bookingStartDate : "2021-20-11"  , totalPrice : 30 , state : "issued", pickupTime : "2021-21-11 10:30" ,deliveryTime : ""},
  {orderID : 1, user : { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" }, bookingStartDate : "2021-20-11"  , totalPrice : 30 , state : "issued", pickupTime : "" ,deliveryTime : "2021-21-11 10:30"},

];

function App() {
  const [clients, setClients] = useState([...fakeClients]);
  const [products, setProducts] = useState([...fakeProducts]);
  const [orders, setOrders] = useState([...fakeOrders]);


  return (
    <>
      <NavBar />
    
        <Router>
          <Switch>
            <Route path='/clients' render={() =>
              <ClientList clients={clients} ></ClientList>
            } />
            <Route path="/products" render={() =>
              <ProductList products={products} />
            } />
            <Route path='/orders' render={() =>
              <OrderList orders={fakeOrders} ></OrderList>
            } />
            <Route exact path="/" render={() =>
              <HomePage />
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
