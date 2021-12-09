import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, MemoryRouter } from 'react-router-dom';
import { queryByTestId, render, waitFor,fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FarmerHome from '../FarmerHome';


test("renders the HomePage ", () => {
    // Render a react component to the DOM.
    const { queryByText, queryByRole, querySelector } = render(
        <Router>
            <Switch>
                <Route exact path="/FarmerHome" render={() =>
                    <FarmerHome />
                } />
                <Route render={() =>
                    <Redirect to='/FarmerHome' />
                } />
            </Switch>
        </Router>
    );

    expect(queryByRole('alert')).not.toBeNull();
    expect(queryByRole('button', {  name: /see selling products/i})).not.toBeNull();
    expect(queryByRole('button', {  name: /add product/i})).not.toBeNull();
});

it("clicking on add product button renders the modal as expected", ()=>{
    // Render a react component to the DOM.
    const { getByText, getByTestId,getByLabelText,getByRole } = render(<FarmerHome/>);

    //clicks on the cart button
    fireEvent.click(getByTestId("addP"));

    //make sure now the modal is rendered
    expect(getByTestId("addProductModal")).not.toBeNull();

    //And has it's components rendering correctly

    expect(getByLabelText(/choose file/i)).not.toBeNull();  
    
    expect(getByRole('textbox', {  name: /name/i})).not.toBeNull();   
    expect(getByText(/name/i)).not.toBeNull();

    expect(getByRole('textbox', {  name: /description/i})).not.toBeNull();   
    expect(getByText(/description/i)).not.toBeNull();

    expect(getByRole('spinbutton', {  name: /quantity/i})).not.toBeNull();   
    expect(getByText(/quantity/i)).not.toBeNull();

    expect(getByRole('spinbutton', {  name: /price per unit/i})).not.toBeNull();   
    expect(getByText(/price per unit/i)).not.toBeNull();

    expect(getByRole('combobox', {  name: /default select example/i})).not.toBeNull();  

  });