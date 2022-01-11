import * as React from 'react';
import { render, within } from '@testing-library/react';
import { WareHouseHome, RowData } from '../WareHouseHome.js'
import userEvent from '@testing-library/user-event';

test("renders the search product box", () => {
    const {getByRole, getByPlaceholderText} = render(<WareHouseHome />)

    expect(getByRole('textbox')).not.toBeNull();
    expect(getByPlaceholderText('Search product')).not.toBeNull();
    const inputName = getByRole('textbox');
    userEvent.type(inputName, 'prodottotest');
    expect(inputName.value).toBe('prodottotest');
});

test("renders the table", () => {
    const {getByRole} = render(<WareHouseHome />)

    expect(getByRole('columnheader', {name: /productid/i})).not.toBeNull();
    expect(getByRole('columnheader', {name: /name/i})).not.toBeNull();
})

test("renders a row of the table with product non in warehouse", () => {
    const {getByRole} = render(<RowData product={{id: 1, name: "Crimson Crisp Apple", state: 1}} />);

    const row = getByRole('row', {name: /1 crimson crisp apple delivered/i});
    expect(row).not.toBeNull();
    expect(within(row).getByRole('cell', {name: /1/i})).not.toBeNull();
    expect(within(row).getByRole('cell', {name: /crimson crisp apple/i})).not.toBeNull();
    expect(within(row).getByRole('cell', {name: /delivered/i})).not.toBeNull();
    expect(within(row).getByRole('checkbox', {name: /delivered/i})).not.toBeNull();
    expect(within(row).getByRole('checkbox', {name: /delivered/i}).checked).toBe(false);
})

test("renders a row of the table with product in warehouse", () => {
    const {getByRole} = render(<RowData product={{id: 2, name: "Williams Pear", state: 2}} />);

    const row = getByRole('row', {name: /2 williams pear delivered/i});
    expect(row).not.toBeNull();
    expect(within(row).getByRole('cell', {name: /2/i})).not.toBeNull();
    expect(within(row).getByRole('cell', {name: /williams pear/i})).not.toBeNull();
    expect(within(row).getByRole('cell', {name: /delivered/i})).not.toBeNull();
    expect(within(row).getByRole('checkbox', {name: /delivered/i})).not.toBeNull();
    expect(within(row).getByRole('checkbox', {name: /delivered/i}).checked).toBe(true);
})