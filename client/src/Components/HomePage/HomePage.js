import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Col, Row, Button, Toast } from "react-bootstrap";
import { useState, useEffect } from "react";
import userApi from '../../api/user-api';
import ModalError from './modalWallet';

function HomePage(prop) {

    const [showB, setShowB] = useState(true);
    const location = useLocation();
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const setModalclose = () => {
        setShowModal(false);
    }

    useEffect(() => {
        var required = 0;
        if (prop.loggedIn) {
            userApi.getRequiredCharge()
                .then((reqiuired) => {
                    required = reqiuired["TotalPrice"];
                    userApi.getWalletBalance()
                        .then((wallet) => {
                            //console.log("ddddddddddddd");
                            //console.log(wallet["Wallet"])
                            //console.log("required"+required)

                            if (wallet < required) {
                                setShowModal(true);
                            }
                        })
                }).catch(err => {
                    console.error(err);
                });


        }
    }, []);

 
  const toggleShowB = () => {setShowB(!showB); let state = { ...history.location.state };
  delete state.showToast;
  history.replace({ ...history.location, state });}
    
    return (
        <>
        {location.state && location.state.showToast  ? <> 
        <Toast className="toast-fixed" onClose={toggleShowB} show={showB} animation={false}>
          <Toast.Header>
            <strong className="me-auto">Registration completed</strong>
          </Toast.Header>
          <Toast.Body>Your account has been successfully created</Toast.Body>
        </Toast> </> : <></>
   
}
            <SelectionBar />
            <div className="container">
                <section className="partSection" id="shop">
                    <h2>Welcome to</h2>
                    <h1>Solidarity Purchasing Group!</h1>
                    <p>Go to your local shop or log in to add products to your basket</p>
                    <Row>
                        <Col>
                        {prop.loggedIn ? <LogOut userLogoutCallback={prop.userLogoutCallback}/> : <LogIn/>}   
                        </Col>
                        <Col>
                            <Link to='/products' style={{ whiteSpace: "nowrap" }}>
                                <Button style={{color : 'black', background : '#FF7E8E', border : 'none'}} size="lg" > Products </Button>
                            </Link>
                        </Col>
                    </Row>
                    {prop.loggedIn ? <> </> : <>
                    <p>Not already registered?</p>
                    <Link to='/addClient'>
                        <Button size="lg" style={{color : 'black', background : '#FF7E8E', border : 'none'}}>Register</Button>
                    </Link> </> }
                </section>
                <section className="partSection" id="info">
                    <h1>How does it work?</h1>
                    <p>Choose the products to add to your basket in shop or online</p>
                    <p>Pick up your products by person or have them delivered to your home!</p>
                </section>
               
                <section className="partSection" id="candidate">
                    <h1>Are you a farmer or a delivery person?</h1>
                    <h2>Want to join our team?</h2>
                    <p>Candidate now!</p>
                    <Link to='/candidate'>
                        <Button style={{color : 'black',background : '#FF7E8E', border : 'none'}} size="lg">Candidate</Button>
                    </Link>
                </section>


                <section className="partSection" id="category">
                    <h1>Our products and category</h1>
                    <p>Choose the category and see the fresh products</p>
                    <Row className="items col-md-11">
                        <Col md={2} xs={4} className="box-item ">
                            <div class="circle-1">
                                <img src={window.location.origin + '/images/category/fruit.jpg'} alt="Skanderbeg Square Albania" />
                            </div>
                        </Col>
                        <Col md={2} xs={4} className="box-item ">

                            <div class="circle-1">
                                <img src={window.location.origin + '/images/category/dairy.jpg'} alt="Skanderbeg Square Albania" />
                            </div>

                        </Col>
                        <Col md={2} xs={4} className="box-item ">
                            <div class="circle-1">
                                <img src={window.location.origin + '/images/category/meat.jpg'} alt="Skanderbeg Square Albania" />
                            </div>
                        </Col>
                        <Col md={2} xs={4} className="box-item ">
                            <div class="circle-1">
                                <img src={window.location.origin + '/images/category/sea.jpg'} alt="Skanderbeg Square Albania" />
                            </div>
                        </Col>
                        <Col md={2} xs={4} className="box-item ">
                            <div class="circle-1">
                                <img src={window.location.origin + '/images/category/bakery.jpg'} alt="Skanderbeg Square Albania" />
                            </div>
                        </Col>
                        <Col md={2} xs={4} className="box-item ">
                            <div class="circle-1">
                                <img src={window.location.origin + '/images/category/beverages.jpg'} alt="Skanderbeg Square Albania" />
                            </div>
                        </Col>
                    </Row>
                </section>
                <section className="footer" id="footer">
                <div>
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#273036" fill-opacity="1" d="M0,64L1440,160L1440,320L0,320Z"></path> */}
                <br/>
                <p >@copyright 2021-2022 -Software engineering-   politecnico di torino  By p3</p>
                
                {/* </svg> */}
                </div>
                </section>
            </div>
            <ModalError show={showModal} handleClose={setModalclose} title={"Error in Balance Wallet"} description={"Your wallet balance is not enough to complete your orders, please increase your credit amount!"} ></ModalError>

        </>
    );
}

function SelectionBar() {

    return (
        <div className="selection">
                <ul>
                    <li data-testid="shopHook"><a href="#shop"><img src={window.location.origin + '/images/home.png'}></img></a></li>
                    <li><a href="#info"><img data-testid="infoHook" src={window.location.origin + '/images/information.png'}></img></a></li>
                    <li data-testid="candidateHook"><a href="#candidate"><img src={window.location.origin + '/images/group.png'}></img></a></li>
                    <li data-testid="categoryHook"><a href="#category"><img src={window.location.origin + '/images/categories.png'}></img></a></li>
                </ul>
        </div>
    );
}

function LogIn(){
    return(<>
        <Link to='/login'>
            <Button size="lg" style={{color : 'black',background : '#FF7E8E', border : 'none'}}>Log In</Button>
        </Link>
    </>);
}

function LogOut(prop){
    return(<>
    <Link to="/">
        <Button size="lg" style={{color : 'black',background : '#FF7E8E', border : 'none'}} onClick={prop.userLogoutCallback}>Log Out</Button>
    </Link>
    </>);
}
export default HomePage;