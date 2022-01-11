import * as React from 'react';
import { render } from '@testing-library/react';
import UnretrievedFood from '../UnretrievedFood.js'

test("renders the loading unretrieved food page", () => {
    const {getByRole} = render(<UnretrievedFood />);

    expect(getByRole('heading', {name: /please wait while we process the data/i})).not.toBeNull();
})