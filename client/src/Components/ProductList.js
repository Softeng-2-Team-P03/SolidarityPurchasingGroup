
import 'bootstrap/dist/css/bootstrap.min.css';
import {CardGroup, Col, Container, Row} from "react-bootstrap";
import Product from "./Product";
import SideBar from "./SideBar";

function ProductList() {
    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <SideBar />
                    </Col>
                    <Col  xs={10} id="page-content-wrapper">
                        <CardGroup>
                            <Product/>
                            <Product/>
                            <Product/>
                            <Product/>
                            <Product/>
                        </CardGroup>
                        <CardGroup>
                            <Product/>
                            <Product/>
                            <Product/>
                            <Product/>
                            <Product/>
                        </CardGroup>
                    </Col>
                </Row>

            </Container>
        </>
    );
}

export default ProductList;
