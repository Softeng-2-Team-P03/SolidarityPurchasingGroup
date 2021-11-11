import 'bootstrap/dist/css/bootstrap.min.css';
import './Cart.css';
import { Col, Row, Image, Button, Modal } from "react-bootstrap";
import cartIcon from "../Icons/cart-icon.png";
import mainLogo from "../Icons/cipolle-dorate-bio.jpg";
import { useState } from "react";

function Cart() {
    const [show, setShow] = useState(false);

    const close = () => setShow(false);
    const open = () => setShow(true);


    return (<>
        <Button className="showCartButton" onClick={open}>
            <Image src={cartIcon} fluid />
            10
        </Button>

        <Modal show={show} onHide={close} scrollable>
            <Modal.Header closeButton style={{backgroundColor: "#6da8fd"}}>
                <Col style={{ textAlign: "center" }}>
                    <h3>
                        <small>Your Cart (10) </small> <br />
                        <b>Subtotal: € 2.00</b>
                    </h3>
                    <Button variant="success">Confirm Order</Button>
                </Col>
            </Modal.Header>
            <Modal.Body>
                <CartProduct />
                <CartProduct />
                <CartProduct />
                <CartProduct />
                <CartProduct />
            </Modal.Body>
        </Modal>
    </>);
}

function CartProduct() {
    return (
        
            <Row style={{borderBottom: "2px solid black", paddingTop: "5%", paddingBottom: "5%"}}>
                <Button className="cartButtons delete" variant="danger">X</Button>
                <Col>
                    <Image src={mainLogo} fluid thumbnail/>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "25px" }}>Cipolla </div>
                    <div style={{ textAlign: "center", fontSize: "15px" }}>Farmer: Mario Rossi</div>
                </Col>
                <Col style={{ textAlign: "center" }}>
                    <br />
                    <br />
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "25px" }}>€ 0.10 &nbsp; </div>
                    <br />
                    <Row>
                        <Col style={{padding: "0px"}}>
                            <Button className="cartButtons" variant="primary">-</Button>
                        </Col>
                        <Col>
                            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "25px" }}>2</div>
                        </Col>
                        <Col style={{padding: "0px"}}>
                            <Button className="cartButtons" variant="primary">+</Button>
                        </Col>
                    </Row>
                    <br />
                    <div style={{ fontSize: "15px" }}>5 pieces available</div>
                </Col>
            </Row>
    );
}

export default Cart;