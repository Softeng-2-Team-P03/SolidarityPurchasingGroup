import * as React from 'react';
import { render, within, fireEvent, getByText } from '@testing-library/react';

import { OrderList, Order, ContactUser, DeleteOrder } from '../OrderList';

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

it("renders an order with state issued", () => {
    const { getByRole, queryByText } = render(
        <Order order={{
            BookingId: 1, UserName: 'Luca', UserSurname: 'Abruzzi', BookingStartDate: '2021-11-12 09:35', State: 'Issued',
            PickupTime: '2021-11-14', DeliveryTime: null, TotalPrice: 22.5
        }} />)

    const row = getByRole('row', { name: /1 Luca Abruzzi 2021\-11\-12 09:35 Issued 2021\-11\-14 22\.5 click to hand it out delete order/i });
    expect(row).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /22\.5/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /click to hand it out/i })).not.toBeNull();
    expect(within(row).queryByText('button', { name: /contact user/i })).toBeNull();
    expect(within(row).getByRole('button', { name: /delete order/i })).not.toBeNull();
})

it("renders an order with state pending for cancelation", () => {
    const { getByRole } = render(
        <Order order={{
            BookingId: 1, UserName: 'Luca', UserSurname: 'Abruzzi', BookingStartDate: '2021-11-12 09:35', State: 'Pending for cancelation',
            PickupTime: '2021-11-14', DeliveryTime: null, TotalPrice: 22.5
        }} />)

    const row = getByRole('row', { name: /1 Luca Abruzzi 2021\-11\-12 09:35 pending for cancelation 2021\-11\-14 22\.5 click to hand it out contact user delete order/i });
    expect(row).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /22\.5/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /click to hand it out/i })).not.toBeNull();
    expect(within(row).getByRole('button', { name: /contact user/i })).not.toBeNull();
    expect(within(row).getByRole('button', { name: /delete order/i })).not.toBeNull();
})

it("renders an order with state paid", () => {
    const { getByRole, queryByText } = render(
        <Order order={{
            BookingId: 1, UserName: 'Luca', UserSurname: 'Abruzzi', BookingStartDate: '2021-11-12 09:35', State: 'Paid',
            PickupTime: null, DeliveryTime: '2021-11-14 21:00', TotalPrice: 25.5
        }} />)

    const row = getByRole('row', { name: /1 Luca Abruzzi 2021\-11\-12 09:35 paid 2021\-11\-14 21:00 25\.5 click to hand it out delete order/i });
    expect(row).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /25\.5/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /click to hand it out/i })).not.toBeNull();
    expect(within(row).queryByText('button', { name: /contact user/i })).toBeNull();
    expect(within(row).getByRole('button', { name: /delete order/i })).not.toBeNull();
})

it("renders an order with state handed out", () => {
    const { getByRole, queryByText } = render(
        <Order order={{
            BookingId: 1, UserName: 'Luca', UserSurname: 'Abruzzi', BookingStartDate: '2021-11-12 09:35', State: 'Handed out',
            PickupTime: null, DeliveryTime: '2021-11-14 21:00', TotalPrice: 27.5
        }} />)

    const row = getByRole('row', { name: /1 Luca Abruzzi 2021\-11\-12 09:35 handed out 2021\-11\-14 21:00 27\.5 click to hand it out delete order/i });
    expect(row).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /27\.5/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /click to hand it out/i })).not.toBeNull();
    expect(within(row).queryByText('button', { name: /contact user/i })).toBeNull();
    expect(within(row).getByRole('button', { name: /delete order/i })).not.toBeNull();
})

