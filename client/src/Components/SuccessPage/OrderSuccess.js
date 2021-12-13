import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderSuccess.css';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { Table, Image, Button, Alert } from "react-bootstrap";
import { formatDateEuropean } from '../NavBar/clock';



function OrderSuccess() {
    const location = useLocation();
    console.log(location.state);
    const allOk = (location.state && location.state.orderId && location.state.booking && location.state.booking.products);

    return (
        <>
            {!allOk && <Redirect to='/' />}
            <div className="containerSuccess">
                <section className="confirmation">
                    <h1>Booking #{allOk && location.state.orderId} {(allOk && location.state.booking.userName) ?
                        `for ${location.state.booking.userName}` : <></>} has been received</h1>
                    {location.state.errorWallet.length > 0 ?
                        <Alert key={2233} variant="danger"  >
                            {location.state.errorWallet}
                        </Alert>
                        : ""
                    }
                    <br />
                    <h4>
                        {allOk && location.state.booking.pickupTime !== undefined && <>Pick-up info: {formatDateEuropean(location.state.booking.pickupTime)}</>}
                        {allOk && location.state.booking.deliveryTime !== undefined && <>Delivery info: {formatDateEuropean(location.state.booking.deliveryTime)}</>}
                    </h4>
                    <br />
                    <Link to='/' >
                        <Button>Go to Homepage</Button>
                    </Link>
                    <br />
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th width="15%">Product</th>
                                <th>Quantity</th>
                                <th>Price (Total: € {allOk && location.state.booking.totalPrice})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allOk ? location.state.booking.products.map((product) =>
                                    <Product key={product.productId} product={product} />)
                                    : <></>
                            }
                            {allOk && location.state.booking.deliveryTime !== undefined && <>
                                <tr>
                                    <td>Delivery</td>
                                    <td>1</td>
                                    <td>€ 3.00</td>
                                </tr>
                            </>}
                            <td></td>
                            <td></td>
                            <td>Total: € {allOk && location.state.booking.totalPrice}</td>
                        </tbody>
                    </Table>
                </section>
            </div>
        </>
    );
}

function Product(props) {
    return (
        <>
            <tr>
                <td><Image src={require('../../../public/ProductImages/' + props.product.imagePath).default} thumbnail /> {props.product.name} </td>
                <td>{props.product.quantity}</td>
                <td> € {props.product.price}</td>
            </tr>
        </>
    );
}

export default OrderSuccess;
