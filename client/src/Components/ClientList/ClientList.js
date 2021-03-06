
import 'bootstrap/dist/css/bootstrap.min.css';
import './ClientList.css';
import { Button, Form, Table, Modal, Alert } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddClientBtn, } from './AddClient';
import API from '../../API';
import userApi from '../../api/user-api';
import ModalClientOrderes from './ModalClientOrders';

function Client(props) {
    return (
        <>
            <tr>
                <td>{props.client.name}</td>
                <td>{props.client.surname}</td>
                <td>{props.client.email}</td>
                <td >
                    <WalletTopUpModal client={props.client} setConfirmationMessage={props.setConfirmationMessage} />
                </td>
                <td >
                    <Link to={{ pathname: '/products', state: { userId: props.client.id, userName: props.client.name } }}>
                        <Button className="buttonNewOrder" variant="primary"> New Order </Button>
                    </Link>
                </td>
                <td>
                    <ModalClientOrderes client={props.client} ></ModalClientOrderes>
                </td>
            </tr>
        </>
    );
}



function ClientList(props) {
    let clients = [];
    const [resultC, setResultC] = useState([]);
    const [searchClients, setSearchClients] = useState([]);
    const [confirmationMessage, setConfirmationMessage] = useState('');


    useEffect(() => {
        let mounted = true;

        const getAllClients = async () => {
            clients = await API.getAllClients();
        };
        getAllClients().then(data => {
            if (mounted) {
                setResultC(clients);
                setSearchClients(clients);

            }
        })
            .catch(err => {
                console.error(err);
            });
        return () => { mounted = false };
    }, []);



    function changeSearchText(text) {
        let c = []
        resultC.forEach(x => {
            if (x.email.toLowerCase().includes(text.toLowerCase())) c.push(x);
        })

        setSearchClients(c);

    }



    return (
        <>
            {confirmationMessage ?
                <Alert color="danger">
                    {confirmationMessage}
                </Alert> : ''}


            <Form.Control type="text" className="searchB" placeholder="Search client" onChange={x => changeSearchText(x.target.value)} />
            <Table responsive striped bordered hover className="clientsTable" style={{textAlign: "center"}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th width="13%"></th>
                        <th width="13%"></th>
                    </tr>
                </thead>
                <tbody>{searchClients.map((cl) =>
                        <Client key={cl.id}
                            client={cl} setConfirmationMessage={setConfirmationMessage}
                        />)}
                </tbody>
            </Table>
            <Link to="/addClient"><AddClientBtn /></Link>
        </>
    );
}

function WalletTopUpModal(props) {
    const [amountTopUp, setAmountTopUp] = useState(0);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        let newWallet = props.client.wallet + parseInt(amountTopUp);
        userApi.chargeWallet(props.client.id, newWallet ).then((orderId) => {
            props.setConfirmationMessage('wallet succesfully updated');
        }).catch(err => {
            props.setConfirmationMessage('Error during the wallet top up');
            console.error(err);
        });
    }


    return (
        <>
            <span onClick={handleShow}>
                <Button className="d-none d-sm-block mx-auto" variant="success" >
                    Top Up Wallet
                </Button>
            </span>


            <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> Wallet info </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h6><b>{props.client.name} {props.client.surname}'s Credit: </b>{props.client.wallet.toFixed(2)}</h6><br></br>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Amount of money to Top up in the user wallet :</Form.Label>
                            <Form.Control type="number" placeholder="Enter amount" onChange={(ev) => setAmountTopUp(ev.target.value)} />

                        </Form.Group>


                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>


            </Modal>
        </>
    )
}

export { ClientList, WalletTopUpModal };
