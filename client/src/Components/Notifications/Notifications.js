
import { useState, useEffect } from "react";
import { Alert, Offcanvas } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Notifications.css'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Badge, IconButton } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import userApi from '../../api/user-api';
import api from '../../API';

const theme = createTheme({
    palette: {
        primary: {
            light: '#ff7961',
            main: '#FF6071',
            dark: '#ba000d',
            contrastText: '#fff',
        },
    },
});

function Notifications({ name, ...props }) {

    const [show, setShow] = useState(false);
    const [countNoti, setCountNoti] = useState(0);
    const [notifications, setNotifications] = useState("");
    const [dirty, setDirty] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {

        if (dirty) {
            userApi.getNotifications().then(notifications => {
                setNotifications(notifications);
                setCountNoti(notifications.length);
                setDirty(false);
            })
                .catch(err => {
                    console.error(err);
                });
        }

    }, [dirty]);


    function notificationsLabel(count) {
        if (count === 0) {
            return 'no notifications';
        }
        if (count > 99) {
            return 'more than 99 notifications';
        }
        return `${count} notifications`;
    }

    const dismissNotification = (id) => {
        api.updateNotificationVisibility(1, id)
            .then(() => setDirty(true))
            .catch(err => console.error(err));
    }

    const dismissAll = () => {
        notifications.forEach((notification) => {
            api.updateNotificationVisibility(1, notification.notificationId)
            .catch(err => console.error(err));
        })
        setDirty(true);
    }

    return (
        <>
            {countNoti !== 0 ?
                <ThemeProvider theme={theme}>
                    <IconButton aria-label={notificationsLabel(countNoti)} onClick={handleShow}>
                        <Badge badgeContent={countNoti} color="primary">
                            <NotificationsActiveIcon fontSize={"large"} sx={{ color: '#ffc404' }} />
                        </Badge>
                    </IconButton>
                </ThemeProvider>
                :
                <ThemeProvider theme={theme}>
                    <IconButton onClick={handleShow}>
                        <Badge color="primary">
                            <NotificationsIcon fontSize={"large"} sx={{ color: '#ffc404' }} />
                        </Badge>
                    </IconButton>
                </ThemeProvider>

            }


            <Offcanvas className="offC" show={show} onHide={handleClose} {...props}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Notification</Offcanvas.Title>
                    <button type="button" className="btn btn-warning" disabled={countNoti === 0}
                        onClick={() => dismissAll()}>Dismiss All</button>
                </Offcanvas.Header>

                {countNoti !== 0 ?
                    <Offcanvas.Body>
                        {notifications.map((notification) =>

                            <Alert variant="warning">
                                <Alert.Heading>{notification.notificationHeader}</Alert.Heading>
                                <p>
                                    {notification.notificationBody}
                                </p>
                                <hr />
                                <div className="d-flex justify-content-end">
                                    <button type="button" className="btn btn-warning"
                                        onClick={() => dismissNotification(notification.notificationId)}>Dismiss</button>
                                </div>
                            </Alert>


                        )}
                    </Offcanvas.Body>

                    :
                    <Offcanvas.Body className="noNoty">
                        You don't have notifications to be shown
                    </Offcanvas.Body>
                }

            </Offcanvas>
        </>
    );
}

export default Notifications;

