import 'bootstrap/dist/css/bootstrap.min.css';
import './Cart.css';
import { Col, Row, Image, Button, Modal, Alert, Form, CloseButton, Spinner } from "react-bootstrap";
import cartIcon from "../Icons/cart-icon.png";
import { useState } from "react";

function Cart(props) {
    const [show, setShow] = useState(false);

    const close = () => setShow(false);
    const open = () => setShow(true);


    return (<>
        <Button data-testid="cartButton" className="showCartButton" onClick={open}>
            <Image src={cartIcon} fluid />
            {props.cartInfo.numItems}
        </Button>

        <Modal data-testid="cartModal" show={show} onHide={close} scrollable>
            <Modal.Header style={{ backgroundColor: "#afcbd6" }}>
                <Col style={{ textAlign: "center" }}>
                    <Row>
                        <Col xs={15} md={11}>
                            <h3>
                                <small>Cart ({props.cartInfo.numItems} items) {props.userName ? `for ${props.userName}` : ""}</small> <br />
                                <b>Subtotal: € {props.cartInfo.totalPrice}</b>
                            </h3>
                        </Col>
                        <Col xs={3} md={1}>
                            <CloseButton onClick={close} />
                        </Col>
                    </Row>
                    <br />
                    <Form.Select disabled>
                        <option value="1">No Schedule</option>
                        <option value="2">Pick-up date</option>
                        <option value="3">Delivery at home</option>
                    </Form.Select>
                    <br />
                    <Button variant="success" disabled={props.cart.length === 0 || props.loadingConfirm}
                        onClick={() => props.confirmOrder()}>
                        {props.loadingConfirm ? <>Submitting order <Spinner animation="border" size="sm" /></> : "Confirm Order"}
                    </Button>
                    <br />
                    {props.errorConfirm.length > 0 ?
                        <Alert key={2233} variant="danger"  >
                            {props.errorConfirm}
                        </Alert>
                        : ""
                    }  </Col>
            </Modal.Header>
            <Modal.Body>
                {props.cart.length === 0 ? <h2 style={{ textAlign: 'center' }}>Cart is empty</h2>
                    : props.cart.map(product =>
                        <CartProduct key={product.id} product={product}
                            modifyProductInCart={props.modifyProductInCart} deleteProductFromCart={props.deleteProductFromCart} />)}
            </Modal.Body>
        </Modal>
    </>);
}

function CartProduct(props) {
    return (
        <Row style={{ borderBottom: "2px solid black", paddingTop: "5%", paddingBottom: "5%" }}>
            <Button className="cartButtons delete" variant="danger" onClick={() => props.deleteProductFromCart(props.product.id)}>X</Button>
            <Col>
                <Image src={require('../../../public/ProductImages/' + props.product.imagePath).default} fluid thumbnail />
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "25px" }}>{props.product.name} </div>
                <div style={{ textAlign: "center", fontSize: "15px" }}>Farmer: {props.product.farmer.name} {props.product.farmer.surname}</div>
            </Col>
            <Col style={{ textAlign: "center" }}>
                <br />
                <br />
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "25px" }}>€ {props.product.pricePerUnit} &nbsp; </div>
                <br />
                <Row>
                    <Col style={{ padding: "0px" }}>
                        <Button className="cartButtons" variant="primary"
                            disabled={props.product.selectedQuantity === 0} onClick={() => props.modifyProductInCart(props.product.id, -1, 1)}>-</Button>
                    </Col>
                    <Col>
                        <input className="quantity-text " type="number" min={0} onChange={e => props.modifyProductInCart(props.product.id, !e.target.value ? 0 : e.target.value, 2)} 
                        value={Number(props.product.selectedQuantity).toString()} >
                        </input>
                    </Col>
                    <Col style={{ padding: "0px" }}>
                        <Button className="cartButtons" variant="primary"
                            disabled={props.product.quantity === props.product.selectedQuantity}
                            onClick={() => props.modifyProductInCart(props.product.id, +1, 1)}>+</Button>
                    </Col>
                </Row>
                {props.product.quantity === props.product.selectedQuantity && <small style={{ color: "red" }}>Max quantity reached</small>}
                <br />
                <div style={{ fontSize: "15px" }}>{props.product.quantity} pieces available</div>
            </Col>
        </Row>
    );
}

export default Cart;
