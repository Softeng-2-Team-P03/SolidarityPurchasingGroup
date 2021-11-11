import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductList.css';
import {CardGroup, Col, Container, Row, Button, Image, Form} from "react-bootstrap";
import Product from "../Product/Product";
import SideBar from "../SideBar";
import Cart from "../Cart/Cart"
import NavBar from "../NavBar";
import React, { useState } from "react";

function ProductList(props) {
    const [products,setProducts]=useState(props.products);

    function changeSearchText(text){
        let p=[]
        props.products.forEach(x=>{
            if(x.name.toLowerCase().includes(text.toLowerCase())) p.push(x);
        })

        setProducts(p);
    }

    return (
        <>
            <Row className="searchProd">
                <Form.Control type="text"  placeholder="Search client" onChange={x=>changeSearchText(x.target.value)}/>
            </Row>
            <Row>
                <Col xs={2} md={2}  >
                    <SideBar></SideBar>
                </Col>
                <Col xs={10} md={10} className="main">
                    <Row xs={2} md={5} className="g-4">
                        { products.map((x) =>
                        <Product key={x.name}
                                product = {x}
                        />)
                        }
                    </Row>
                </Col>
            </Row>
            <Cart/>
        </>
    );
}

export default ProductList;
