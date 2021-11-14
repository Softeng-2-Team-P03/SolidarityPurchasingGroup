import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NavBar from '../NavBar';

test("renders the NavBar ", () => {
    // Render a react component to the DOM.
    const { getByText } = render(<NavBar />);

    //verify the NavBar it's rendering 
    expect(getByText("SPG")).not.toBeNull();

});

