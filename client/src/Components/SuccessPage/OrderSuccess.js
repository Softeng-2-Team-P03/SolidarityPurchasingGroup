import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderSuccess.css';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { Table, Image, Button, Alert } from "react-bootstrap";


function OrderSuccess() {
    const location = useLocation();
    console.log(location.state);
    const allOk = (location.state && location.state.orderId && location.state.booking && location.state.booking.products);

    const formatData = (input) => {
        const fields = input.split(' ');
        const date = fields[0].split('-');
        const time = fields[1];
        const year = date[0]
        const month = date[1];
        const day = date[2];
        return day + '/' + month + '/' + year + ' at ' + time;
    }

    return (
        <>
            {!allOk && <Redirect to='/' />}
            <div className="containerSuccess">
                <section className="confirmation">
                    <h1>Booking #{allOk && location.state.orderId} has been received</h1>
                    {location.state.errorWallet.length > 0 ?
                        <Alert key={2233} variant="danger"  >
                            {location.state.errorWallet}
                        </Alert>
                        : ""
                    }
                    <br/>
                    <h4>
                        {location.state.booking.pickupTime !== undefined && <>Pick-up info: {formatData(location.state.booking.pickupTime)}</>}
                        {location.state.booking.deliveryTime !== undefined && <>Delivery info: {formatData(location.state.booking.deliveryTime)}</>}
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
