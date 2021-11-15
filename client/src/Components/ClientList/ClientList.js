
import 'bootstrap/dist/css/bootstrap.min.css';
import './ClientList.css';
import { Button, Form, Table, Modal } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddClientBtn, } from './AddClient';
import API from '../../API';


function Client(props) {
    return (
        <>
            <tr>
                <td>{props.client.name}</td>
                <td>{props.client.surname}</td>
                <td>{props.client.email}</td>
                <td >
                    <WalletTopUpModal client={props.client} />
                </td>
                <td >
                    <Link to={{ pathname: '/products', state: { userId: props.client.id, userName: props.client.name } }}>
                        <Button className="buttonNewOrder" variant="primary"> New Order </Button>
                    </Link>
                </td>
            </tr>
        </>
    );
}



function ClientList(props) {
    let clients = [];
    const [resultC, setResultC] = useState([]);
    const [searchClients, setSearchClients] = useState([]);


    useEffect(() => {
        let mounted = true;

        const getAllClients = async () => {
            clients = await API.getAllClients();
        };
        getAllClients().then(data => {
            if (mounted) {
                setResultC(clients);
                setSearchClients(clients);
                console.log(clients);

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

            <Form.Control type="text" className="searchB" placeholder="Search client" onChange={x => changeSearchText(x.target.value)} />
            <Table responsive striped bordered hover className="clientsTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th width="13%"></th>
                    </tr>
                </thead>
                <tbody> {
                    searchClients.map((cl) =>
                        <Client key={cl.userId}
                            client={cl}
                        />)

                }
                </tbody>
            </Table>
            <Link to="/addClient"><AddClientBtn /></Link>
        </>
    );
}

function WalletTopUpModal(props) {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (event) => {
        event.preventDefault();

    };

    return (
        <>
            <span onClick={handleShow}>
                <Button className="d-none d-sm-block mx-auto" variant="success" >
                    Top Up Wallet
                </Button>
            </span>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> Wallet info </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h6><b>{props.client.name} {props.client.surname}'s Credit: </b>{props.client.wallet}</h6><br></br>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Amount of money to Top up in the user wallet :</Form.Label>
                            <Form.Control placeholder="Enter amount" />
                            
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
