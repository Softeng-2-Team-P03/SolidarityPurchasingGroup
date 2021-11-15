import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { Col, Row, Button, Dropdown } from "react-bootstrap"; 

function HomePage(prop) {
    return (
        <>
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
            </div>
        </>
    );
}

function SelectionBar() {

    return (
        <Dropdown className="selection">
            <Dropdown.Toggle variant="primary" size="lg">
                Sections
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="#shop">Home</Dropdown.Item>
                <Dropdown.Item href="#info">Info</Dropdown.Item>
                <Dropdown.Item href="#candidate">Join us</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
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