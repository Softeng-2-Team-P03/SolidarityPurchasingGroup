import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProductList, Product } from '../ProductList';

//ProductList uses a useLocation. If you don't mock it tests will not run!
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({
        pathname: "/"
    })
}));

test("renders the product list without products", () => {

    const { getByRole, getByPlaceholderText, getByText } = render(<ProductList />)

    expect(getByRole('textbox')).not.toBeNull();
    expect(getByPlaceholderText('Search product')).not.toBeNull();
    const inputName = getByRole('textbox');
    userEvent.type(inputName, 'prodottotest');
    expect(inputName.value).toBe('prodottotest');

    expect(getByRole('heading', { name: /loading products\.\.\./i })).not.toBeNull();
    expect(getByText(/loading categories/i)).not.toBeNull();
    expect(getByText('Type of Products')).not.toBeNull();
})

test("renders a shoppable test product", () => {
    const { getByRole, getByText } = render(<Product canShop={true} productInCart={0}
        product={{
            name: "Strawberry Compote", description: "240 g", quantity: 13, pricePerUnit: 5.50, imagePath: "p1-1.jpg",
            farmer: { name: "Paolo", surname: "Rossi" }
        }} />);

    expect(getByRole('heading', { name: /strawberry compote/i })).not.toBeNull();
    expect(getByText(/240 g/i)).not.toBeNull();
    expect(getByRole('heading', { name: /€ 5\.5/i })).not.toBeNull();
    expect(getByRole('heading', { name: /13 pieces available/i })).not.toBeNull();
    expect(getByText('Farmer: Paolo Rossi')).not.toBeNull();

    expect(getByText('-')).not.toBeNull();
    expect(getByText('+')).not.toBeNull();
    expect(getByText('Add to basket')).not.toBeNull();
})

test("renders a non-shoppable test product", () => {
    const { getByRole, getByText, queryByText } = render(<Product canShop={false} productInCart={0}
        product={{
            name: "Strawberry Compote", description: "240 g", quantity: 13, pricePerUnit: 5.50, imagePath: "p1-1.jpg",
            farmer: { name: "Paolo", surname: "Rossi" }
        }} />);

    expect(getByRole('heading', { name: /strawberry compote/i })).not.toBeNull();
    expect(getByText(/240 g/i)).not.toBeNull();
    expect(getByRole('heading', { name: /€ 5\.5/i })).not.toBeNull();
    expect(getByRole('heading', { name: /13 pieces available/i })).not.toBeNull();
    expect(getByText('Farmer: Paolo Rossi')).not.toBeNull();

    expect(queryByText('-')).toBeNull();
    expect(queryByText('+')).toBeNull();
    expect(queryByText('Add to basket')).toBeNull();
})