import 'bootstrap/dist/css/bootstrap.min.css';
import './SideBar.css';
import { ListGroup, Spinner } from "react-bootstrap";

function SideBar(props) {

    return (
        <ListGroup className="left" defaultActiveKey="#link1">
            <ListGroup.Item action href="title" disabled>
                <h4>
                    <small className="text-muted">Type of Products</small>
                </h4>
            </ListGroup.Item>
            {props.loadingTypes ?
                <ListGroup.Item>Loading categories <Spinner animation="border" size="sm" /></ListGroup.Item>
                :
                <>
                    <ListGroup.Item action onClick={() => props.changeCategory(0)} active={0 === props.category}>
                        All
                    </ListGroup.Item>
                    {props.types.map((type) =>
                        <ListGroup.Item key={type.id} action onClick={() => props.changeCategory(type.id)}
                            active={type.id === props.category}>{type.typeName}</ListGroup.Item>)}
                </>
            }
        </ListGroup>
    );
}

export default SideBar;
