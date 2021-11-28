import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, MemoryRouter } from 'react-router-dom';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClientModal } from "../AddClient"

const addClient = (newClient) => {
    true;
  };

test("renders the AddClient component with all it's input fields ", () => {
    // Render a react component to the DOM.
    const { getByText } = render(
        <Router>
            <Switch>
                <Route path="/addClient" render={() => (
                        <ClientModal addClient={addClient}></ClientModal>
                )} />
                <Route render={() =>
                    <Redirect to='/addClient' />
                } />
            </Switch>
        </Router>
    );

    //verify the cart button it's rendering and shows 0 products added to the cart by default
    expect(getByText("New client")).not.toBeNull();
    expect(getByText("Name")).not.toBeNull();
    expect(getByText("Surname")).not.toBeNull();
    expect(getByText("Email")).not.toBeNull();

    expect(getByText("Password")).not.toBeNull();
    expect(getByText("PhoneNumber")).not.toBeNull();
    expect(getByText("Address")).not.toBeNull();
    expect(getByText("Register")).not.toBeNull();
});


test("All input fields work as ecxpected and are linked to their label", async () => {

    let testHistory, testLocation;

    const { getByText, getByLabelText } = render(
        <MemoryRouter initialEntries={["/addClient"]}>
            <ClientModal addClient={addClient}></ClientModal>
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
    
    const inputName = screen.getByLabelText("Name")
    userEvent.type(inputName, 'nometest')
    expect(inputName.value).toBe('nometest')

    const inputSurname = screen.getByLabelText("Surname")
    userEvent.type(inputSurname, 'cognometest')
    expect(inputSurname.value).toBe('cognometest')

    const inputEmail = screen.getByLabelText("Email")
    userEvent.type(inputEmail, 'nometest.cognometest@poli.it')
    expect(inputEmail.value).toBe('nometest.cognometest@poli.it')

    const inputPassword = screen.getByLabelText("Password")
    userEvent.type(inputPassword, 'testpassword')
    expect(inputPassword.value).toBe('testpassword')

    const inputPhoneNumber = screen.getByLabelText("PhoneNumber")
    userEvent.type(inputPhoneNumber, '3317144651')
    expect(inputPhoneNumber.value).toBe('3317144651')

    //await waitFor(() => expect(testLocation.pathname).toBe("/addClient"));

});


test("Error messages pops up when input is missing or wrong", async () => {

    let testHistory, testLocation;

    const { getByText, getByLabelText } = render(
        <MemoryRouter initialEntries={["/addClient"]}>
            <ClientModal addClient={addClient}></ClientModal>
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

    userEvent.click(getByText("Register"))
    
    /*
    const inputName = screen.getByLabelText("Name")
    userEvent.type(inputName, 'nometest')
    expect(inputName.value).toBe('nometest')

    const inputSurname = screen.getByLabelText("Surname")
    userEvent.type(inputSurname, 'cognometest')
    expect(inputSurname.value).toBe('cognometest')

    const inputEmail = screen.getByLabelText("Email")
    userEvent.type(inputEmail, 'nometest.cognometest@poli.it')
    expect(inputEmail.value).toBe('nometest.cognometest@poli.it')

    const inputPassword = screen.getByLabelText("Password")
    userEvent.type(inputPassword, 'testpassword')
    expect(inputPassword.value).toBe('testpassword')

    const inputPhoneNumber = screen.getByLabelText("PhoneNumber")
    userEvent.type(inputPhoneNumber, '3317144651')
    expect(inputPhoneNumber.value).toBe('3317144651')*/

    //await waitFor(() => expect(testLocation.pathname).toBe("/addClient"));

});