it("renders an order with state handed out", () => {
    const { getByRole, queryByText } = render(
        <Order order={{
            BookingId: 1, UserName: 'Luca', UserSurname: 'Abruzzi', BookingStartDate: '2021-11-12 09:35', State: 'Handed out',
            PickupTime: null, DeliveryTime: '2021-11-14 21:00', TotalPrice: 27.5
        }} />)

    const row = getByRole('row', { name: /1 Luca Abruzzi 2021\-11\-12 09:35 handed out 2021\-11\-14 21:00 27\.5 click to hand it out delete order/i });
    expect(row).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /27\.5/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /click to hand it out/i })).not.toBeNull();
    expect(within(row).queryByText('button', { name: /contact user/i })).toBeNull();
    expect(within(row).getByRole('button', { name: /delete order/i })).not.toBeNull();
})

it("renders an order with state canceled", () => {
    const { getByRole, queryByText } = render(
        <Order order={{
            BookingId: 1, UserName: 'Luca', UserSurname: 'Abruzzi', BookingStartDate: '2021-11-12 09:35', State: 'canceled',
            PickupTime: null, DeliveryTime: '2021-11-14 21:00', TotalPrice: 27.5
        }} />)

    const row = getByRole('row', { name: /1 Luca Abruzzi 2021\-11\-12 09:35 canceled 2021\-11\-14 21:00 27\.5 click to hand it out delete order/i });
    expect(row).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /27\.5/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /click to hand it out/i })).not.toBeNull();
    expect(within(row).queryByText('button', { name: /contact user/i })).toBeNull();
    expect(within(row).getByRole('button', { name: /delete order/i })).not.toBeNull();
})

it("renders an order with state created", () => {
    const { getByRole, queryByText } = render(
        <Order order={{
            BookingId: 1, UserName: 'Luca', UserSurname: 'Abruzzi', BookingStartDate: '2021-11-12 09:35', State: 'created',
            PickupTime: null, DeliveryTime: '2021-11-14 21:00', TotalPrice: 27.5
        }} />)

    const row = getByRole('row', { name: /1 Luca Abruzzi 2021\-11\-12 09:35 created 2021\-11\-14 21:00 27\.5 click to hand it out delete order/i });
    expect(row).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /27\.5/i })).not.toBeNull();
    expect(within(row).getByRole('cell', { name: /click to hand it out/i })).not.toBeNull();
    expect(within(row).queryByText('button', { name: /contact user/i })).toBeNull();
    expect(within(row).getByRole('button', { name: /delete order/i })).not.toBeNull();
})

it("clicks on button contact user", () => {
    const { getByRole, getByText, queryByRole } = render(
        <ContactUser order={{
            UserName: 'Luca', UserSurname: 'Abruzzi', PhoneNumber: '03609493647', Email: 'luca@spg.com',
            TotalPrice: 22.5, Wallet: 1
        }} />
    )

    expect(getByRole('button', { name: /contact user/i })).not.toBeNull();

    fireEvent.click(getByRole('button', { name: /contact user/i }));

    const dialog = getByRole('dialog');
    expect(dialog).not.toBeNull();
    expect(getByText(/user info/i)).not.toBeNull();
    expect(within(dialog).getByRole('button', {name: /close/i})).not.toBeNull();
    expect(getByText(/name : luca abruzzi/i)).not.toBeNull();
    expect(getByText(/phone number : 03609493647/i)).not.toBeNull();
    expect(getByText(/email : luca@spg\.com/i)).not.toBeNull();
    expect(getByText(/total price for this order : 22\.5 \- actual wallet : 1/i)).not.toBeNull();
})

it("clicks on delete order button", () => {
    const { getByRole, getByText, queryByRole } = render(
        <DeleteOrder />
    )

    expect(getByRole('button', { name: /delete order/i })).not.toBeNull();

    fireEvent.click(getByRole('button', { name: /delete order/i }));

    const dialog = getByRole('dialog');
    expect(dialog).not.toBeNull();
    expect(getByText(/are you sure you want to delete this order\?/i)).not.toBeNull();
    expect(within(dialog).getByRole('button', { name: /delete order/i })).not.toBeNull();
    expect(within(dialog).getByRole('button', { name: /back/i })).not.toBeNull();

})