import bookingApi from '../../api/booking-api';
import { Button, Table ,Modal} from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import Order from '../OrderList/Order';

function ModalClientOrders(props) {
const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorLoading, setErrorLoading] = useState(''); //Error in loading orders

  useEffect(() => {

    bookingApi.getOrdersByUserId(props.client.id).then((orders) => {
              console.log("orders:");
              console.log(orders);
              console.log(".............");
                setOrders(orders.map(order => ({ ...order})));
                setLoadingProducts(false);
            }).catch(err => {
                setErrorLoading('Error during the loading of the orders')
                console.error(err);
            });
        }, []);
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Show Orders
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        size="xl"
        dialogClassName="modal-90w"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>The Order List Of {props.client.name + " " +props.client.surname }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Modal.Body>
          <Table responsive striped bordered hover className="ordersTable">
                <thead>
                    <tr>
                        <th>OrderID</th>
                        <th>UserId</th>
                        <th>Name And Surname</th>
                        <th>Booking Issue Date </th>
                        <th>State</th>
                        <th>Scheduled Date</th>
                        <th>Total price</th>
                        <th>Handed out</th>
                        <th width="13%"></th>
                    </tr>
                </thead>
                <tbody> {
                    orders.map((or) =>
                        <Order key={or.BookingID}
                            order={or}
                        />)
                }
                </tbody>
            </Table>
          </Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
  export default ModalClientOrders; 