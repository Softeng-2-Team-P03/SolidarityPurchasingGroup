import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductList from "./Components/ProductList/ProductList";
import { Container } from "react-bootstrap";
import ClientList from './Components/ClientList/ClientList';
import { useState } from 'react';
import NavBar from './Components/NavBar/NavBar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


const fakeClients = [
  { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" },
  { userId: '2', name: "Mario", surname: "Rossi", email: "ma@gmail.com" },
  { userId: '3', name: "Mario", surname: "Rossi", email: "mb@gmail.com" },
  { userId: '4', name: "Mario", surname: "Rossi", email: "mc@gmail.com" },
];

const fakeProducts = [
  { name: "Cipolla", description: "Rossi", price: "m@gmail.com" },
  { name: "Cipollo", description: "Rossi", price: "ma@gmail.com" },
  { name: "Cipollu", description: "Rossi", price: "mb@gmail.com" },
  { name: "Mario", description: "Rossi", price: "mc@gmail.com" },
  { name: "dsfsd", description: "Rossi", price: "ma@gmail.com" },
  { name: "uytuty", description: "Rossi", price: "mb@gmail.com" },
  { name: "fdsfsd", description: "Rossi", price: "mc@gmail.com" },
];


function App() {
  const [clients, setClients] = useState([...fakeClients]);
  const [products, setProducts] = useState([...fakeProducts]);


  return (
    <>
      <NavBar />
      <Container fluid>
        <Router>
          <Switch>
            <Route path='/clients' render={() =>
              <ClientList clients={clients} ></ClientList>
            }>
            </Route>
            <Route path="/products" render={() =>
              <ProductList products={products} />
            }>
            </Route>
          </Switch>
        </Router>
      </Container>
    </>
  );
}

export default App;
