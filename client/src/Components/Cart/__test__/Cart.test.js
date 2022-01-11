import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Cart from '../Cart';

const loadingConfirm = false;
const errorConfirm = '';
const testProdOne = {id:1, imagePath:`testImage.jpg`, name:`testProduct`, farmer:{name:`testFarmerName`, surname:`testFarmerSurname`}, pricePerUnit:10, selectedQuantity:1}

const setFee = () => {
  return;
}
const deleteProductFromCart = (removeId) => {
  setCart(oldCart => oldCart.filter(product => product.id !== removeId));
  setDirtyInfo(true);
}

const modifyProductInCart = (modifyId, addQuantity) => {
  const newQuantity = cart.filter(product => product.id === modifyId)[0].selectedQuantity + addQuantity;

  if (newQuantity === 0) {
      deleteProductFromCart(modifyId);
  }
  else {
      setCart(oldCart => oldCart.map(product => product.id === modifyId ? { ...product, selectedQuantity: newQuantity } : product));
  }
  setDirtyInfo(true);
}

const confirmOrder = () => {
  const booking = {
      userId: (location.state && location.state.userId) ? location.state.userId : undefined,
      bookingStartDate: "2021-11-15", //waiting for virtual clock to implement
      totalPrice: cartInfo.totalPrice,
      pickupTime: "2021-11-17",
      deliveryTime: undefined,
      state: 0,
      products: cart.map(product => ({
          productId: product.id, quantity: product.selectedQuantity,
          price: (product.selectedQuantity * product.pricePerUnit).toFixed(2)
      }))
  }
  
  setLoadingConfirm(true);
  bookingApi.addBooking(booking)
      .then(() => {
          setLoadingConfirm(false);
          setCart([]);
          setCartInfo({ numItems: 0, totalPrice: 0 });
          setErrorConfirm('');
      }).catch(err => {
          setErrorConfirm('Error during the confirmation of the order')
          console.error(err);
      });
}

it("renders the cart button", ()=>{

    // Render a react component to the DOM.
    const { getByText, getByTestId } = render(<Cart cart={[]} setFee={setFee} cartInfo={{numItems: 0, totalPrice: 0 }} deleteProductFromCart={deleteProductFromCart}
      modifyProductInCart={modifyProductInCart} confirmOrder={confirmOrder} loadingConfirm={false}
      errorConfirm={""} userName={location.state && location.state.userName} />);
    
    //verify the cart button it's rendering and shows 0 products added to the cart by default
    expect(getByTestId("cartButton")).not.toBeNull();
    expect(getByText("0")).not.toBeNull();     

  });


  it("clicking on cart button renders the cart modal as expected", ()=>{
    // Render a react component to the DOM.
    const { getByText, getByTestId } = render(<Cart cart={[]} setFee={setFee} cartInfo={{numItems: 0, totalPrice: 0 }} deleteProductFromCart={deleteProductFromCart}
      modifyProductInCart={modifyProductInCart} confirmOrder={confirmOrder} loadingConfirm={loadingConfirm}
      errorConfirm={errorConfirm} userName={location.state && location.state.userName} />);

    //clicks on the cart button
    fireEvent.click(getByTestId("cartButton"));

    //make sure now the modal is rendered
    expect(getByTestId("cartModal")).not.toBeNull();

    //And has it's components rendering correctly

    //The label "Your Cart" appears and shows (0) since no product has been added
    expect(getByText("Cart (0 items)")).not.toBeNull();  
    
    //The label "Subtotal: € 0.00" appears and it's 0.00 since no product has been added
    expect(getByText("Subtotal: € 0")).not.toBeNull();   

    //the Confirm button appears
    expect(getByText("Confirm Order")).not.toBeNull();

  });

  it("the cart modal renders products as expected", ()=>{
    // Render a react component to the DOM.
    const { getByText, getByTestId } = render(<Cart cart={[testProdOne]} setFee={setFee} cartInfo={{numItems: 1, totalPrice: 10 }} deleteProductFromCart={deleteProductFromCart}
      modifyProductInCart={modifyProductInCart} confirmOrder={confirmOrder} loadingConfirm={loadingConfirm}
      errorConfirm={errorConfirm} userName={location.state && location.state.userName} />);

    //clicks on the cart button
    fireEvent.click(getByTestId("cartButton"));

    //make sure now the modal is rendered
    expect(getByTestId("cartModal")).not.toBeNull();

    //And has it's components rendering correctly

    //The label "Your Cart" appears and shows (1) since one product has been added
    expect(getByText("Cart (1 items)")).not.toBeNull();  
    
    //The label "Subtotal: € 0.00" appears and it's 0.00 since no product has been added
    expect(getByText("Subtotal: € 10")).not.toBeNull();   

    //the Confirm button appears
    expect(getByText("Confirm Order")).not.toBeNull();

    //the infos about the added product appears
    expect(getByText("testProduct")).not.toBeNull();
    expect(getByText("Farmer: testFarmerName testFarmerSurname")).not.toBeNull();

  });
