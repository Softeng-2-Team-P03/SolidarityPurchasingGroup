import NavBar from "../NavBar/NavBar";
import {useState} from "react";
import {Offcanvas} from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Notifications.css'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {Badge, IconButton} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import {yellow} from "@mui/material/colors";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#ff7961',
            main: '#ff0000',
            dark: '#ba000d',
            contrastText: '#fff',
        },
    },
});

function Notifications({ name, ...props }) {

    const [show, setShow] = useState(false);
    const [countNoti, setCountNoti] = useState(100);

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
                            <NotificationsActiveIcon fontSize={"large"} sx={{color: yellow[500]}}/>
                        </Badge>
                    </IconButton>
                </ThemeProvider>
                :
                <ThemeProvider theme={theme}>
                    <IconButton onClick={handleShow}>
                        <Badge color="primary">
                            <NotificationsIcon fontSize={"large"} sx={{color: yellow[500]}}/>
                        </Badge>
                    </IconButton>
                </ThemeProvider>

            }


            <Offcanvas show={show} onHide={handleClose} {...props}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    Some text as placeholder. In real life you can have the elements you
                    have chosen. Like, text, images, lists, etc.
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default Notifications;

