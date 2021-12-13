import * as React from 'react';
import { render, within, fireEvent } from '@testing-library/react';

import { MyOrderList, MyOrder, UpdateBooking, ProductUpdate } from '../MyOrderList';

it("renders MyOrderList table", () => {
    const { getByRole } = render(<MyOrderList />)

    expect(getByRole('columnheader', { name: /orderid/i })).not.toBeNull();
    expect(getByRole('columnheader', { name: /booking issue date/i })).not.toBeNull();
    expect(getByRole('columnheader', { name: /state/i })).not.toBeNull();
    expect(getByRole('columnheader', { name: /scheduled date/i })).not.toBeNull();
    expect(getByRole('columnheader', { name: /total price/i })).not.toBeNull();
});

it("renders an order row with pickup time and update option", () => {
    const { getByRole, queryByRole } = render(
        <MyOrder order={{
            BookingId: 31, BookingStartDate: "2021-11-29 21:30:51",
            PickupTime: "2021-11-30 09:35", DeliveryTime: undefined, TotalPrice: 16.5
        }} timeEnabled={true} state="Issued" />
    )

    const row = getByRole('row', { name: /31 2021\-11\-29 21:30:51 issued pickuptime: 2021\-11\-30 09:35 16.5 € delete booking update booking/i });
    expect(row).not.toBeNull();

    expect(within(row).getByRole('cell', { name: /31/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /2021\-11\-29/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /issued/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /pickuptime: 2021\-11\-30 09:35/i })).not.toBeNull();
    expect(within(row).queryByRole('cell', { name: /deliverytime: 2021\-11\-30 09:35/i })).toBeNull();
    expect(within(row).getByRole('cell', { name: /16.5 €/i })).not.toBeNull();

    expect(within(row).getByRole('cell', { name: /delete booking/i })).not.toBeNull();
    expect(within(row).getByRole('button', { name: /delete booking/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /update booking/i })).not.toBeNull();
    expect(within(row).getByRole('button', { name: /update booking/i })).not.toBeNull();
})

it("renders an order row with delivery time and update option", () => {
    const { getByRole, queryByRole } = render(
        <MyOrder order={{
            BookingId: 31, BookingStartDate: "2021-11-29 21:30:51",
            PickupTime: undefined, DeliveryTime: "2021-11-30 09:35", TotalPrice: 16.5
        }} timeEnabled={true} state="Issued" />
    )

    const row = getByRole('row', { name: /31 2021\-11\-29 21:30:51 issued deliverytime:2021\-11\-30 09:35 16.5 € delete booking update booking/i });
    expect(row).not.toBeNull();

    expect(within(row).getByRole('cell', { name: /31/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /2021\-11\-29/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /issued/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /deliverytime:2021\-11\-30 09:35/i })).not.toBeNull();
    expect(within(row).queryByRole('cell', { name: /pickuptime: 2021\-11\-30 09:35/i })).toBeNull();
    expect(within(row).getByRole('cell', { name: /16.5 €/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /delete booking/i })).not.toBeNull();
    expect(within(row).getByRole('button', { name: /delete booking/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /update booking/i })).not.toBeNull();
    expect(within(row).getByRole('button', { name: /update booking/i })).not.toBeNull();
})

it("renders an order row with pickup time without update option", () => {
    const { getByRole, queryByRole } = render(
        <MyOrder order={{
            BookingId: 31, BookingStartDate: "2021-11-29 21:30:51",
            PickupTime: "2021-11-30 09:35", DeliveryTime: undefined, TotalPrice: 16.5
        }} timeEnabled={false} state="Issued" />
    )

    const row = getByRole('row', { name: /31 2021\-11\-29 21:30:51 issued pickuptime: 2021\-11\-30 09:35 16.5 € delete booking/i });
    expect(row).not.toBeNull();

    expect(within(row).getByRole('cell', { name: /31/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /2021\-11\-29/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /issued/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /pickuptime: 2021\-11\-30 09:35/i })).not.toBeNull();
    expect(within(row).queryByRole('cell', { name: /deliverytime: 2021\-11\-30 09:35/i })).toBeNull();
    expect(within(row).getByRole('cell', { name: /16.5 €/i })).not.toBeNull();

    expect(within(row).getByRole('cell', { name: /delete booking/i })).not.toBeNull();
    expect(within(row).getByRole('button', { name: /delete booking/i })).not.toBeNull();
    expect(within(row).queryByRole('cell', { name: /update booking/i })).toBeNull();
    expect(within(row).queryByRole('button', { name: /update booking/i })).toBeNull();
})

it("renders the modal to update an order with delivery", () => {
    const { getByText, getByRole, getByTestId } = render(
        <UpdateBooking order={{
            BookingId: 31, BookingStartDate: "2021-11-29 21:30:51",
            PickupTime: undefined, DeliveryTime: "2021-11-30 09:35", TotalPrice: 16.5
        }} />
    )

    expect(getByRole('button', { name: /update booking/i })).not.toBeNull();
    fireEvent.click(getByRole('button', { name: /update booking/i }));

    expect(getByText(/subtotal: € 16.5/i)).not.toBeNull();
    expect(getByText(/delivery fees included/i)).not.toBeNull();
    expect(getByRole('combobox')).not.toBeNull();
    //expect(getByText(/select date and time/i)).not.toBeNull();
    expect(within(getByTestId('cartModal')).getByRole('button', { name: /update/i })).not.toBeNull();
    expect(getByText(/remember to choose a delivery option/i)).not.toBeNull();
})

it("renders the modal to update an order without delivery", () => {
    const { getByText, getByRole, getByTestId, queryByText } = render(
        <UpdateBooking order={{
            BookingId: 31, BookingStartDate: "2021-11-29 21:30:51",
            PickupTime: "2021-11-30 09:35", DeliveryTime: undefined, TotalPrice: 16.5
        }} />
    )

    expect(getByRole('button', { name: /update booking/i })).not.toBeNull();
    fireEvent.click(getByRole('button', { name: /update booking/i }));

    expect(getByText(/subtotal: € 16.5/i)).not.toBeNull();
    expect(queryByText(/delivery fees included/i)).toBeNull();
    expect(getByRole('combobox')).not.toBeNull();
    //expect(getByText(/select date and time/i)).not.toBeNull();
    expect(within(getByTestId('cartModal')).getByRole('button', { name: /update/i })).not.toBeNull();
    expect(getByText(/remember to choose a delivery option/i)).not.toBeNull();
})

it("renders a product in the modal to update it", () => {
    const { getByText, getByRole } = render(
        <ProductUpdate product={{ ProductId: 31, Name: "Pumpkins", ImagePath: "p31-1.jpg", PricePerUnit: 1, Quantity: 40 }} />
    )

    expect(getByRole('img')).not.toBeNull();
    expect(getByText('€ 1')).not.toBeNull();
    expect(getByRole('spinbutton')).not.toBeNull();
    expect(getByText(/40 pieces available/i)).not.toBeNull();
    expect(getByText(/pumpkins/i)).not.toBeNull();
    expect(getByRole('button', { name: /x/i })).not.toBeNull();
    expect(getByRole('button', {name: /\-/i})).not.toBeNull();
    expect(getByRole('button', {name: /\+/i})).not.toBeNull();
})