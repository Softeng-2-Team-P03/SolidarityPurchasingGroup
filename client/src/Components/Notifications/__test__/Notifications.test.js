import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Notifications from '../Notifications.js'

test("renders the notification button", () => {
    const { getByTestId, queryByText, queryByRole } = render(<Notifications />);

   expect(getByTestId('NotificationsIcon')).not.toBeNull();
   expect(queryByRole('dialog')).toBeNull();
   expect(queryByText('Notification')).toBeNull();
   expect(queryByText(/you don't have notifications to be shown/i)).toBeNull();
})

test("opens the off canvas", () => {
    const { getByRole, getByText, getByTestId } = render(<Notifications />);

    fireEvent.click(getByTestId("NotificationsIcon"));
    expect(getByRole('dialog')).not.toBeNull();
    expect(getByText('Notification')).not.toBeNull();
    expect(getByText(/you don't have notifications to be shown/i)).not.toBeNull();
})