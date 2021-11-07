import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductList from "./ProductList";
import SideBar from "./SideBar";
import {Col, Container, Row} from "react-bootstrap";



function App() {
  return (

      <>
          <Container fluid>
              <Row>
                  <Col xs={2} id="sidebar-wrapper">
                      <SideBar />
                  </Col>
                  <Col  xs={10} id="page-content-wrapper">
                      <ProductList/>
                  </Col>
              </Row>

          </Container>
      </>

  );
}

export default App;
