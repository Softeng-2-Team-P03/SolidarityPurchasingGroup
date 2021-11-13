import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductList.css';
import { Col, Row, Button, Card, Form, Spinner } from "react-bootstrap";
import SideBar from "../SideBar/SideBar";
import Cart from "../Cart/Cart"
import productApi from '../../api/product-api';
import bookingApi from '../../api/booking-api';
import mainLogo from "../Icons/cipolle-dorate-bio.jpg";
import React, { useState, useEffect } from "react";
import API from '../../API';
import prova from '../ProductImages/p48-1.jpg'

function ProductList(props) {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartInfo, setCartInfo] = useState({ numItems: 0, totalPrice: 0 });
    const [dirtyInfo, setDirtyInfo] = useState(false);

    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingConfirm, setLoadingConfirm] = useState(false);

    const [errorConfirm, setErrorConfirm] = useState('');
    const [errorLoading, setErrorLoading] = useState('');

    /*useEffect(() => {
        const checkAuth = async () => {
            try {
                // here you have the user info, if already logged in
                // TODO: store them somewhere and use them, if needed
                var x = await productApi.getAllProduct();
                console.log("list:" + x);
            } catch (err) {
                console.error(err.error);
            }
        };
        checkAuth();
    }, []);*/

    useEffect(() => {
        if (dirtyInfo === true) {
            let num = 0;
            let price = 0;

            if (cart.length !== 0) {
                for (const product of cart) {
                    num += product.selectedQuantity;
                    price += product.selectedQuantity * product.pricePerUnit;
                }
            }

            setCartInfo({ numItems: num, totalPrice: price.toFixed(2) })
            setDirtyInfo(false);
        }
    }, [dirtyInfo])

    function changeSearchText(text) {
        let p = []
        props.products.forEach(x => {
            if (x.name.toLowerCase().includes(text.toLowerCase())) p.push(x);
        })

        setProducts(p);
    }

    useEffect(() => {
        setLoadingProducts(true);
        productApi.getAllProducts().then((products) => {
            setProducts(products.map(product => ({ ...product, pricePerUnit: product.pricePerUnit.toFixed(2) })));
            setLoadingProducts(false);
            setErrorLoading('');
        }).catch(err => {
            setErrorLoading('Error during the loading of the products')
            console.error(err);
        });
    }, [])

    const confirmOrder = () => {
        const booking = {
            userId: 2,
            bookingStartDate: "2021-11-15", //waiting for virtual clock to implement
            totalPrice: cartInfo.totalPrice,
            pickupTime: "2021-11-17",
            deliveryTime: undefined,
            state: 0,
            products: cart.map(product => ({
                productId: product.id, quantity: product.selectedQuantity,
                price: (product.selectedQuantity * product.pricePerUnit).toFixed(2)
            }))
        }
        setLoadingConfirm(true);
        bookingApi.addBooking(booking)
            .then(() => {
                setLoadingConfirm(false);
                setCart([]);
                setCartInfo({ numItems: 0, totalPrice: 0 });
                setErrorConfirm('');
            }).catch(err => {
                setErrorConfirm('Error during the confirmation of the order')
                console.error(err);
            });
    }

    function addProductToCart(newProduct) {
        const alreadyIn = cart.filter(product => product.id === newProduct.id)[0] !== undefined ? true : false;

        if (alreadyIn) {
            setCart(oldCart => oldCart.map(product => product.id === newProduct.id ?
                {
                    ...product, selectedQuantity: (product.selectedQuantity + newProduct.selectedQuantity) > product.quantity ? product.quantity
                        : product.selectedQuantity + newProduct.selectedQuantity
                } //The cart adds max the product quantity
                : product));
        }
        else {
            setCart(oldCart => [...oldCart, newProduct]);
        }

        setDirtyInfo(true);
    }

    const deleteProductFromCart = (removeId) => {
        setCart(oldCart => oldCart.filter(product => product.id !== removeId));
        setDirtyInfo(true);
    }

    const modifyProductInCart = (modifyId, addQuantity) => {
        const newQuantity = cart.filter(product => product.id === modifyId)[0].selectedQuantity + addQuantity;

        if (newQuantity === 0) {
            deleteProductFromCart(modifyId);
        }
        else {
            setCart(oldCart => oldCart.map(product => product.id === modifyId ? { ...product, selectedQuantity: newQuantity } : product));
        }
        setDirtyInfo(true);
    }



    return (
        <>
            <Row className="searchProd">
                <Form.Control type="text" placeholder="Search product" onChange={x => changeSearchText(x.target.value)} />
            </Row>
            <Row>
                <Col xs={2} md={2}>
                    <SideBar loadingProducts={loadingProducts} />
                </Col>
                <Col xs={10} md={10} className="main">
                    {loadingProducts ?
                        <h1 style={{ textAlign: "center" }}>Loading products... <Spinner animation="border" /></h1> :
                        <Row xs={2} md={5} className="g-4">
                            {products.map((x) =>
                                <Product key={x.id}
                                    product={x} addProductToCart={addProductToCart}
                                    productInCart={cart.filter(product => product.id === x.id)[0] === undefined ? 0
                                        : cart.filter(product => product.id === x.id)[0].selectedQuantity}
                                />)
                            }
                        </Row>
                    }
                    <h2 style={{textAlign: "center", color: "red"}}>{errorLoading}</h2>
                </Col>
            </Row>
            <Cart cart={cart} cartInfo={cartInfo} deleteProductFromCart={deleteProductFromCart}
                modifyProductInCart={modifyProductInCart} confirmOrder={confirmOrder} loadingConfirm={loadingConfirm}
                errorConfirm={errorConfirm} />
        </>
    );
}

function Product(props) {

    const [quantity, setQuantity] = useState(0);

    const modifyQuantity = (add) => {
        setQuantity(quantity + add);
    }

    const addToBasket = () => {
        props.addProductToCart({ ...props.product, selectedQuantity: quantity });
        setQuantity(0);
    }



    return (
        <Col>
            <Card className="text-center">
                <Card.Img variant="top" src={require('../ProductImages/' + props.product.imagePath).default} />
                <Card.Body>
                    <h2>{props.product.name}</h2>
                    <Card.Text>
                        {props.product.description}
                    </Card.Text>

                    <h4>
                        € {props.product.pricePerUnit}
                    </h4>
                </Card.Body>
                <Card.Footer>
                    <h6>{props.product.quantity} pieces available</h6>
                </Card.Footer>
                <Card.Footer>
                    <small className="text-muted">Farmer: {props.product.farmer.name} {props.product.farmer.surname}</small>
                </Card.Footer>
                <Card.Footer>
                    <Button className="button" variant="primary" disabled={quantity === 0}
                        onClick={() => modifyQuantity(-1)}>-</Button>{' '}
                    <small className="text"> {quantity} </small>
                    <Button className="button" variant="primary" disabled={quantity === props.product.quantity}
                        onClick={() => modifyQuantity(+1)}>+</Button>{' '}
                    <br />
                    {quantity === props.product.quantity ?
                        <small style={{ color: "red" }}>Max quantity reached</small> : <></>}
                </Card.Footer>
                <Card.Footer>
                    <Button variant="success" onClick={() => addToBasket()} disabled={quantity === 0}>Add to basket</Button>{' '}
                </Card.Footer>
            </Card>
        </Col>
    );
}

export default ProductList;
