import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductList.css';
import { Col, Row, Button, Card, Form, Spinner } from "react-bootstrap";
import SideBar from "../SideBar/SideBar";
import Cart from "../Cart/Cart"
import productApi from '../../api/product-api';
import bookingApi from '../../api/booking-api';
import { Redirect, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";



function ProductList(props) {
    const location = useLocation(); //If employee makes order for client: {userId, userName}

    const [products, setProducts] = useState([]); //All products retrieved from server
    const [searchProducts, setSearchProducts] = useState([]); //Products shown through filters
    const [types, setTypes] = useState([]); //Types of products retrieved from server
    const [cart, setCart] = useState([]); //Products in cart
    const [cartInfo, setCartInfo] = useState({ numItems: 0, totalPrice: 0 }); //Cart info
    const [dirtyInfo, setDirtyInfo] = useState(false); //If cart info needs to be recalculated
    const [category, setCategory] = useState(0); //Current typeId filter
    const [canSeeCart, setCanSeeCart] = useState(false);
    const [timeEnabled, setTimeEnabled] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(undefined);

    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [loadingConfirm, setLoadingConfirm] = useState(false);

    const [errorConfirm, setErrorConfirm] = useState(''); //Error in submitting order
    const [errorLoading, setErrorLoading] = useState(''); //Error in loading products/types

    function changeSearchText(text) {
        let p = []
        products.forEach(x => {
            if (x.name.toLowerCase().includes(text.toLowerCase())) p.push(x);
        })

        setSearchProducts(p);
    }

    const checkDate = () => {
        let time = new Date(localStorage.getItem('virtualDate'));
        const day = time.getDay();
        const hour = time.getHours();
        if ((day === 6 && hour >= 9) || (day === 0 && hour <= 22)) {
            setTimeEnabled(true);
        }
        else {
            setTimeEnabled(false);
            if (cart !== []) {
                setCart([]);
                setCartInfo({ numItems: 0, totalPrice: 0 });
            }
        }
    }
// function to create the right date format 
    const createDate = (time) => {
        const day = time.getDate();
        const month = time.getMonth() + 1;
        const year = time.getFullYear();
        let date = year.toString()+"-";
        if (month > 9) {
            date+=month.toString()+"-"; 
        } else {
            date+= "0"+month.toString()+"-";
        }
        if (day > 9) {
            date+=day.toString(); 
        } else {
            date+= "0"+day.toString();
        }
        return date;
    }

    useEffect(() => {
        if (props.loggedIn && props.user !== undefined) {
            if (location.state && location.state.userId) {
                setCanSeeCart([1, 2].includes(props.user.accessType)); //user is employee/manager with client id in location state
            }
            else {
                setCanSeeCart(props.user.accessType === 3); //user is client
            }
        }
        else {
            setCanSeeCart(false);
        }
    }, [props.loggedIn, props.user, location.state])

    useEffect(() => {
        const id = setInterval(checkDate, 1000);
        checkDate();
        return () => clearInterval(id);
    }, [])

    useEffect(() => {
        let time = new Date(localStorage.getItem('virtualDate'));
        let date = createDate(time);

        productApi.getAllProducts(date).then((products) => { //NOSONAR
            setProducts(products.map(product => ({ ...product, pricePerUnit: product.pricePerUnit.toFixed(2) })));
            setSearchProducts(products.map(product => ({ ...product, pricePerUnit: product.pricePerUnit.toFixed(2) })));
            setLoadingProducts(false);
            productApi.getProductTypes().then((types) => {//NOSONAR
                setTypes(types);
                setLoadingTypes(false);
                setErrorLoading('');
            }).catch(err => {
                setErrorLoading('Error during the loading of the types')
                console.error(err);
            })
        }).catch(err => {
            setErrorLoading('Error during the loading of the products')
            console.error(err);
        });
    }, [])

    function setProductsLoaded(products){ //NOSONAR
        setProducts(products.map(product => ({ ...product, pricePerUnit: product.pricePerUnit.toFixed(2) })));
        setSearchProducts(products.map(product => ({ ...product, pricePerUnit: product.pricePerUnit.toFixed(2) })));
        setLoadingProducts(false);
        setErrorLoading('');
    }

    useEffect(() => {
        let time = new Date(localStorage.getItem('virtualDate'));
        let date= createDate(time);
        if (category !== 0) {
            setLoadingProducts(true);
            productApi.getProductsByType(category,date).then((products) => { //NOSONAR
                setProductsLoaded(products);
            }).catch(err => {
                setErrorLoading('Error during the loading of the products')
                console.error(err);
            })
        }
        else {
            setLoadingProducts(true);
            productApi.getAllProducts(date).then((products) => {//NOSONAR
                setProductsLoaded(products);
            }).catch(err => {
                setErrorLoading('Error during the loading of the products')
                console.error(err);
            })
        }
    }, [category])

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

    const confirmOrder = () => {
        const booking = {
            userId: (location.state && location.state.userId) ? location.state.userId : undefined,
            bookingStartDate: localStorage.getItem("virtualDateToString"),
            totalPrice: cartInfo.totalPrice,
            pickupTime: undefined,
            deliveryTime: undefined,
            state: 0,
            products: cart.map(product => ({
                imagePath: product.imagePath, name: product.name,
                productId: product.id, quantity: product.selectedQuantity,
                price: (product.selectedQuantity * product.pricePerUnit).toFixed(2)
            }))
        }

        setLoadingConfirm(true);
        bookingApi.getWalletBalance()
        .then((wallet) => {
            setLoadingConfirm(false);
            console.log("wallet");
            console.log(wallet["Wallet"])
            if (wallet["Wallet"] < cartInfo.totalPrice) {
                setErrorConfirm('Your Booked is registred ,But Your wallet balance is not enough, Please increase');
                setLoadingConfirm(false);
            }
        }).catch(err => {
            console.error(err);
        });
        
        bookingApi.addBooking(booking)
            .then((orderId) => {
                setLoadingConfirm(false);
                setCart([]);
                setCartInfo({ numItems: 0, totalPrice: 0 });
                setErrorConfirm('');
                setOrderConfirmed({ orderId: orderId, booking: booking });
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

    const modifyProductInCart = (modifyId, addQuantity, type) => {
        if (type === 1) {
            const newQuantity = Number.parseInt(cart.filter(product => product.id === modifyId)[0].selectedQuantity) +Number.parseInt( addQuantity);
            if (newQuantity === 0) {
                deleteProductFromCart(modifyId);
            }
            else {
                setCart(oldCart => oldCart.map(product => product.id === modifyId ? { ...product, selectedQuantity: newQuantity } : product));
            }
        }
        else {
        setCart(oldCart => oldCart.map(product => product.id === modifyId ? { ...product, selectedQuantity:   Number.parseInt(  addQuantity) } : product));
        }
        setDirtyInfo(true);
    }

    const changeQuantityFromInput = (modifyId, newQuantity) => {
        if (newQuantity === 0) {
            deleteProductFromCart(modifyId);
        }
        else{
            setCart(oldCart => oldCart.map(product => product.id === modifyId ? { ...product, selectedQuantity: newQuantity } : product));

        }
    }

    const changeCategory = (value) => {
        setCategory(value);
    }

    return (
        <>
            {orderConfirmed !== undefined && <Redirect to={{ pathname: '/success', state: orderConfirmed }} />}
            <Row className="searchProd">
                <Form.Control type="text" placeholder="Search product" onChange={x => changeSearchText(x.target.value)} />
            </Row>
            <Row>
                <Col xs={2} md={2}>
                    <SideBar loadingTypes={loadingTypes} changeCategory={changeCategory} types={types} category={category} />
                </Col>
                <Col xs={10} md={10} className="main">
                    {loadingProducts ?
                        <h1 style={{ textAlign: "center" }}>Loading products... <Spinner animation="border" /></h1> :
                        <Row xs={2} md={5} className="g-4">
                            {searchProducts.map((x) =>
                                <Product key={x.id} canShop={timeEnabled && canSeeCart}
                                    product={x} addProductToCart={addProductToCart}
                                    productInCart={cart.filter(product => product.id === x.id)[0] === undefined ? 0
                                        : cart.filter(product => product.id === x.id)[0].selectedQuantity}
                                />)
                            }
                        </Row>
                    }
                    <h2 style={{ textAlign: "center", color: "red" }}>{errorLoading}</h2>
                </Col>
            </Row>
            {(timeEnabled && canSeeCart) ?
                <Cart cart={cart} cartInfo={cartInfo} deleteProductFromCart={deleteProductFromCart} changeQuantityFromInput={changeQuantityFromInput}
                    modifyProductInCart={modifyProductInCart} confirmOrder={confirmOrder} loadingConfirm={loadingConfirm}
                    errorConfirm={errorConfirm} userName={location.state && location.state.userName} />
                : <></>}
        </>
    );
}

function Product(props) {

    const [quantity, setQuantity] = useState(0);

    const modifyQuantity = (add) => {
        setQuantity(Number.parseInt(quantity) + Number.parseInt(add));
    }
    const modifyQuantityFromInput = (add) => {
        setQuantity(Number.parseInt(add));
    }
    const addToBasket = () => {
        props.addProductToCart({ ...props.product, selectedQuantity: quantity });
        setQuantity(0);
    }



    return (
        <Col>
            <Card className="text-center">
                <Card.Img variant="top" src={require('../../../public/ProductImages/' + props.product.imagePath).default} />
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
                {props.canShop ? <>
                    <Card.Footer>
                        <Button className="button" variant="primary" disabled={quantity === 0}
                            onClick={() => modifyQuantity(-1)}>-</Button>{' '}
                        <input className="quantity-text " type="text" onChange={e => modifyQuantityFromInput(e.target.value)} value={quantity} >
                        </input>
                        <Button className="button" variant="primary" disabled={quantity === props.product.quantity}
                            onClick={() => modifyQuantity(+1)}>+</Button>{' '}
                        <br />
                        {quantity === props.product.quantity ?
                            <small style={{ color: "red" }}>Max quantity reached</small> : <></>}
                    </Card.Footer>
                    <Card.Footer>
                        <Button variant="success" onClick={() => addToBasket()} disabled={quantity === 0}>Add to basket</Button>{' '}
                    </Card.Footer>
                </>
                    : <> </>
                }
            </Card>
        </Col>
    );
}

export default ProductList;
