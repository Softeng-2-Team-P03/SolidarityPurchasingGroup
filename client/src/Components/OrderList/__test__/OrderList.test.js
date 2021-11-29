import * as React from 'react';
import { render } from '@testing-library/react';

import { OrderList, Order } from '../OrderList';

it("renders the OrderList", () => {

    const { getByRole, getByPlaceholderText, getByText } = render(<OrderList />);

    expect(getByRole('textbox')).not.toBeNull();
    expect(getByPlaceholderText('Search order')).not.toBeNull();
    expect(getByText("Loading orders...")).not.toBeNull();
})

it("renders an order tuple", () => {
    const { getByRole } = render(
        <Order order={{
            BookingId: 1, UserId: 2, BookingStartDate: '2021-11-12', State: 2,
            PickupTime: '2021-11-14', DeliveryTime: null, TotalPrice: 22.5
        }} />)

    expect(getByRole('row', { name: /1 2 2021-11-12 2 2021-11-14 22.5 click to hand it out/i })).not.toBeNull();
    expect(getByRole('cell', {name: /22.5/i})).not.toBeNull();
    expect(getByRole('cell', { name: /click to hand it out/i })).not.toBeNull();
})