import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductList from "./ProductList";
import SideBar from "./SideBar";
import {Col, Container, Row} from "react-bootstrap";
import ClientList from './ClientList';



function App() {
  return (

      <>
          <Container fluid>
              <ClientList/>

          </Container>
      </>

  );
}

export default App;
