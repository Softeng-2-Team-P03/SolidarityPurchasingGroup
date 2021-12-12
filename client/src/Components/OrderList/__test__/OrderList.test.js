import * as React from 'react';
import { render } from '@testing-library/react';

import { OrderList, Order } from '../OrderList';

it("renders the OrderList", () => {

    const { getByRole, getByPlaceholderText, getByText } = render(<OrderList />);

    expect(getByRole('textbox')).not.toBeNull();
    expect(getByPlaceholderText('Filter by user name and surname')).not.toBeNull();
    expect(getByText("OrderID")).not.toBeNull();
    expect(getByText("User")).not.toBeNull();
    expect(getByText("Booking Issue Date")).not.toBeNull();
    expect(getByText("State")).not.toBeNull();
    expect(getByText("Scheduled Date")).not.toBeNull();
    expect(getByText("Total price")).not.toBeNull();
    expect(getByText("Handed out")).not.toBeNull();
    expect(getByText("Actions")).not.toBeNull();
})

it("renders an order tuple", () => {
    const { getByRole } = render(
        <Order order={{
            BookingId: 1, UserId: 2, BookingStartDate: '2021-11-12', State: 2,
            PickupTime: '2021-11-14', DeliveryTime: null, TotalPrice: 22.5
        }} />)

    expect(getByRole('row', { name: /1 2021-11-12 2 2021-11-14 22.5 click to hand it out Delete Order/i })).not.toBeNull();
    expect(getByRole('cell', {name: /22.5/i})).not.toBeNull();
    expect(getByRole('cell', { name: /click to hand it out/i })).not.toBeNull();
})