import 'bootstrap/dist/css/bootstrap.min.css';
import './MyOrderList.css';
import bookingApi from '../../api/booking-api';
import { Button, Table, Col, Row, Image, Modal, Form, Stack, CloseButton} from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import {useLocation } from 'react-router-dom';
import itLocale from 'date-fns/locale/it';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';

import TextField from '@mui/material/TextField';

import { formatDateWithoutSeconds } from '../NavBar/clock';


function MyOrderList(props) {

    const [myOrders, setMyOrders] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [timeEnabled, setTimeEnabled] = useState(false);
    const location = useLocation(); //If employee makes order for client: {userId, userName}

    let state=null;
   
   
    function updateBooking(booking, totalPrice, products, value, choice){

        console.log(products);

    
        booking = {
            userId: props.user.id,
            BookingId : booking.BookingId,
            totalPrice: totalPrice,
            PickupTime: undefined,
            DeliveryTime: undefined,
            state: 0,
            products: products.map(product => ({
               
                productId: product.ProductId, quantity: product.Qty,
            }))
        }
        

        console.log("Choice" +choice);

        if(choice==="1") {
            booking.PickupTime=value;
        } else {
            booking.DeliveryTime=value;
        }

        bookingApi.updateBooking(booking)
        .then(() => {
            setDirty(true);
            

        }).catch(err => {
           
            console.error(err);
        });

    }
    
    function deleteBooking(bookingId){
        bookingApi.deleteBooking(bookingId)
        .then(() => {
            setDirty(true);
            

        }).catch(err => {
           
            console.error(err);
        });
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
           
        }
    }

    useEffect(() => {
        const id = setInterval(checkDate, 1000);
        checkDate();
        return () => clearInterval(id);
    }, [])
    
     
    useEffect(() => {          


        const getOrdersByUserId = async () => {
            if(props.loggedIn && dirty) {                
            const myOrders = await bookingApi.getOrdersByUserId(props.user.id);  //NOSONAR         
            setMyOrders(myOrders);
            console.log(myOrders);
            }           
           
        };
        getOrdersByUserId().then(() => {
            if (dirty && props.loggedIn) {
                setDirty(false);

            }
        })
            .catch(err => {
                console.error(err);
            });

    }, [dirty, props.loggedIn]);

       

    return (
        <>          
            <Table responsive striped bordered hover className="ordersTable">
                <thead>
                    <tr>
                        <th>OrderID</th>
                        <th>Booking Issue Date </th>
                        <th>State</th>
                        <th>Scheduled Date</th>
                        <th>Total price</th>
                        <th></th> 
                        <th></th>                    
                    </tr>
                </thead>
                <tbody> {                    
                    myOrders.slice(0).reverse().map((or, index) => {                      
                        switch (or.State) {
                        case 0 :
                          state = 'Issued';
                          break;
                        case 1:
                           state = 'Pending for cancelation';
                          break;
                        case 2:
                           state = 'Paid';
                          break;
                          case 3:
                            state = 'Handed out';
                           break;
                        default:
                            state = '';
                          break;
                      }
                      return (
                        <MyOrder key={index}
                            order={or}
                            state={state}
                            deleteBooking={deleteBooking}
                            updateBooking={updateBooking}
                            timeEnabled={timeEnabled}

                        />);
                    })
                    }
                        
                
                </tbody>
            </Table>
        </>
    );
}

function MyOrder(props){
    
    

    return (
        <>       
        
            <tr>
                <td>{props.order.BookingId}</td>
                <td>{props.order.BookingStartDate}</td>
                <td>{props.state}</td>
                {props.order.PickupTime ? <td> PickupTime:  {props.order.PickupTime}  </td> : <td> DeliveryTime:{props.order.DeliveryTime} </td>}
                <td>{props.order.TotalPrice} €</td>
                <td><Button onClick={() => props.deleteBooking(props.order.BookingId)} >Delete Booking</Button></td>
               {props.timeEnabled ? 
                <td><UpdateBooking order={props.order} updateBooking={props.updateBooking} >Update Booking</UpdateBooking></td> :<td></td>
}
               </tr>
        </>
    );

}


