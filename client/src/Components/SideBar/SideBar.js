import 'bootstrap/dist/css/bootstrap.min.css';
import './SideBar.css';
import { ListGroup, Spinner } from "react-bootstrap";
import { propTypes } from 'react-bootstrap/esm/Image';



function SideBar(props) {

    return (
        <ListGroup className="left" defaultActiveKey="#link1">
            <ListGroup.Item action href="title" disabled>
                <h4>
                    <small className="text-muted">Tipo Prodotti</small>
                </h4>
            </ListGroup.Item>
            {props.loadingProducts ?
                <ListGroup.Item>Loading categories <Spinner animation="border" size="sm" /></ListGroup.Item>
                :
                <>
                    <ListGroup.Item action href="#link1">
                        Frutta
                    </ListGroup.Item>
                    <ListGroup.Item action href="#link2">
                        Verdura
                    </ListGroup.Item>
                    <ListGroup.Item action href="#link3">
                        Carne
                    </ListGroup.Item>
                    <ListGroup.Item action href="#link4">
                        Pesce
                    </ListGroup.Item>
                    <ListGroup.Item action href="#link5">
                        Latticini
                    </ListGroup.Item>
                </>
            }
        </ListGroup>
    );
}

export default SideBar;
