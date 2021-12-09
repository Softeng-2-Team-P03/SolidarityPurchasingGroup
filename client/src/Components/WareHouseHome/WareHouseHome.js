import 'bootstrap/dist/css/bootstrap.min.css';
import './WareHouseHome.css';
import { Form, Table } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import API from "../../API";

function WareHouseHome() {


    const [products, setProducts] = useState([]);
    const [searchProducts, setSearchProducts] = useState([]);
    const [dirty, setDirty] = useState(true);
  


    useEffect(() => {


        const getAllProducts = async () => {
            const products = await API.getAllProducts();
           
            setProducts(products);
            setSearchProducts(products);
        };
        getAllProducts().then(() => {
            if (dirty) {

                setDirty(false);


            }
        })
            .catch(err => {
                console.error(err);
            });

    }, [dirty]);


    function changeSearchText(text) {
        let c = []
        products.forEach(x => {
            if (x.name.toLowerCase().includes(text.toLowerCase())) c.push(x);
        })

        setSearchProducts(c);

    }

    function updateProductState(id){

        API.updateProductState(2,id)
        .then(() => {
            setDirty(true);
            

        }).catch(err => {
           
            console.error(err);
        });

    }


    return (
        <>
            <Form.Control type="text" className="searchB" placeholder="Search product" onChange={x => changeSearchText(x.target.value)} />
            <Table responsive striped bordered hover className="productsTable">
                <thead>
                    <tr>
                        <th>ProductId</th>
                        <th>Name</th>
                        <th width="20%"></th>
                    </tr>
                </thead>
                <tbody> {
                    searchProducts.map((pr) =>
                        <RowData key={pr.Id}
                            product={pr}
                            updateProductState ={updateProductState}
                            

                        />)
                }
                </tbody>
            </Table>
        </>
    );


}

function RowData(props) {
    console.log("STATUS" +props.product.state);
    return (
        <>
            <tr>
                <td>{props.product.id}</td>
                <td>{props.product.name}</td>
                <td><Form>
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        label="Delivered"    
                        checked={props.product.state}                   
                        onClick={() => props.updateProductState(props.product.id)}
                    />

                </Form></td>

            </tr>
        </>
    );
}




export { WareHouseHome };