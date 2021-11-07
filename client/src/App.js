import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductList from "./ProductList";
import SideBar from "./SideBar";
import {Col, Container, Row} from "react-bootstrap";



function App() {
  return (

      <Container>
          <Row>
              <Col><SideBar/></Col>
              <Col><ProductList/></Col>
          </Row>
      </Container>

  );
}

export default App;
