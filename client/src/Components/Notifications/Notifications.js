
import {useState} from "react";
import {Alert, Offcanvas} from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Notifications.css'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {Badge, IconButton} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    const [countNoti, setCountNoti] = useState(10);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function notificationsLabel(count) {
        if (count === 0) {
            return 'no notifications';
        }
        if (count > 99) {
            return 'more than 99 notifications';
        }
        return `${count} notifications`;
    }

    return (
        <>
            {countNoti!==0 ?
                <ThemeProvider theme={theme}>
                    <IconButton aria-label={notificationsLabel(countNoti)} onClick={handleShow}>
                        <Badge badgeContent={countNoti} color="primary">
                            <NotificationsActiveIcon fontSize={"large"} sx={{color: '#ffc404'}}/>
                        </Badge>
                    </IconButton>
                </ThemeProvider>
                :
                <ThemeProvider theme={theme}>
                    <IconButton onClick={handleShow}>
                        <Badge color="primary">
                            <NotificationsIcon fontSize={"large"} sx={{color: '#ffc404'}}/>
                        </Badge>
                    </IconButton>
                </ThemeProvider>

            }


            <Offcanvas className="offC" show={show} onHide={handleClose} {...props}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Notification</Offcanvas.Title>
                </Offcanvas.Header>

                    {countNoti!==0 ?
                        <Offcanvas.Body>
                    <Alert variant="warning">
                        <Alert.Heading>Attenzione notifica</Alert.Heading>
                        <p>
                           Questa è una notifica da prendere in considerazione
                        </p>
                        <hr />
                        <div className="d-flex justify-content-end">
                            <button type="button" className="btn btn-warning">Dismiss</button>
                        </div>
                    </Alert>
                        </Offcanvas.Body>

                        :
                        <Offcanvas.Body className="noNoty">
                            Notifications will appear here
                        </Offcanvas.Body>
                    }

            </Offcanvas>
        </>
    );
}

export default Notifications;

