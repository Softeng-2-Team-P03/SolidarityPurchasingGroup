import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, MemoryRouter } from 'react-router-dom';
import { queryByTestId, render, waitFor, fireEvent, within, getByPlaceholderText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EditProductForm, FarmerHome, ProductListItem } from '../FarmerHome';


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
    expect(queryByRole('button', { name: /see selling products/i })).not.toBeNull();
    expect(queryByRole('button', { name: /close selling products/i })).toBeNull();
    expect(queryByRole('button', { name: /add product/i })).not.toBeNull();

    fireEvent.click(queryByRole('button', { name: /see selling products/i }));

    expect(queryByRole('button', { name: /close selling products/i })).not.toBeNull();
    expect(queryByRole('button', { name: /see selling products/i })).toBeNull();
});

it("clicking on add product button renders the modal as expected", () => {
    // Render a react component to the DOM.
    const { getByText, getByTestId, getByLabelText, getByRole } = render(<FarmerHome />);

    //clicks on the cart button
    fireEvent.click(getByTestId("addP"));

    //make sure now the modal is rendered
    expect(getByTestId("addProductModal")).not.toBeNull();

    //And has it's components rendering correctly

    expect(getByRole('button', { name: /close/i })).not.toBeNull();

    expect(getByLabelText(/choose file/i)).not.toBeNull();

    expect(getByRole('textbox', { name: /name/i })).not.toBeNull();
    expect(getByText(/name/i)).not.toBeNull();

    expect(getByRole('textbox', { name: /description/i })).not.toBeNull();
    expect(getByText(/description/i)).not.toBeNull();

    expect(getByRole('textbox', { name: /date/i })).not.toBeNull();

    expect(getByRole('spinbutton', { name: /quantity/i })).not.toBeNull();
    expect(getByText(/quantity/i)).not.toBeNull();

    expect(getByRole('spinbutton', { name: /price per unit/i })).not.toBeNull();
    expect(getByText(/price per unit/i)).not.toBeNull();

    expect(getByRole('combobox', { name: /default select example/i })).not.toBeNull();

    expect(within(getByTestId("addProductModal")).getByRole('button', { name: /add product/i })).not.toBeNull();

});

it("renders the row of a product to edit", () => {
    const { getByText, getByRole, queryByRole, queryByText } = render(
        <ProductListItem product={{ Id: 34, Name: "Apricot Jam Tart", Quantity: 96, Description: "400 g", TypeId: 4, PricePerUnit: 9 }}
            timeAddEdit={true} timeConfirm={false} />
    )

    expect(getByRole('heading', { name: /apricot jam tart/i })).not.toBeNull();
    expect(getByRole('heading', { name: /qty:96/i })).not.toBeNull();
    expect(getByText('to confirm')).not.toBeNull();
    expect(getByRole('button', { name: /edit product/i })).not.toBeNull();
    expect(queryByText('Specify quantity')).toBeNull();
    expect(queryByRole('button', { name: /confirm/i })).toBeNull();
})

it("renders the modal of a product to edit", () => {
    const { getByRole, getByText } = render(
        <EditProductForm productToEdit={{ Id: 34, Name: "Apricot Jam Tart", Quantity: 96, Description: "400 g", TypeId: 4, PricePerUnit: 9 }} />
    )

    expect(getByRole('img')).not.toBeNull();

    expect(getByText(/name/i)).not.toBeNull();
    expect(getByRole('textbox', { name: /name/i }).value).toBe("Apricot Jam Tart");

    expect(getByText(/description/i)).not.toBeNull();
    expect(getByRole('textbox', { name: /description/i }).value).toBe("400 g")

    expect(getByText(/quantity/i)).not.toBeNull();
    expect(getByRole('spinbutton', { name: /quantity/i }).value).toBe("96")

    expect(getByText(/type/i)).not.toBeNull();
    expect(getByRole('combobox', { name: /default select example/i })).not.toBeNull();

    expect(getByText(/price per unit/i)).not.toBeNull();
    expect(getByRole('spinbutton', { name: /price per unit/i }).value).toBe("9");

    expect(getByRole('button', { name: /register/i })).not.toBeNull();
})

it("renders the row of a product to confirm", () => {
    const { getByText, getByRole, queryByRole, getByPlaceholderText } = render(
        <ProductListItem product={{ Id: 34, Name: "Apricot Jam Tart", Quantity: 96, Description: "400 g", TypeId: 4, PricePerUnit: 9 }}
            timeAddEdit={false} timeConfirm={true} />
    )

    expect(getByRole('heading', { name: /apricot jam tart/i })).not.toBeNull();
    expect(getByRole('heading', { name: /qty:96/i })).not.toBeNull();
    expect(getByText('to confirm')).not.toBeNull();
    expect(queryByRole('button', { name: /edit product/i })).toBeNull();
    expect(getByPlaceholderText('Specify quantity')).not.toBeNull();
    expect(getByRole('button', { name: /confirm/i })).not.toBeNull();
})