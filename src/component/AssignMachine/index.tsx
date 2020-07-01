import * as React from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  Row,
  Col,
  Alert
} from "reactstrap";
import Select from "react-select";
import Cookies from "universal-cookie";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { shifts } from "./../../constants";

export interface AssignMachineProps {}

export interface AssignMachineState {
  isOpen: boolean;
  operatorList: any;
  operatorName: string;
  operatorCode: string;
  machineList: any;
  machineId: any;
  shiftId: any;
  assignDate: any;
  isFormSUbmitted: null | boolean;
  submitMessage: string;
}

class AssignMachine extends React.Component<
  AssignMachineProps,
  AssignMachineState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isOpen: false,
      operatorList: [],
      operatorName: "",
      operatorCode: "",
      machineList: [],
      machineId: "",
      shiftId: "",
      assignDate: "",
      isFormSUbmitted: null,
      submitMessage: ""
    };
  }

  handleSubmit = (event: any) => {
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");
    event.preventDefault();
    if (
      this.state.operatorName === "" ||
      this.state.operatorCode === "" ||
      this.state.machineId === "" ||
      this.state.shiftId === "" ||
      this.state.assignDate === ""
    ) {
      alert("Empty field!");
    } else {
      const formData = {
        operator_id: this.state.operatorCode,
        operator_name: this.state.operatorName,
        machine_id: this.state.machineId.value,
        machine_code: this.state.machineId.label,
        shift: this.state.shiftId.value,
        assigned_date: this.state.assignDate
      };

      axios
        .post(process.env.REACT_APP_BASE_API_URL + "/assign", formData, {
          headers: { "x-access-token": access_token }
        })
        .then(response => {
          this.setState({
            isFormSUbmitted: true,
            operatorName: "",
            operatorCode: "",
            machineId: "",
            shiftId: "",
            assignDate: "",
            submitMessage: response.data.message
          });
          window.scrollTo(0, 0);
        })
        .catch(error => {
          console.log(error.response);
          if (error) {
            if (error.response.data.status === "400") {
              this.setState({
                isFormSUbmitted: false,
                submitMessage: error.response.data.message
              });
              window.scrollTo(0, 0);
            } else {
              this.setState({
                isFormSUbmitted: false,
                submitMessage: "An Error Occurred!"
              });
              window.scrollTo(0, 0);
            }
          }
        });
    }
  };

  updateCategory = (event: any) => {
    const operatorInfoList = event.target.value.toString().split("/");
    if (operatorInfoList[0] !== "" && operatorInfoList[1] !== "") {
      this.setState({
        operatorName: operatorInfoList[0],
        operatorCode: operatorInfoList[1]
      });
    }
  };

  /** sets the value of field element in state
   * @param {any} event - the onchange input event
   */
  private onChangeMachineHandler = (event: any) => {
    const data = { value: event.value, label: event.label };

    this.setState({ machineId: data });
  };
  /** sets the value of field element in state
   * @param {any} event - the onchange input event
   */
  private onChangeShiftHandler = (event: any) => {
    const data = { value: event.value, label: event.label };
    this.setState({ shiftId: data });
  };

  /** sets the value of field element in state
   * @param {any} event - the onchange input event
   */
  private onChangeDateHandler = (event: any) => {
    this.setState({ assignDate: event.currentTarget.value });
  };

  public async componentDidMount() {
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");
    await axios
      .get(process.env.REACT_APP_BASE_API_URL + "/users/operator", {
        headers: { "x-access-token": access_token }
      })
      .then(response => {
        this.setState({ operatorList: response.data.data || [] });
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response);
        }
      });

    await axios
      .get(process.env.REACT_APP_BASE_API_URL + "/machines", {
        headers: { "x-access-token": access_token }
      })
      .then(response => {
        this.setState({ machineList: response.data.data || [] });
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response);
        }
      });
  }

  render() {
    const operatorList: any = this.state.operatorList;
    const machineList: any = this.state.machineList;
    const selectedMachineValue: any = this.state.machineId;
    const selectedShiftValue: any = this.state.shiftId;
    const defaultAssignDateValue: any = this.state.assignDate;
    const isFormSubmitted = this.state.isFormSUbmitted;
    const alertMessage = this.state.submitMessage;
    const muiOperatorList: any = [];

    operatorList.forEach((element: any) => {
      let arr: any = [];
      arr.push(element.count);
      arr.push(element.name);
      arr.push(element.id);
      muiOperatorList.push(arr);
    });

    const machineListOptions: any = [];
    machineList.map((elem: any) => {
      return machineListOptions.push({
        label: elem.name + "/" + elem.code,
        value: elem._id
      });
    });

    const columns = [
      "#",
      "Operator Name",
      "Operator Code",
      {
        name: "Assign",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRenderLite: (dataIndex: any, rowIndex: any) => {
            return (
              <div>
                <FormGroup check>
                  <Input
                    type="radio"
                    value={
                      muiOperatorList[rowIndex][1] +
                      "/" +
                      muiOperatorList[rowIndex][2]
                    }
                    name="radio1"
                    onChange={this.updateCategory}
                  />
                </FormGroup>
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
          {isFormSubmitted !== null &&
            (isFormSubmitted === true ? (
              <Alert color="success">{alertMessage}</Alert>
            ) : (
              <Alert color="danger">{alertMessage}</Alert>
            ))}
          <h3>Assign Machine To an Operator</h3>
          <hr></hr>
          <br></br>
        </Col>
        <Col
          sm={{ size: 5, order: 2, offset: 1 }}
          style={{ marginBottom: "20px" }}
        >
          <MUIDataTable
            title={"Operator List Table"}
            data={muiOperatorList}
            columns={columns}
            options={{
              selectableRows: "none" // <===== will turn off checkboxes in rows
            }}
          />
        </Col>
        <Col sm={{ size: 4, order: 2, offset: 1 }} className="formFieldBody">
          <h4>Assign Form</h4>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="machineCode">Machine Name/Code </Label>
              <Select
                multi={false}
                name="machineCode"
                id="machineCode"
                options={machineListOptions}
                value={selectedMachineValue || ""}
                onChange={this.onChangeMachineHandler}
              />
            </FormGroup>
            <FormGroup>
              <Label for="assignDate">Assigned date </Label>
              <InputGroup size="sm">
                <Input
                  type="date"
                  id="assignDate"
                  name="assignDate"
                  value={defaultAssignDateValue}
                  onChange={this.onChangeDateHandler}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="shift">Shift </Label>
              <Select
                multi={false}
                name="shift"
                id="shift"
                options={shifts}
                value={selectedShiftValue || ""}
                onChange={this.onChangeShiftHandler}
              />
            </FormGroup>
            <FormGroup>
              <Label for="operatorName">Operator Name</Label>
              <InputGroup size="sm">
                <Input
                  type="text"
                  readOnly
                  name="operatorName"
                  id="operatorName"
                  value={this.state.operatorName}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="operatorCode">Operator Code</Label>
              <InputGroup size="sm">
                <Input
                  type="text"
                  readOnly
                  name="operatorCode"
                  id="operatorCode"
                  value={this.state.operatorCode}
                />
              </InputGroup>
            </FormGroup>

            <Button type="submit">Submit</Button>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default AssignMachine;
