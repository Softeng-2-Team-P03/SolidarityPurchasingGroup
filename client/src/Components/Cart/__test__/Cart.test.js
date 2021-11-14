import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';

import Cart from '../Cart';

it("renders the cart button", ()=>{
    // Render a react component to the DOM.
    const { getByText, getByTestId } = render(<Cart />);
    
    //verify the cart button it's rendering and shows 0 products added to the cart by default
    expect(getByTestId("cartButton")).not.toBeNull();
    expect(getByText("0")).not.toBeNull();     

  });


  it("clicking on cart button renders the cart modal as expected", ()=>{
    // Render a react component to the DOM.
    const { getByText, getByTestId } = render(<Cart />);

    //clicks on the cart button
    fireEvent.click(getByTestId("cartButton"));

    //make sure now the modal is rendered
    expect(getByTestId("cartModal")).not.toBeNull();

    //And has it's components rendering correctly

    //The label "Your Cart" appears and shows (0) since no product has been added
    expect(getByText("Your Cart (0)")).not.toBeNull();  
    
    //The label "Subtotal: € 0.00" appears and it's 0.00 since no product has been added
    expect(getByText("Subtotal: € 0.00")).not.toBeNull();   

    //the Confirm button appears
    expect(getByText("Confirm Order")).not.toBeNull();

  });
