import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import {Nav} from "react-bootstrap";



function SideBar() {


    return (
        <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
             activeKey="/home"
             onSelect={selectedKey => alert(`selected ${selectedKey}`)}
        >
            <div className="sidebar-sticky"></div>
            <Nav.Item>
                <Nav.Link href="/home">Frutta</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-1">Verdura</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-2">Carne</Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export default SideBar;
