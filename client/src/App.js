import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductList from "./ProductList";
import SideBar from "./SideBar";
import {Col, Container, Row} from "react-bootstrap";
import ClientList from './ClientList';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';


const fakeClients = [
    { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" },
    { userId: '2',name: "Mario", surname: "Rossi", email: "m@gmail.com" },
    { userId: '3',name: "Mario", surname: "Rossi", email: "m@gmail.com" },
    { userId: '4', name: "Mario", surname: "Rossi", email: "m@gmail.com" },
  ];



function App() {
    const [clients, setClients] = useState([...fakeClients]);
  return (
    <Router>
    <Container>
      <Switch>
        <Route path='/clients' render={() =>
         <ClientList clients={clients} ></ClientList>
        }>
        </Route>
        <Route path="/products" render={() =>
          <ProductList/> 
               }>
        </Route>
      </Switch>
    </Container>
  </Router>
    

  );
}

export default App;
