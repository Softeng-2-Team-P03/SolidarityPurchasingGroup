import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect, MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LoginComponent } from '../LoginComponent';


const userLoginCallback = async (email, password) => {
    // Make POST request to authentication server
    try {
      const userInfo = {Name:`NameTest`, Surname:`SurnameTest`}; //await API.logIn({ username: email, password: password });
      //setUser(userInfo);
      //setMessage({ msg: `Welcome!`, type: 'text-success' });
      //setLoggedIn(true);
    } catch (err) {
      //setMessage({ msg: 'wrong email or password', type: 'text-danger' });
    }
  };

test("renders the Login form as intended ", () => {
    // Render a react component to the DOM.
    const { getByText, getByLabelText } = render(
        <Router>
            <Switch>
                <Route exact path="/login" render={() =>
                    <LoginComponent userLoginCallback={userLoginCallback} message={''} />} />
                <Route render={() =>
                    <Redirect to='/login' />
                } />
            </Switch>
        </Router>
    );

    //verify the login form it's rendering
    //expect(getByText("Email address")).not.toBeNull();
    expect(getByLabelText("Email address")).not.toBeNull();
    expect(getByText("Password")).not.toBeNull();
    expect(getByLabelText("Password")).not.toBeNull();

    //verify the dropdown shows when clicking the Sections button
    /*act(() => {
        fireEvent.click(getByText("Sections"));
    });*/


});

