import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {ListGroup, Table, Button, Row, Col, Modal, Form, Dropdown, Image, Alert} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import {AddClientForm} from "../ClientList/AddClient";
import {Client} from "../Client";
import './FarmerHome.css'
import API from "../../API";
import FileUpload from "../FileUpload/FileUpload";

function FarmerHome() {

    const [show, setShow] = useState(false);
    const [showSell, setShowSell] = useState(false);
    const [edit, setEdit] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [dirty, setDirty] = useState(false);

    const [productToEdit, setProductToEdit] = useState();
    let prod = [];
    let prodSell = [];
    const [products, setProducts] = useState([]);
    const [productsSell, setProductsSell] = useState([]);
    let user;
    const [farmer, setFarmer] = useState([]);



    useEffect(() => {
        let mounted = true;

        const getProdFarmer = async () => {
            user = await API.getUserInfo();
            setFarmer(user);
            prod = await API.getProdFarmer(user.id, 0);
            prodSell = await API.getProdFarmer(user.id, 1);
        };
        getProdFarmer().then(data => {
            if (mounted) {
                setProducts(prod);
                setProductsSell(prodSell);
                setConfirm(true);
            }
        })
            .catch(err => {
                console.error(err);
            });
        return () => {
            mounted = false
        };
    }, [confirm,dirty]);




    const handleClose = () => {
        setShow(false);
    }

    const handleCloseEdit = () => {
        setEdit(false);
    }


        return (

            <>


                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>New product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddProductForm handleClose={handleClose} idFarmer={farmer} setDirty={setDirty} dirty={dirty}/>

                    </Modal.Body>
                </Modal>


                <Modal show={edit} onHide={handleCloseEdit} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <EditProductForm productToEdit={productToEdit} handleCloseEdit={handleCloseEdit}/>

                    </Modal.Body>

                </Modal>




                <ListGroup className="prodL">
                    {products.map((x) => (


                            <ListGroup.Item>
                                <Row>
                                    <Col md="2">
                                        <img className="ima"
                                             src={require('../../../public/ProductImages/' + "p" + x.Id.toString() + "-1.jpg").default}/>
                                    </Col>
                                    <Col md="2"><h4 className="textP">{x.Name}</h4></Col>
                                    <Col md="2"><h4 className="textP">QTY:{x.Quantity}</h4></Col>
                                    <Col md="2"><h6 className="toConf" color="red">to confirm</h6></Col>
                                    <Col md="2"><Button className="buttonEdit" variant="secondary" onClick={() => {
                                        setEdit(true);
                                        setProductToEdit(x);
                                    }
                                    }>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                             className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path
                                                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                        </svg>
                                        Edit Product</Button></Col>
                                    <Col md="2"><Button className="buttonConfirm" variant="success" onClick={() => {
                                        API.updateProductState(1, x.Id).catch(err => console.log(err));
                                        setConfirm(false);



                                    }}>Confirm</Button></Col>

                                </Row>
                            </ListGroup.Item>
                        )
                    )}
                </ListGroup>


                <Alert variant="success">

                    {showSell ? (

                        <ListGroup className="prodL">
                            {productsSell.map((x) => (
                                    <Row>
                                        <Col md="2">
                                            <img className="ima"
                                                 src={require('../../../public/ProductImages/' + "p" + x.Id.toString() + "-1.jpg").default}/>
                                        </Col>
                                        <Col md="2"><h4 className="textP">{x.Name}</h4></Col>
                                        <Col md="2"><h4 className="textP">QTY:{x.Quantity}</h4></Col>
                                        <Col md="2"><h6 className="Conf">confirmed</h6></Col>

                                        <hr className="rowDiv"/>
                                    </Row>

                                )
                            )}

                            <Button className="closeSell" onClick={() => setShowSell(false)} variant="outline-success">
                                Close Selling products
                            </Button>

                        </ListGroup>


                    ) : (


                        <Button className="butSelling" onClick={() => setShowSell(true)} variant="outline-success">
                            See Selling products
                        </Button>
                    )

                    }

                </Alert>
                <Button className="addP" variant="primary" onClick={() => setShow(true)}>Add product</Button>
            </>

        )


}