function UpdateBooking(props) {
    const [value, setValue] = useState(props.order.PickupTime ? props.order.PickupTime : props.order.DeliveryTime);
    const [dateMin, setDateMin] = useState('');
    const [dateMax, setDateMax] = useState('');
    let currentDate = localStorage.getItem('virtualDate')
    const [choiceSelect, setChoiceSelect] = useState(props.order.PickupTime ? '1' : '2');
    const [dirtyInfo,setDirtyInfo] = useState(false);
    const [mounted,setMounted] = useState(true);
    const [show, setShow] = useState(false);
    const [products, setProducts] = useState([]);
    
    const [dataSelect, setDataSelect] = useState(0);
    
    const [cartTotalPrice, setCartTotalPrice] = useState({TotalPrice : props.order.TotalPrice, fee : props.order.PickupTime ? 0 :  3 });
    const close = () => {setShow(false); setProducts([]); setCartTotalPrice(props.order.TotalPrice)}
    const open = () => {setShow(true); setMounted(true)};

    const updateChoice = (choice) => {
        setChoiceSelect(choice);
        setFee(choice);
    }
 
    useEffect(() => {      


        const getProductsFromBooking = async () => {
            if(mounted) {                
            const productsFromBooking = await bookingApi.getProductsFromBooking(props.order.BookingId);  //NOSONAR         
            setProducts(productsFromBooking);
            console.log(productsFromBooking);
            }           
           
        };
        getProductsFromBooking().then(() => {
            if (mounted) {
                setMounted(false);

            }
        })
            .catch(err => {
                console.error(err);
            });

    }, [mounted]);

   
    const setFee = (choice) => {
        if (choice === '2') {
            setCartTotalPrice({ ...cartTotalPrice, fee: 3 });
        }
        else {
            setCartTotalPrice({ ...cartTotalPrice, fee: 0 });
        }
        setDirtyInfo(true);
    }


    const deleteProductFromCart = (removeId) => {
        setProducts(products => products.filter(product => product.ProductId !== removeId));
        setDirtyInfo(true);
    }

    const modifyProductInCart = (modifyId, addQuantity, type) => {
        if (type === 1) { //+1 or -1
            const newQuantity = products.filter(product => product.ProductId === modifyId)[0].Qty + addQuantity;
            
            console.log(modifyId)
            console.log(products.map(product => product.ProductId === modifyId))
            if (newQuantity === 0) {
                deleteProductFromCart(modifyId);
            }
            else {
                console.log("Neq qty " +newQuantity);
                setProducts(products => products.map(product => product.ProductId === modifyId ? { ...product, Qty: newQuantity } : product));
                console.log(products);
            }
        }
        else { //input number field
            addQuantity = Number.parseInt(addQuantity);
            if (addQuantity === 0) {
                deleteProductFromCart(modifyId);
            }
            else {
                setProducts(products => products.map(product => product.ProductId === modifyId ?
                    { ...product, Qty: (addQuantity > product.Quantity) ? product.Qty : addQuantity } : product));
            }
        }
        setDirtyInfo(true);
    }

    
    useEffect(() => {
        if (dirtyInfo === true) {           
            let price = 0;

            if (products.length !== 0) {
                for (const product of products) {
                    console.log(product);
                    price += product.Qty * product.PricePerUnit;
                    
                }
            }

           console.log(price);

            setCartTotalPrice({...cartTotalPrice, TotalPrice: (price + cartTotalPrice.fee).toFixed(2)});
           
            setDirtyInfo(false);
        }
    }, [dirtyInfo])


    
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
         <Button data-testid="cartButton" className="buttonUpdate" onClick={open}>
          Update Booking
        </Button>

        <Modal data-testid="cartModal" show={show} onHide={close} scrollable>
            <Modal.Header style={{ backgroundColor: "#afcbd6" }}>
                <Col style={{ textAlign: "center" }}>
                    <Row>
                        <Col xs={15} md={11}>
                            <h3>
                               
                                <b>Subtotal: € {cartTotalPrice.TotalPrice}</b>
                            </h3>
                            {cartTotalPrice.fee !== 0 && "Delivery fees included"}
                        </Col>
                        <Col xs={3} md={1}>
                            <CloseButton onClick={close} />
                        </Col>
                    </Row>
                    <br />
                    <Form.Select disabled={props.order.Qty === 0 } onChange={e => updateChoice(e.target.value)}>                        
                        <option value='1' selected = {props.order.PickupTime}>Pick-up date</option>
                        <option value='2' selected = {props.order.DeliveryTime}>Delivery at home (€ 3.00)</option>
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
                                        setDataSelect(1);
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
                        <Button variant="success" disabled={props.order.Qty === 0 || choiceSelect === '0' }
                            onClick={ () => {props.updateBooking(props.order, cartTotalPrice.TotalPrice, products,formatDateWithoutSeconds(value), choiceSelect); close()}}> Update
                        </Button>
                    </div>
                    <small>Remember to choose a delivery option</small>
                    <br />
                   
                      </Col>
            </Modal.Header>
            <Modal.Body>
                {props.order.Qty === 0 ? <h2 style={{ textAlign: 'center' }}>Cart is empty</h2>
                    : products.map(product =>
                        <ProductUpdate key={product.Id} product={product}
                            modifyProductInCart={modifyProductInCart} deleteProductFromCart={deleteProductFromCart} />)}
            </Modal.Body>
        </Modal>
    </>);
}

function ProductUpdate(props) {
    return (
        <Row style={{ borderBottom: "2px solid black", paddingTop: "5%", paddingBottom: "5%" }}>
            <Button className="cartButtons delete" variant="danger" onClick={() => props.deleteProductFromCart(props.product.ProductId)}>X</Button>
            <Col>
                <Image src={require('../../../public/ProductImages/' + props.product.ImagePath).default} fluid thumbnail />
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "25px" }}>{props.product.Name} </div>
              </Col>
            <Col style={{ textAlign: "center" }}>
                <br />
                <br />
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "25px" }}>€ {props.product.PricePerUnit} &nbsp; </div>
                <br />
                <Row>
                    <Col style={{ padding: "0px" }}>
                        <Button className="cartButtons" variant="primary"
                            disabled={props.product.Qty === 0} onClick={() => props.modifyProductInCart(props.product.ProductId, -1, 1)}>-</Button>
                    </Col>
                    <Col>
                        <input className="quantity-text " type="number" min={0} onChange={e => props.modifyProductInCart(props.product.ProductId, !e.target.value ? 0 : e.target.value, 2)}
                            value={Number(props.product.Qty).toString()} > 
                        </input>
                    </Col>
                    <Col style={{ padding: "0px" }}>
                        <Button className="cartButtons" variant="primary"
                            disabled={props.product.Quantity === props.product.Qty}
                            onClick={() => props.modifyProductInCart(props.product.ProductId, +1, 1)}>+</Button>
                    </Col>
                </Row>
                {props.product.Quantity === props.product.Qty && <small style={{ color: "red" }}>Max quantity reached</small>}
                <br />
                <div style={{ fontSize: "15px" }}>{props.product.Quantity} pieces available</div>
            </Col>
        </Row>
    );
}

export {MyOrderList, MyOrder};