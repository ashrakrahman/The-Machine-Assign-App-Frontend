import * as React from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import Cookies from "universal-cookie";
import { Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Store } from "redux";
import { getHasTokenStatus } from "../../store/ducks/jwtInfoState";
import { FormGroup, Label, Input, InputGroup, Button } from "reactstrap";

export interface OperatorListProps {
  hasToken: boolean;
}

export interface OperatorListState {
  data: any;
  start_date: any;
  end_date: any;
}

class OperatorList extends React.Component<
  OperatorListProps,
  OperatorListState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      start_date: "2020-01-01",
      end_date: "2020-12-31"
    };
  }

  public async componentDidMount() {
    await this.getOperatorList(this.state.start_date, this.state.end_date);
  }

  private onChangeStartDateHandler = (event: any) => {
    this.setState({ start_date: event.currentTarget.value });
  };
  private onChangeEndDateHandler = (event: any) => {
    this.setState({ end_date: event.currentTarget.value });
  };

  public submitFilter = () => {
    this.getOperatorList(this.state.start_date, this.state.end_date);
  };

  public async getOperatorList(startDate: string, endDate: string) {
    const formData = {
      start_date: startDate,
      end_date: endDate
    };
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");
    await axios
      .post(
        process.env.REACT_APP_BASE_API_URL + "/assign/operator-list",
        formData,
        {
          headers: { "x-access-token": access_token }
        }
      )
      .then(response => {
        this.setState({ data: response.data.data || [] });
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response);
        }
      });
  }

  render() {
    if (this.props.hasToken === true) {
      const columns = [
        "#",
        "Machine No",
        "Schedule",
        "Operator Code",
        "Operator Name",
        "Activated Date"
      ];
      const assignList: any = this.state.data;
      const muiAssignList: any = [];

      let i = 1;
      assignList.forEach((element: any) => {
        let arr: any = [];
        arr.push(i++);
        arr.push(element.machine_code);

        if (element.shift === "shift_a") {
          arr.push("SHIFT A : 6AM-2PM");
        } else if (element.shift === "shift_b") {
          arr.push("SHIFT B : 2PM-10PM");
        } else {
          arr.push("SHIFT C : 10PM-6AM");
        }

        arr.push(element.operator_id);
        arr.push(element.operator_name);
        arr.push(element.assigned_date.toString().slice(0, 10));
        muiAssignList.push(arr);
      });

      return (
        <Row style={{ marginBottom: "150px" }}>
          <Col sm={{ size: 3, offset: 1 }}>
            <br></br>
            <FormGroup>
              <Label for="startDate">Start date </Label>
              <InputGroup size="sm">
                <Input
                  type="date"
                  value={this.state.start_date}
                  id="startDate"
                  name="startDate"
                  onChange={this.onChangeStartDateHandler}
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col sm={{ size: 3 }}>
            <br></br>
            <FormGroup>
              <Label for="endDate">End date </Label>
              <InputGroup size="sm">
                <Input
                  type="date"
                  value={this.state.end_date}
                  id="endDate"
                  name="endDate"
                  onChange={this.onChangeEndDateHandler}
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col sm={{ size: 1 }}>
            <br></br>
            <br></br>
            <Button onClick={this.submitFilter}>Filter</Button>
          </Col>
          <Col sm={{ size: 10, order: 2, offset: 1 }}>
            <br></br>
            <MUIDataTable
              title={"Operator List Table"}
              data={muiAssignList}
              columns={columns}
              options={{
                selectableRows: "none"
              }}
            />
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
const ConnectedOperatorList = connect(
  mapStateToProps,
  mapDispatchToProps
)(OperatorList);

export default ConnectedOperatorList;
