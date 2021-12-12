import * as React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import { Route, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import OrderSuccess from '../OrderSuccess';

//ProductList uses a useLocation. If you don't mock it tests will not run!
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({
        pathname: "/products",
        state: {
            orderId: 50, errorWallet: '',
            booking: {
                userId: 4, bookingStartDate: '2021-12-02', totalPrice: 41.0, pickupTime: undefined,
                deliveryTime: '2021-12-05 09:30', state: 0,
                products: [{ imagePath: "p1-1.jpg", name: "Strawberry Compote", productId: 1, quantity: 6, price: 33.0 },
                { imagePath: "p2-1.jpg", name: "Pumpkins", productId: 2, quantity: 10, price: 5.0 }]
            }
        }
    })
}));

it("checks if works with delivery date", async () => {

    let testHistory, testLocation;

    const { getByRole, queryByRole } = render(
        <MemoryRouter initialEntries={["/products"]}>
            <OrderSuccess />
            <Route
                path="*"
                render={({ history, location }) => {
                    testHistory = history;
                    testLocation = location;
                    return null;
                }}
            />
        </MemoryRouter>
    );

    expect(getByRole('heading', { name: /booking #50 has been received/i })).not.toBeNull();
    expect(queryByRole('heading', { name: /pick\-up info: 05\/12\/2021 09:30/i })).toBeNull();
    expect(getByRole('heading', { name: /delivery info: 05\/12\/2021 09:30/i })).not.toBeNull();
    expect(getByRole('button', { name: /go to homepage/i })).not.toBeNull();

    expect(getByRole('columnheader', { name: /product/i })).not.toBeNull();
    expect(getByRole('columnheader', { name: /quantity/i })).not.toBeNull();
    expect(getByRole('columnheader', { name: /price \(total: € 41\)/i })).not.toBeNull();

    let cell = getByRole('cell', { name: /strawberry compote/i });
    expect(cell).not.toBeNull();
    expect(within(cell).getByRole('img')).not.toBeNull();
    expect(getByRole('cell', { name: /6/i })).not.toBeNull();
    expect(getByRole('cell', { name: /€ 33/i })).not.toBeNull();

    cell = getByRole('cell', { name: /pumpkins/i });
    expect(cell).not.toBeNull();
    expect(within(cell).getByRole('img')).not.toBeNull();
    expect(getByRole('cell', { name: /10/i })).not.toBeNull();
    expect(getByRole('cell', { name: /€ 5/i })).not.toBeNull();

    const row = getByRole('row', { name: /delivery 1 € 3\.00/i });
    expect(row).not.toBeNull();

    expect(getByRole('cell', { name: /total: € 41/i })).not.toBeNull();

    userEvent.click(getByRole('button', { name: /go to homepage/i }))

    await waitFor(() => expect(testLocation.pathname).toBe("/"));
})