function AddProductForm(props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [type, setType] = useState('');
    const [pricePerUnit, setPricePerUnit] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [typeName, setTypeName] = useState('Select product type');
    let typeNameArray = ['Fruits and Vegetables', 'Dairy', 'Meat and salumi', 'Sea products', 'Baker and sweets', 'Beverages'  ]
    const [numProd,setNumProd] = useState(0);


    useEffect(() => {
        let mounted = true;
        let allProducts =[];

        const getProdFarmer = async () => {
            allProducts = await API.getAllProducts();
            console.log('pr');
            console.log(allProducts);

        };
        getProdFarmer().then(data => {
            if (mounted) {
                setNumProd(allProducts.length);
            }
        })
            .catch(err => {
                console.error(err);
            });
        return () => {
            mounted = false
        };
    }, []);




    const handleAdd = (event) => {
        event.preventDefault();

        API.addProduct(props.idFarmer.id, name, description,quantity,0,1,pricePerUnit);
        props.handleClose();

        if(props.dirty) props.setDirty(false);
        else props.setDirty(true);


        /*let valid = true;
        if (name === '') {
            setErrorMessage('Missing name description!');
            valid = false;
        }
        if (description === '') {
            setErrorMessage('Missing surname description!');
            valid = false;
        }
        if (quantity === '') {
            setErrorMessage('Missing password description!');
            valid = false;
        }
        if (type === '') {
            setErrorMessage('Missing email description!');
            valid = false;
        }
        if (pricePerUnit === '') {
            setErrorMessage('Missing phoneNumber description!');
            valid = false;
        }



        if (valid) {
            //props.addClient(new Client(name, surname, email, password, phoneNumber, address));
            formReset();
            setSubmitted(true);
        }*/
    };

    const formReset = () => {
        setName('')
        setDescription('');
        setQuantity('');
        setType('');
        setPricePerUnit('');


    };

   /* if (submitted) {
        return (
            <Redirect to='/FarmerHome' />
        );
    } else {*/
        return (<>
                <Form.Label>Image</Form.Label>
                <FileUpload numProd={numProd}/>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control required type='text' value={name} onChange={ev => setName(ev.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control required type='text' value={description} onChange={ev => setDescription(ev.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formQuantity">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control required type='text' value={quantity} onChange={ev => setQuantity(ev.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formType">
                        <Form.Label>Type</Form.Label>

                        <Form.Select aria-label="Default select example" value={typeName} onChange={ev =>{ setType(typeNameArray.indexOf(ev.target.value)+1);

                             setTypeName(ev.target.value);
                             }}>
                             <option  hidden value>Select product type</option>
                             <option >{typeNameArray[0]}</option>
                             <option >{typeNameArray[1]}</option>
                             <option >{typeNameArray[2]}</option>
                             <option >{typeNameArray[3]}</option>
                             <option >{typeNameArray[4]}</option>
                             <option >{typeNameArray[5]}</option>
                         </Form.Select>

                    </Form.Group>
                    <Form.Group className="mt-2" controlId="formPricePerUnit">
                        <Form.Label>Price per unit</Form.Label>
                        <Form.Control required type='text' value={pricePerUnit} onChange={ev => setPricePerUnit(ev.target.value)} />
                    </Form.Group>

                    <Button className="mt-3" onClick={handleAdd}>Add product</Button>
                    <Form.Text className="text-danger">{errorMessage}</Form.Text>
                </Form >



            </>
        );
   // }

}

function EditProductForm(props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [type, setType] = useState('');
    const [pricePerUnit, setPricePerUnit] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [typeName, setTypeName] = useState('Select product type');
    let typeNameArray = ['Fruits and Vegetables', 'Dairy', 'Meat and salumi', 'Sea products', 'Baker and sweets', 'Beverages'  ]

    const handleEdit = (event) => {
        event.preventDefault();


        props.handleCloseEdit();




        /*let valid = true;
        if (name === '') {
            setErrorMessage('Missing name description!');
            valid = false;
        }
        if (description === '') {
            setErrorMessage('Missing surname description!');
            valid = false;
        }
        if (quantity === '') {
            setErrorMessage('Missing password description!');
            valid = false;
        }
        if (type === '') {
            setErrorMessage('Missing email description!');
            valid = false;
        }
        if (pricePerUnit === '') {
            setErrorMessage('Missing phoneNumber description!');
            valid = false;
        }



        if (valid) {
            //props.addClient(new Client(name, surname, email, password, phoneNumber, address));
            formReset();
            setSubmitted(true);
        }*/
    };


    if (submitted) {
        return (
            <Redirect to='/FarmerHome' />
        );
    } else {
        return (<>
                <Form>
                    <img className="imaEdit" src={require('../../../public/ProductImages/' + "p"+props.productToEdit.Id.toString()+"-1.jpg").default} />
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control required type='text' defaultValue={props.productToEdit.Name} onChange={ev => setName(ev.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control required type='text' defaultValue={props.productToEdit.Description} onChange={ev => setDescription(ev.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formQuantity">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control required type='text' defaultValue={props.productToEdit.Quantity} onChange={ev => setQuantity(ev.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formType">
                        <Form.Label>Type</Form.Label>
                        <Form.Select aria-label="Default select example" value={typeName} onChange={ev =>{ setType(typeNameArray.indexOf(ev.target.value)+1);

                            setTypeName(ev.target.value);
                            }}>
                            <option  hidden value>{typeNameArray[props.productToEdit.TypeId-1]}</option>
                            <option >{typeNameArray[0]}</option>
                            <option >{typeNameArray[1]}</option>
                            <option >{typeNameArray[2]}</option>
                            <option >{typeNameArray[3]}</option>
                            <option >{typeNameArray[4]}</option>
                            <option >{typeNameArray[5]}</option>
                        </Form.Select>

                    </Form.Group>
                    <Form.Group className="mt-2" controlId="formPricePerUnit">
                        <Form.Label>Price per unit</Form.Label>
                        <Form.Control required type='text' defaultValue={props.productToEdit.PricePerUnit} onChange={ev => setPricePerUnit(ev.target.value)} />
                    </Form.Group>


                    <Button className="mt-3" onClick={handleEdit}>Register</Button>
                    <Form.Text className="text-danger">{errorMessage}</Form.Text>
                </Form >
            </>
        );
    }

}


export default FarmerHome;
