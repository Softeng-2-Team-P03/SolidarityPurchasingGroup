import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, MemoryRouter } from 'react-router-dom';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClientList, WalletTopUpModal } from "../ClientList"

const addClient = (newClient) => {
    true;
  };

test("the client table renders as expected ", () => {
    // Render a react component to the DOM.
    const { queryByText, queryByRole, queryByPlaceholderText } = render(
        <Router>
            <Switch>
                <Route path="/clients" render={() => (
                        <ClientList ></ClientList>
                )} />
                <Route render={() =>
                    <Redirect to='/clients' />
                } />
            </Switch>
        </Router>
    );

    expect(queryByText("Name")).not.toBeNull();
    expect(queryByRole('columnheader', {  name: /surname/i})).not.toBeNull();
    expect(queryByRole('columnheader', {  name: /email/i})).not.toBeNull();
    expect(queryByPlaceholderText(/search client/i)).not.toBeNull();
    const inputName = queryByPlaceholderText(/search client/i)
    userEvent.type(inputName, 'nometest')
    expect(inputName.value).toBe('nometest')

});


test("the top up wallet modal renders as expected ", () => {
    // Render a react component to the DOM.
    const { queryByText, queryByRole, queryByPlaceholderText } = render(
        <Router>
            <Switch>
                <Route path="/clients" render={() => (
                        <WalletTopUpModal client={ {name:"nameTest", surname:"surnameTest", wallet:0} } />
                )} />
                <Route render={() =>
                    <Redirect to='/clients' />
                } />
            </Switch>
        </Router>
    );

    expect(queryByRole('button', {  name: /top up wallet/i})).not.toBeNull();
    userEvent.click(queryByRole('button', {  name: /top up wallet/i}));
    expect(queryByText(/wallet info/i)).not.toBeNull();
    expect(queryByRole('heading', { name: /nametest surnametest's credit: 0/i })).not.toBeNull();
    expect(screen.queryByText(/amount of money to top up in the user wallet :/i)).not.toBeNull();
    expect(queryByRole('spinbutton', { name: /amount of money to top up in the user wallet :/i })).not.toBeNull();
    
    const inputAmount = queryByRole('spinbutton', { name: /amount of money to top up in the user wallet :/i })
    userEvent.type(inputAmount, '100')
    expect(inputAmount.value).toBe('100')

    userEvent.click(queryByRole('button', {  name: /submit/i}));
    //await waitFor(() => expect(queryByText(/wallet info/i)).toBeNull() );
    //expect(queryByText("Top Up Wallet")).not.toBeNull();
});