import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, MemoryRouter } from 'react-router-dom';
import { getByTestId, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HomePage from '../HomePage';

test("renders the HomePage ", () => {
    // Render a react component to the DOM.
    const { getByText } = render(
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

    //verify the cart button it's rendering and shows 0 products added to the cart by default
    expect(getByText("Log In")).not.toBeNull();
    expect(getByText("Products")).not.toBeNull();
    expect(getByText("Register")).not.toBeNull();
    expect(getByText("Candidate")).not.toBeNull();
});


test("The icons on the sections sidebar hooks to different sections of the homepage when clicked", async () => {
    const { getByText, getByTestId } = render(
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
    userEvent.click(getByTestId("infoHook"));
    await waitFor(() => getByText("How does it work?"));

    userEvent.click(getByTestId("candidateHook"));
    await waitFor(() => getByText("Are you a farmer or a delivery person?"));

    userEvent.click(getByTestId("categoryHook"));
    await waitFor(() => getByText("Our products and category"));

    userEvent.click(getByTestId("shopHook"));
    await waitFor(() => getByText("Solidarity Purchasing Group!"));

    //await waitFor(() => getByText("Info"));
    //await waitFor(() => getByText("Join us"));
});



/* --------------- INTEGRATION TESTS ------------------*/

//verify the dropdown shows when clicking the Sections button
test("The Products button redirects you to the /products path", async () => {
    
    let testHistory, testLocation;

    const { getByText, findByText } = render(
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
    expect(getByText("Products")).not.toBeNull();

    //click on the Products button to got to the /products path
    userEvent.click(getByText("Products"));

    await waitFor(() => expect(testLocation.pathname).toBe("/products") );

});


test("The Log In button redirects you to the /login path", async () => {
    
    let testHistory, testLocation;

    const { getByText, findByText } = render(
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
    expect(getByText("Log In")).not.toBeNull();

    //click on the Log In button to got to the /login path
    userEvent.click(getByText("Log In"));

    await waitFor(() => expect(testLocation.pathname).toBe("/login") );

});

test("The Register button redirects you to the /addClient path", async () => {
    
    let testHistory, testLocation;

    const { getByText, findByText } = render(
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
    expect(getByText("Register")).not.toBeNull();

    //click on the Products button to got to the /products path
    userEvent.click(getByText("Register"));

    await waitFor(() => expect(testLocation.pathname).toBe("/addClient") );

});

