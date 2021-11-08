import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {CardGroup, Col, Container, Row} from "react-bootstrap";
import Product from "./Product";
import SideBar from "./SideBar";
import NavBar from "../NavBar";

function ProductList() {
    return (
        <>
            <Row>
                <Col xs={4} md={2} >
                    <SideBar />
                </Col>
                <Col xs={8} md={10}>

                    <CardGroup>
                    <Product/>
                    <Product/>
                    <Product/>
                    <Product/>
                    <Product/>

                </CardGroup>
                    <CardGroup>
                        <Product/>
                        <Product/>
                        <Product/>
                        <Product/>
                        <Product/>
                    </CardGroup>

                    </Col>

            </Row>

        </>


    );
}

export default ProductList;
