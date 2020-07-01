import React from "react";
import { Row, Col, Button, FormGroup, Label, Input, Form } from "reactstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import { Store } from "redux";
import { getHasTokenStatus } from "../../store/ducks/jwtInfoState";
import Modal from "react-bootstrap/Modal";
import { Redirect } from "react-router-dom";
import MUIDataTable from "mui-datatables";

interface MachineProps {
  hasToken: boolean;
}

interface MachineState {
  show: boolean;
  machineName: string;
  machineCode: string;
  machineType: string;
  isUpdate: boolean;
  machineId: null | string;
  data: any;
}

class Machine extends React.Component<MachineProps, MachineState> {
  constructor(props: any) {
    super(props);
    this.state = {
      show: false,
      machineName: "",
      machineCode: "",
      machineType: "",
      isUpdate: false,
      machineId: null,
      data: []
    };
  }

  public async componentDidMount() {
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");
    await axios
      .get(process.env.REACT_APP_BASE_API_URL + "/machines", {
        headers: { "x-access-token": access_token }
      })
      .then(response => {
        this.setState({ data: response.data.data || [] });
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response);
        }
      });
  }

  public handleShow = () => {
    this.setState({ show: true });
  };

  public handleDelete = async (event: any) => {
    const buttonName = event.target.id;
    const machineId = buttonName.toString().split("_")[2];
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");

    if (window.confirm("Are you sure?")) {
      await axios
        .delete(process.env.REACT_APP_BASE_API_URL + "/machines/" + machineId, {
          headers: { "x-access-token": access_token }
        })
        .then(response => {
          if (response.status === 200) {
            alert("succefully deleted!");
            window.location.reload();
          }
        })
        .catch(error => {
          if (error) {
            alert("An error occured!");
          }
        });
    }
  };

  public handleShowEdit = async (event: any) => {
    const buttonName = event.target.id;
    const machineId = buttonName.toString().split("_")[2];
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");

    await axios
      .get(process.env.REACT_APP_BASE_API_URL + "/machines/" + machineId, {
        headers: { "x-access-token": access_token }
      })
      .then(response => {
        this.setState({
          machineId: machineId,
          machineName: response.data.data.name,
          machineType: response.data.data.type,
          machineCode: response.data.data.code
        });
      })
      .catch(error => {
        if (error) {
          console.log(error);
          alert("An error occured!");
        }
      });

    this.setState({ show: true, isUpdate: true });
  };

  public handleClose = () => {
    this.setState({ show: false, isUpdate: false });
  };

  public handleSubmit = () => {
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");
    if (
      this.state.machineName === "" ||
      this.state.machineType === "" ||
      this.state.machineCode === ""
    ) {
      alert("Empty field!");
    } else {
      const formData: any = {
        name: this.state.machineName,
        type: this.state.machineType,
        code: this.state.machineCode
      };
      axios
        .post(process.env.REACT_APP_BASE_API_URL + "/machines", formData, {
          headers: { "x-access-token": access_token }
        })
        .then(response => {
          console.log(response);
          if (window.confirm("Machine added Successfully!")) {
            this.setState({ show: false });
            window.location.reload();
          }
        })
        .catch(error => {
          if (error) {
            if (error.response) {
              alert(error.response.data.message);
            } else {
              alert("An Error Occured!");
            }
          }
        });
    }
  };

  public handleUpdate = async () => {
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");
    if (
      this.state.machineName === "" ||
      this.state.machineType === "" ||
      this.state.machineCode === "" ||
      this.state.machineId === null
    ) {
      alert("Empty field or Machine Id not found!");
    } else {
      const formData: any = {
        name: this.state.machineName,
        type: this.state.machineType,
        code: this.state.machineCode
      };
      await axios
        .patch(
          process.env.REACT_APP_BASE_API_URL +
            "/machines/" +
            this.state.machineId,
          formData,
          {
            headers: { "x-access-token": access_token }
          }
        )
        .then(response => {
          console.log(response);
          if (window.confirm("Machine updated Successfully!")) {
            this.setState({ show: false });
            window.location.reload();
          }
        })
        .catch(error => {
          if (error) {
            if (error.response) {
              alert(error.response.data.message);
            } else {
              alert("An Error Occured!");
            }
          }
        });
    }
  };

  render() {
    if (this.props.hasToken === true) {
      let modalText = "Enter Machine Info";
      if (this.state.isUpdate === true) {
        modalText = "Update Machine Info";
      }

      const machineList: any = this.state.data;
      const muiMachineList: any = [];
      const machineIdList: any = [];
      let i = 1;

      machineList.forEach((element: any) => {
        let arr: any = [];
        arr.push(i++);
        arr.push(element.name);
        arr.push(element.type);
        arr.push(element.code);
        muiMachineList.push(arr);
        machineIdList.push(element._id);
      });

      const columns = [
        "#",
        "Machine Type",
        "Machine Name",
        "Machine Code",
        {
          name: "Action",
          options: {
            filter: false,
            sort: false,
            empty: true,
            customBodyRenderLite: (dataIndex: any, rowIndex: any) => {
              return (
                <div>
                  <Button
                    id={"button_edit_" + machineIdList[rowIndex]}
                    type="submit"
                    onClick={(event: any) => this.handleShowEdit(event)}
                    color="warning"
                    size="sm"
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    id={"button_delete_" + machineIdList[rowIndex]}
                    color="danger"
                    size="sm"
                    onClick={(event: any) => this.handleDelete(event)}
                  >
                    Delete
                  </Button>
                </div>
              );
            }
          }
        }
      ];

      return (
        <Row style={{ marginBottom: "150px" }}>
          <Col sm={{ size: 10, order: 2, offset: 1 }}>
            <br></br>
            <Button variant="primary" size="sm" onClick={this.handleShow}>
              Add new machine
            </Button>
            <br></br>
            <br></br>
            <MUIDataTable
              title={"Machine List Table"}
              data={muiMachineList}
              columns={columns}
              options={{
                selectableRows: "none" // <===== will turn off checkboxes in rows
              }}
            />

            <Modal show={this.state.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{modalText}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <FormGroup row>
                    <Label for="name" sm={2}>
                      Name
                    </Label>
                    <Col sm={10}>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder=""
                        value={this.state.machineName}
                        onChange={e =>
                          this.setState({ machineName: e.target.value })
                        }
                        required
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="type" sm={2}>
                      Type
                    </Label>
                    <Col sm={10}>
                      <Input
                        type="text"
                        name="type"
                        id="type"
                        placeholder=""
                        value={this.state.machineType}
                        onChange={e =>
                          this.setState({ machineType: e.target.value })
                        }
                        required
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="name" sm={2}>
                      Code
                    </Label>
                    <Col sm={10}>
                      <Input
                        type="text"
                        name="code"
                        id="code"
                        placeholder=""
                        value={this.state.machineCode}
                        onChange={e =>
                          this.setState({ machineCode: e.target.value })
                        }
                        required
                      />
                    </Col>
                  </FormGroup>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button color="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button
                  type="submit"
                  onClick={
                    this.state.isUpdate === true
                      ? this.handleUpdate
                      : this.handleSubmit
                  }
                  color="primary"
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      );
    } else {
      return <Redirect to="/home" />;
    }
  }
}

/** Interface to describe props from mapStateToProps */
interface DispatchedStateProps {
  hasToken: any;
}

/** Map props to state  */
const mapStateToProps = (state: Partial<Store>): DispatchedStateProps => {
  const result = {
    hasToken: getHasTokenStatus(state)
  };
  return result;
};

/** map props to actions */
const mapDispatchToProps = {};

/** connect Decimal component to the redux store */
const ConnectedMachine = connect(mapStateToProps, mapDispatchToProps)(Machine);

export default ConnectedMachine;
