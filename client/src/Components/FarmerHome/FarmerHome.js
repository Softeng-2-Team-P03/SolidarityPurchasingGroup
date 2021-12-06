import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Fragment, useEffect, useState} from 'react';
import {ListGroup, Table, Button, Row, Col, Modal, Form, Dropdown, Image, Alert} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import {AddClientForm} from "../ClientList/AddClient";
import {Client} from "../Client";
import './FarmerHome.css'
import API from "../../API";
import axios from "axios";
import Message from "../FileUpload/Message";
import Progress from "../FileUpload/Progress";

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
    const [timeToString, setTimeToString] = useState(localStorage.getItem('virtualDateToString'));
    const [timeAddEdit, setTimeAddEdit] = useState(false);
    const [timeConfirm, setTimeConfirm] = useState(false);


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

    const checkDate = () => {
        let time = new Date(localStorage.getItem('virtualDate'));
        setTimeToString(localStorage.getItem('virtualDateToString'));
        const day = time.getDay();
        const hour = time.getHours();
        if (((day === 1 && hour >= 9) || (day>=2 && day<=5) || (day===6 && hour<9))) {
            setTimeAddEdit(true);
        }
        else{
            setTimeAddEdit(false);
        }
        if((day === 6 && hour >=9)  || day===0 || (day===1 && hour<9)){
            setTimeConfirm(true);
        }
        else{

            setTimeConfirm(false);

        }
    }

    useEffect(() => {
        const id = setInterval(checkDate, 1000);
        checkDate();
        return () => clearInterval(id);
    }, [])


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
                        <EditProductForm productToEdit={productToEdit} handleCloseEdit={handleCloseEdit} setDirty={setDirty} dirty={dirty}/>

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
                                    <Col md="2">{ timeAddEdit ?  <Button className="buttonEdit" variant="secondary" onClick={() => {
                                        setEdit(true);
                                        setProductToEdit(x);
                                    }
                                    }>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                             className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path
                                                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                        </svg>
                                        Edit Product</Button> : <></>}</Col>
                                    <Col md="2">{timeConfirm ? <Button className="buttonConfirm" variant="success" onClick={() => {
                                        API.updateProductState(1, x.Id).catch(err => console.log(err));
                                        setConfirm(false);



                                    }}>Confirm</Button> : <></>}</Col>

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
                {timeAddEdit ? <Button className="addP" variant="primary" onClick={() => setShow(true)}>Add product</Button> : <></>}
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
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [timeToString, setTimeToString] = useState(localStorage.getItem('virtualDateToString'));


    useEffect(() => {
        let mounted = true;
        let allProducts =[];

        const getProdFarmer = async () => {
            allProducts = await API.getAllProducts();

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
    }, [numProd]);

    const checkDate = () => {
        let time = new Date(localStorage.getItem('virtualDate'));
        setTimeToString(localStorage.getItem('virtualDateToString'));

    }

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async e => {
        let numImg = numProd+1
        let nameImg = 'p'+numImg.toString()+'-1.jpg'

        checkDate();

        API.addImage(numImg,nameImg);

        e.preventDefault();
        const formData = new FormData();
        if(filename!='Choose File')
            formData.append('file', file ,nameImg);
        else
            formData.append('file', file);

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    setUploadPercentage(
                        parseInt(
                            Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        )
                    );


                }


            });

            // Clear percentage
            setTimeout(() => setUploadPercentage(0), 10000);

            const { fileName, filePath } = res.data;

            setUploadedFile({ fileName, filePath });

            setMessage('File Uploaded');



                API.addProduct(props.idFarmer.id, name, description,quantity,0,1,pricePerUnit,'10-12-2021');
                props.handleClose();

                if(props.dirty) props.setDirty(false);
                else props.setDirty(true);



        } catch (err) {

            if (err.response.status === 200){

            } else if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
            setUploadPercentage(0)
        }
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


                <Fragment>
                    {message ? <Message msg={message} /> : null}

                    {uploadedFile ? (
                        <div className='col-md-6 m-auto'>
                            <img style={{ width: '100%' }} src={uploadedFile.filePath}  />
                        </div>
                    ) : null}

                    <form onSubmit={onSubmit}>
                        <div className='custom-file mb-4'>
                            <input

                                type='file'
                                className='custom-file-input'
                                id='customFile'
                                onChange={onChange}
                            />
                            <label className='custom-file-label' htmlFor='customFile'>
                                {filename}
                            </label>
                        </div>
                        <Progress percentage={uploadPercentage} />
                    </form>

                </Fragment>


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
                        <Form.Control required type='number' value={quantity} onChange={ev => setQuantity(ev.target.value)} />
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
                        <Form.Control required type='number' value={pricePerUnit} onChange={ev => setPricePerUnit(ev.target.value)} />
                    </Form.Group>

                    <input
                        type='submit'
                        value='Add product'
                        className='btn btn-secondary btn-block mt-4'
                        onClick={onSubmit}
                    />
                    <Form.Text className="text-danger">{errorMessage}</Form.Text>
                </Form >



            </>
        );
   // }

}

function EditProductForm(props) {
    const [name, setName] = useState(props.productToEdit.Name);
    const [description, setDescription] = useState(props.productToEdit.Description);
    const [quantity, setQuantity] = useState(props.productToEdit.Quantity);
    const [type, setType] = useState(props.productToEdit.TypeId);
    const [pricePerUnit, setPricePerUnit] = useState(props.productToEdit.PricePerUnit);

    const [errorMessage, setErrorMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [typeName, setTypeName] = useState('Select product type');
    let typeNameArray = ['Fruits and Vegetables', 'Dairy', 'Meat and salumi', 'Sea products', 'Baker and sweets', 'Beverages'  ]

    const handleEdit = (event) => {
        event.preventDefault();

        let valid = true;
        if (name === '') {
            setErrorMessage('Missing name!');
            valid = false;
        }
        if (description === '') {
            setErrorMessage('Missing description!');
            valid = false;
        }
        if (quantity === '') {
            setErrorMessage('Missing quantity!');
            valid = false;
        }
        if (pricePerUnit === '') {
            setErrorMessage('Missing price per unit!');
            valid = false;
        }
        

        if (valid) {
            API.updateProductInfo(quantity, props.productToEdit.Id, name, description, pricePerUnit, type).catch(err => console.log(err));
            props.handleCloseEdit();
            if(props.dirty) props.setDirty(false);
            else props.setDirty(true);
            setSubmitted(true);
        }
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
                        <Form.Control required type='number' defaultValue={props.productToEdit.Quantity} onChange={ev => setQuantity(ev.target.value)} />
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
                        <Form.Control required type='number' defaultValue={props.productToEdit.PricePerUnit} onChange={ev => setPricePerUnit(ev.target.value)} />
                    </Form.Group>


                    <Button className="mt-3" onClick={handleEdit}>Register</Button>
                    <Form.Text className="text-danger">{errorMessage}</Form.Text>
                </Form >
            </>
        );
    }

}


export default FarmerHome;
