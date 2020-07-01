import * as React from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import Cookies from "universal-cookie";
import { Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Store } from "redux";
import { getHasTokenStatus } from "../../store/ducks/jwtInfoState";

export interface AssignListProps {
  hasToken: boolean;
}

export interface AssignListState {
  data: any;
}

class AssignList extends React.Component<AssignListProps, AssignListState> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: []
    };
  }

  public async componentDidMount() {
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");
    await axios
      .get(process.env.REACT_APP_BASE_API_URL + "/assign/all", {
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
          <Col sm={{ size: 10, order: 2, offset: 1 }}>
            <br></br>
            <br></br>
            <MUIDataTable
              title={"Assign List Table"}
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
const ConnectedAssignList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignList);

export default ConnectedAssignList;
