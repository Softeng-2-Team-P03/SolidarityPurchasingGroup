import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, MemoryRouter } from 'react-router-dom';
import { queryByTestId, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HomePage from '../HomePage';

test("renders the HomePage ", () => {
    // Render a react component to the DOM.
    const { queryByText, queryByRole } = render(
        <Router>
            <Switch>
                <Route exact path="/" render={() =>
                    <HomePage />
                } />
                <Route render={() =>
                    <Redirect to='/' />
                } />
            </Switch>
        </Router>
    );

    expect(queryByRole('button', {  name: /log in/i})).not.toBeNull();
    expect(queryByRole('button', {  name: /products/i})).not.toBeNull();
    expect(queryByRole('button', {  name: /register/i})).not.toBeNull();
    expect(queryByRole('button', {  name: /candidate/i})).not.toBeNull();
});


test("The icons on the sections sidebar hooks to different sections of the homepage when clicked", async () => {
    const { queryByText, queryByTestId } = render(
        <Router>
            <Switch>
                <Route exact path="/" render={() =>
                    <HomePage />
                } />
                <Route render={() =>
                    <Redirect to='/' />
                } />
            </Switch>
        </Router>
    );

    //click on the section dropdown button to open it
    userEvent.click(queryByTestId("infoHook"));
    await waitFor(() => queryByText("How does it work?"));

    userEvent.click(queryByTestId("candidateHook"));
    await waitFor(() => queryByText("Are you a farmer or a delivery person?"));

    userEvent.click(queryByTestId("categoryHook"));
    await waitFor(() => queryByText("Our products and category"));

    userEvent.click(queryByTestId("shopHook"));
    await waitFor(() => queryByText("Solidarity Purchasing Group!"));

    //await waitFor(() => queryByText("Info"));
    //await waitFor(() => queryByText("Join us"));
});



/* --------------- INTEGRATION TESTS ------------------*/

//verify the dropdown shows when clicking the Sections button
test("The Products button redirects you to the /products path", async () => {
    
    let testHistory, testLocation;

    const { queryByRole } = render(
        <MemoryRouter initialEntries={["/my/initial/route"]}>
            <HomePage />
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

    //verify the Products button is rendered
    expect(queryByRole('button', {  name: /products/i})).not.toBeNull();

    //click on the Products button to got to the /products path
    userEvent.click(queryByRole('button', {  name: /products/i}));

    await waitFor(() => expect(testLocation.pathname).toBe("/products") );

});


test("The Log In button redirects you to the /login path", async () => {
    
    let testHistory, testLocation;

    const { queryByText, queryByRole } = render(
        <MemoryRouter initialEntries={["/my/initial/route"]}>
            <HomePage />
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

    //verify the Products button is rendered
    expect(queryByRole('button', {  name: /log in/i})).not.toBeNull();

    //click on the Log In button to got to the /login path
    userEvent.click(queryByRole('button', {  name: /log in/i}));

    await waitFor(() => expect(testLocation.pathname).toBe("/login") );

});

test("The Register button redirects you to the /addClient path", async () => {
    
    let testHistory, testLocation;

    const { queryByRole } = render(
        <MemoryRouter initialEntries={["/my/initial/route"]}>
            <HomePage />
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

    //verify the Register button is rendered
    expect(queryByRole('button', {  name: /register/i})).not.toBeNull();

    //click on the Products button to got to the /products path
    userEvent.click(queryByRole('button', {  name: /register/i}));

    await waitFor(() => expect(testLocation.pathname).toBe("/addClient") );

});

