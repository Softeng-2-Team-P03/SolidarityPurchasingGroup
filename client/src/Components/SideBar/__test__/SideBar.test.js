import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SideBar from '../SideBar';

test("renders the loading sidebar", () => {

    const { getByText } = render(<SideBar loadingTypes={true} types={[]} />);

    expect(getByText('Type of Products')).not.toBeNull();
    expect(getByText('Loading categories')).not.toBeNull();
})

test("renders the sidebar with types", () => {

    const { getByText, queryByText, getByRole } = render(<SideBar loadingTypes={false} category={0}
        types={[{ id: 1, typeName: "Fruits & Vegetables" }, { id: 2, typeName: "Dairy" },
        { id: 3, typeName: "Meat & Salumi" }, { id: 4, typeName: "Sea Products" },
        { id: 5, typeName: "Bakery & Sweets" }, { id: 6, typeName: "Beverages" }]} />);

    expect(getByText('Type of Products')).not.toBeNull();
    expect(queryByText('Loading categories')).toBeNull();

    expect(getByText('All')).not.toBeNull();
    expect(getByRole('button', {  name: /fruits & vegetables/i})).not.toBeNull();
    expect(getByRole('button', {  name: /dairy/i})).not.toBeNull();
    expect(getByRole('button', {  name: /meat & salumi/i})).not.toBeNull();
    expect(getByRole('button', {  name: /sea products/i})).not.toBeNull();
    expect(getByRole('button', {  name: /bakery & sweets/i})).not.toBeNull();
    expect(getByRole('button', {  name: /beverages/i})).not.toBeNull();

})