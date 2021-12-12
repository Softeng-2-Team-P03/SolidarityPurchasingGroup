import 'bootstrap/dist/css/bootstrap.min.css';
import './Cart.css';
import { Col, Row, Image, Button, Modal, Alert, Form, CloseButton, Spinner } from "react-bootstrap";
import cartIcon from "../Icons/cart-icon.png";
import { useEffect, useState } from "react";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import itLocale from 'date-fns/locale/it';
import { formatDateWithoutSeconds } from '../NavBar/clock';


function Cart(props) {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState(localStorage.getItem('virtualDate'));
    const [dateMin, setDateMin] = useState('');
    const [dateMax, setDateMax] = useState('');
    let currentDate = localStorage.getItem('virtualDate')
    const [choiceSelect, setChoiceSelect] = useState('0');

    const close = () => setShow(false);
    const open = () => setShow(true);

    useEffect(() => {
        let t = new Date(localStorage.getItem('virtualDate'));

        if (t.getDay() === 0 || t.getDay() === 6) {

            let minDate = new Date(localStorage.getItem('virtualDate'));
            let maxDate = new Date(localStorage.getItem('virtualDate'));

            if (t.getDay() === 0) {
                minDate.setDate(t.getDate() + 3);
                maxDate.setDate(t.getDate() + 5);
            } else {
                minDate.setDate(t.getDate() + 4);
                maxDate.setDate(t.getDate() + 6);
            }

            minDate.setHours(9);
            maxDate.setHours(23);


            setDateMin(minDate);
            setDateMax(maxDate);

        }

    }, []);


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
                    <Form.Select disabled={props.cart.length === 0 || props.loadingConfirm} onChange={e => setChoiceSelect(e.target.value)}>
                        <option value='0' disabled selected>Select a delivery option...</option>
                        <option value='1'>Pick-up date</option>
                        <option value='2'>Delivery at home</option>
                    </Form.Select>
                    <br />

                    {choiceSelect !== '0' ?
                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={itLocale}>
                            <Stack spacing={3}>
                                <DateTimePicker
                                    type="datetime-local"
                                    renderInput={(params) => <TextField {...params} />}
                                    label="Select date and time"
                                    value={value}
                                    onChange={(newValue) => {
                                        setValue(newValue);
                                    }}
                                    minDate={dateMin}
                                    maxDate={dateMax}

                                    minTime={dateMin}
                                    maxTime={dateMax}

                                    minutesStep={30}
                                />
                            </Stack>
                        </LocalizationProvider>
                        :
                        <></>
                    }
                    <div className="butn">
                        <Button variant="success" disabled={props.cart.length === 0 || props.loadingConfirm || choiceSelect === '0'}
                            onClick={() => props.confirmOrder(value, choiceSelect)}>
                            {props.loadingConfirm ? <>Submitting order <Spinner animation="border" size="sm" /></> : "Confirm Order"}
                        </Button>
                    </div>
                    <small>Remember to choose a delivery option</small>
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
