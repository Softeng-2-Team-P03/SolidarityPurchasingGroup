import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import { Link, useLocation } from 'react-router-dom';
import { Col, Row, Button, Dropdown , Toast} from "react-bootstrap"; 
import { useState } from "react";

function HomePage(prop) {
    const [showB, setShowB] = useState(true);
    const location = useLocation();
 
  const toggleShowB = () => setShowB(!showB);
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
                                <Button size="lg">Products</Button>
                            </Link>
                        </Col>
                    </Row>
                    {prop.loggedIn ? <> </> : <>
                    <p>Not already registered?</p>
                    <Link to='/addClient'>
                        <Button size="lg" style={{ whiteSpace: "nowrap" }}>Register</Button>
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
                        <Button size="lg">Candidate</Button>
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
        </>
    );
}

function SelectionBar() {

    return (
        <div className="selection">
                <ul>
                    <li><a href="#shop"><img src={window.location.origin + '/images/home.png'}></img></a></li>
                    <li><a href="#info"><img src={window.location.origin + '/images/information.png'}></img></a></li>
                    <li><a href="#candidate"><img src={window.location.origin + '/images/group.png'}></img></a></li>
                    <li><a href="#category"><img src={window.location.origin + '/images/categories.png'}></img></a></li>
                </ul>
        </div>
    );
}

function LogIn(){
    return(<>
        <Link to='/login'>
            <Button size="lg" style={{ whiteSpace: "nowrap" }}>Log In</Button>
        </Link>
    </>);
}

function LogOut(prop){
    return(<>
    <Link to="/">
        <Button size="lg" style={{ whiteSpace: "nowrap" }} onClick={prop.userLogoutCallback}>Log Out</Button>
    </Link>
    </>);
}
export default HomePage;