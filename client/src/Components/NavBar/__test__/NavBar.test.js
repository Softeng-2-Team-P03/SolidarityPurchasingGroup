import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NavBar from '../NavBar';

test("renders the NavBar when not logged in", () => {
    // Render a react component to the DOM.
    const { getByRole, getByText } = render(<NavBar />);

    //verify the NavBar it's rendering 
    expect(getByRole('navigation')).not.toBeNull();

    //Logo
    expect(getByRole('img', { name: /spg/i })).not.toBeNull();
    expect(getByRole('link', {name: /spg spg/i})).not.toBeNull();

    //Clock
    expect(getByText(/〈/i)).not.toBeNull();
    expect(getByText(/〉/i)).not.toBeNull();
    expect(getByRole('button', { name: /resettime/i })).not.toBeNull();

    expect(getByRole('link', { name: /login/i })).not.toBeNull();
});

test("renders the NavBar when logged in as manager", () => {
    // Render a react component to the DOM.
    const { getByText, getByRole } = render(<NavBar loggedIn={true} user={{accessType: 1}}/>);

    //verify the NavBar it's rendering 
    expect(getByRole('navigation')).not.toBeNull();

    //Logo
    expect(getByRole('img', { name: /spg/i })).not.toBeNull();
    expect(getByRole('link', {name: /spg spg/i})).not.toBeNull();

    //Clock
    expect(getByText(/〈/i)).not.toBeNull();
    expect(getByText(/〉/i)).not.toBeNull();
    expect(getByRole('button', { name: /resettime/i })).not.toBeNull();

    //Manager Navbar
    expect(getByRole('link', { name: /browse shop/i })).not.toBeNull();
    expect(getByRole('link', { name: /clients/i })).not.toBeNull();
    expect(getByRole('link', { name: /orders/i })).not.toBeNull();

    expect(getByRole('button', { name: /logout/i })).not.toBeNull();
});

test("renders the NavBar when logged in as employee", () => {
    // Render a react component to the DOM.
    const { getByText, getByRole } = render(<NavBar loggedIn={true} user={{accessType: 2}}/>);

    //verify the NavBar it's rendering 
    expect(getByRole('navigation')).not.toBeNull();

    //Logo
    expect(getByRole('img', { name: /spg/i })).not.toBeNull();
    expect(getByRole('link', {name: /spg spg/i})).not.toBeNull();

    //Clock
    expect(getByText(/〈/i)).not.toBeNull();
    expect(getByText(/〉/i)).not.toBeNull();
    expect(getByRole('button', { name: /resettime/i })).not.toBeNull();

    //Employee Navbar
    expect(getByRole('link', { name: /browse shop/i })).not.toBeNull();
    expect(getByRole('link', { name: /clients/i })).not.toBeNull();
    expect(getByRole('link', { name: /orders/i })).not.toBeNull();

    expect(getByRole('button', { name: /logout/i })).not.toBeNull();
});

test("renders the NavBar when logged in as client", () => {
    // Render a react component to the DOM.
    const { getByText, getByRole } = render(<NavBar loggedIn={true} user={{accessType: 3}}/>);

    //verify the NavBar it's rendering 
    expect(getByRole('navigation')).not.toBeNull();

    //Logo
    expect(getByRole('img', { name: /spg/i })).not.toBeNull();
    expect(getByRole('link', {name: /spg spg/i})).not.toBeNull();

    //Clock
    expect(getByText(/〈/i)).not.toBeNull();
    expect(getByText(/〉/i)).not.toBeNull();
    expect(getByRole('button', { name: /resettime/i })).not.toBeNull();

    //Client Navbar
    expect(getByRole('link', { name: /browse shop/i })).not.toBeNull();
    //These two will become link after implementing
    expect(getByRole('link', { name: /my orders/i })).not.toBeNull();
    expect(getByRole('button', { name: /my wallet/i })).not.toBeNull();

    expect(getByRole('button', { name: /logout/i })).not.toBeNull();
});

test("renders the NavBar when logged in as farmer", () => {
    // Render a react component to the DOM.
    const { getByText, getByRole } = render(<NavBar loggedIn={true} user={{accessType: 4}}/>);

    //verify the NavBar it's rendering 
    expect(getByRole('navigation')).not.toBeNull();

    //Logo
    expect(getByRole('img', { name: /spg/i })).not.toBeNull();
    expect(getByRole('link', {name: /spg spg/i})).not.toBeNull();

    //Clock
    expect(getByText(/〈/i)).not.toBeNull();
    expect(getByText(/〉/i)).not.toBeNull();
    expect(getByRole('button', { name: /resettime/i })).not.toBeNull();

    //Farmer Navbar: still to complete

    expect(getByRole('button', { name: /logout/i })).not.toBeNull();
});

test("renders the NavBar when logged in as deliverer", () => {
    // Render a react component to the DOM.
    const { getByText, getByRole } = render(<NavBar loggedIn={true} user={{accessType: 5}}/>);

    //verify the NavBar it's rendering 
    expect(getByRole('navigation')).not.toBeNull();

    //Logo
    expect(getByRole('img', { name: /spg/i })).not.toBeNull();
    expect(getByRole('link', {name: /spg spg/i})).not.toBeNull();

    //Clock
    expect(getByText(/〈/i)).not.toBeNull();
    expect(getByText(/〉/i)).not.toBeNull();
    expect(getByRole('button', { name: /resettime/i })).not.toBeNull();

    //Deliverer Navbar: still to complete

    expect(getByRole('button', { name: /logout/i })).not.toBeNull();
});



