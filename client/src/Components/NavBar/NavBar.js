import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import spg from '../Icons/spg.png';
import { Nav, Navbar } from "react-bootstrap";



function NavBar() {

  const chooseNavbar = (accessType) => {
    if (accessType === 1) {
      return <ManagerNavbar />;
    }
    if (accessType === 2) {
      return <EmployeeNavbar />;
    }
    if (accessType === 3) {
      return <ClientNavbar />;
    }
    if (accessType === 4) {
      return <FarmerNavbar />;
    }
    if (accessType === 5) {
      return <DelivererNavbar />;
    }
    return <></>;
  }

  return (
    <Navbar className="nav" bg="primary" variant="dark">
      <Navbar.Brand href="/">
        <img
          src={spg}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="SPG"
        /> SPG
      </Navbar.Brand>
      <Nav className="me-auto" />
      {chooseNavbar(2)}
      <Nav>
        <Nav.Link href='/login'>Login</Nav.Link>
      </Nav>
    </Navbar>
  );
}

//Wallet could be integrated in account info
function ClientNavbar() {
  return (
    <Nav>
      <Nav.Link href='/products'>Browse Shop</Nav.Link>
      <Nav.Link>My Orders</Nav.Link>
      <Nav.Link>My Wallet</Nav.Link>
    </Nav>
  );
}

//Separate nav.link for wallet top up or in clients ?
function EmployeeNavbar() {
  return (
    <Nav>
      <Nav.Link href='/products'>Browse Shop</Nav.Link>
      <Nav.Link href='/clients'>Clients</Nav.Link>
      <Nav.Link href='/orders'>Orders</Nav.Link>
    </Nav>
  );
}

//TO DO:
function ManagerNavbar() {
  return (
    <Nav>
      <Nav.Link>Clients</Nav.Link>
      <Nav.Link>Orders</Nav.Link>
      <Nav.Link>Join Requests</Nav.Link>
    </Nav>
  );
}

//TO DO:
function FarmerNavbar() {
  return (
    <Nav>
      <Nav.Link>Clients</Nav.Link>
      <Nav.Link>Orders</Nav.Link>
    </Nav>
  );
}

//TO DO:
function DelivererNavbar() {
  return (
    <Nav>
      <Nav.Link>Clients</Nav.Link>
      <Nav.Link>Orders</Nav.Link>
    </Nav>
  );
}

export default NavBar;
