import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductList.css';
import { Col, Row, Button, Card, Form } from "react-bootstrap";
import SideBar from "../SideBar/SideBar";
import Cart from "../Cart/Cart"
import productApi from '../../api/product-api';
import mainLogo from "../Icons/cipolle-dorate-bio.jpg";
import React, { useState,useEffect } from "react";

function ProductList(props) {
    const [products, setProducts] = useState(props.products);
    useEffect(()=> {
        const checkAuth = async() => {
          try {
            // here you have the user info, if already logged in
            // TODO: store them somewhere and use them, if needed
            var x= await productApi.getAllProduct();
            console.log("list:"+x);
          } catch(err) {
            console.error(err.error);
          }
        };
        checkAuth();
      }, []);

    function changeSearchText(text) {
        let p = []
        props.products.forEach(x => {
            if (x.name.toLowerCase().includes(text.toLowerCase())) p.push(x);
        })

        setProducts(p);
    }

    return (
        <>
            <Row className="searchProd">
                <Form.Control type="text" placeholder="Search product" onChange={x => changeSearchText(x.target.value)} />
            </Row>
            <Row>
                <Col xs={2} md={2}  >
                    <SideBar></SideBar>
                </Col>
                <Col xs={10} md={10} className="main">
                    <Row xs={2} md={5} className="g-4">
                        {products.map((x) =>
                            <Product key={x.name}
                                product={x}
                            />)
                        }
                    </Row>
                </Col>
            </Row>
            <Cart />
        </>
    );
}

function Product(props) {
    return (
        <Col>
            <Card className="text-center">
                <Card.Img variant="top" src={mainLogo} />
                <Card.Body>
                    <h2>{props.product.name}</h2>
                    <Card.Text>
                        1 pezzo circa 300g
                    </Card.Text>

                    <h4>
                        0.10€
                    </h4>
                </Card.Body>
                <Card.Footer>
                    <h6>5 pezzi rimanenti</h6>
                </Card.Footer>
                <Card.Footer>
                    <small className="text-muted">Venduto da Mario Rossi</small>
                </Card.Footer>
                <Card.Footer>
                    <small className="text-muted">0.30 €/kg</small>
                </Card.Footer>
                <Card.Footer>
                    <Button className="button" variant="primary">-</Button>{' '}
                    <small className="text"> 0 </small>
                    <Button className="button" variant="primary">+</Button>{' '}
                </Card.Footer>
                <Card.Footer>
                    <Button variant="success">Add to basket</Button>{' '}
                </Card.Footer>
            </Card>
        </Col>
    );
}

export default ProductList;
