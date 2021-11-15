import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import spg from '../Icons/spg.png';
import { Nav, Navbar,Button, Row } from "react-bootstrap";
import { showTime } from './clock.js'
import { useState } from "react";


var hourMultiplier = 0;
var dayMultiplier = 0;
//localStorage.setItem("hourMultiplier", hourMultiplier.toString());
window.setInterval(showTime, 1000) // per mostrare il passare dei secondi nell'orologio

function NavBar(props) {

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

  /* FUNZIONI PER POTER MODIFICARE ORARIO */
  const setHourPlus=()=> {
    if(localStorage.getItem('hourMultiplier')===null)
      hourMultiplier=0;
    else
      hourMultiplier=parseInt(localStorage.getItem('hourMultiplier'));
    hourMultiplier += 1;
    localStorage.setItem('hourMultiplier', hourMultiplier.toString());
    showTime()
    }
  const setHourMinus=()=> {
    if(localStorage.getItem("hourMultiplier")===null)
      hourMultiplier=0;
    else{      
      hourMultiplier=parseInt(localStorage.getItem("hourMultiplier"));
      hourMultiplier -= 1;}
    localStorage.setItem("hourMultiplier", hourMultiplier.toString());
    showTime()
    }
    const setDayPlus=()=> {
      if(localStorage.getItem('dayMultiplier')===null)
        dayMultiplier=0;
      else{
        dayMultiplier=parseInt(localStorage.getItem('dayMultiplier'));
        dayMultiplier += 1;}
      localStorage.setItem('dayMultiplier', dayMultiplier.toString());
      showTime()
      }
      const setDayMinus=()=> {
        if(localStorage.getItem("dayMultiplier")===null)
          dayMultiplier=0;
        else{
          dayMultiplier=parseInt(localStorage.getItem("dayMultiplier"));
          dayMultiplier -= 1;}
        localStorage.setItem("dayMultiplier", dayMultiplier.toString());
        showTime()
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
      {props.loggedIn && props.user !== undefined && chooseNavbar(props.user.accessType)}
      <Nav>
        {props.loggedIn ?
          <Nav.Link onClick={() => props.userLogoutCallback()}>Logout</Nav.Link> :
          <Nav.Link href='/login'>Login</Nav.Link>
        }
      </Nav>
      <div class='clockWrapper'>
        <Button id='incrementDay' onClick={setDayPlus}>▲</Button>
        <Button id='incrementHour' onClick={setHourPlus}>▲</Button>
        <div id="clock" class="glow">00:00:00</div>
        <Button id='decrementDay'onClick={setDayMinus}>▼</Button>
        <Button id='decrementHour'onClick={setHourMinus}>▼</Button>
      </div>
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
      <Nav.Link href='/products'>Browse Shop</Nav.Link>
      <Nav.Link href='/clients'>Clients</Nav.Link>
      <Nav.Link href='/orders'>Orders</Nav.Link>
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
