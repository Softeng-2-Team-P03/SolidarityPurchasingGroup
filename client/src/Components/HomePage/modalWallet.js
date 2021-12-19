import { Modal,Button} from "react-bootstrap"; 

function ModalError(props) {
    return (
      <>
        <Modal
          show={props.show}
          backdrop="static"
          onHide={props.handleClose}
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
           {props.description}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={props.handleClose}>Understood</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  export default ModalError; 