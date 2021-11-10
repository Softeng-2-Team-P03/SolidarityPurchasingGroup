import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import { CardGroup, Col, Container, Row, Button, Image } from "react-bootstrap";
import Product from "../Product/Product";
import SideBar from "../SideBar";
import Cart from "../Cart/Cart"
import NavBar from "../NavBar";
import { useState } from "react";

function ProductList() {
    const [products, setProducts] = useState([<Product />, <Product />, <Product />, <Product />, <Product />, <Product />, <Product />, <Product />, <Product />, <Product />]);

    return (
        <>
            <Row>
                <Col xs={2} md={2}  >
                    <SideBar></SideBar>
                </Col>
                <Col xs={10} md={10} className="main">
                    <Row xs={2} md={5} className="g-4">
                        {products}
                    </Row>
                </Col>
            </Row>
            <Cart/>
        </>
    );
}

export default ProductList;
