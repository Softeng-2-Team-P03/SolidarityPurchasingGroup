import 'bootstrap/dist/css/bootstrap.min.css';
import './MyOrderList.css';
import bookingApi from '../../api/booking-api';
import { Button, Form, Table } from "react-bootstrap";
import React, { useEffect, useState } from 'react';


function MyOrderList(props) {

    const [myOrders, setMyOrders] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [timeEnabled, setTimeEnabled] = useState(false);

    let state=null;
   
   
    function updateBooking(bookingId){

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
      //  setTimeToString(localStorage.getItem('virtualDateToString'));
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
            const myOrders = await bookingApi.getOrdersByUserId(props.user.id);           
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
                    myOrders.map((or, index) => {                      
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
                {props.order.PickupTime ? <td> {props.order.PickupTime} </td> : <td> {props.order.DeliveryTime} </td>}
                <td>{props.order.TotalPrice}</td>
                <td><Button onClick={() => props.deleteBooking(props.order.BookingId)} >Delete Booking</Button></td>
               {props.timeEnabled ? 
                <td><Button onClick={() => props.updateBooking(props.order.BookingId)} >Update Booking</Button></td> :<td></td>
}
               </tr>
        </>
    );

}

export {MyOrderList, MyOrder};