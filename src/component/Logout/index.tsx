import React from "react";
import { Alert, Row, Col } from "reactstrap";
import Cookies from "universal-cookie";
import { Redirect } from "react-router-dom";

interface LogoutState {
  isCookiesDeleted: null | boolean;
}

class Logout extends React.Component<{}, LogoutState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isCookiesDeleted: false
    };
  }

  public componentDidMount() {
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");
    if (access_token !== "") {
      cookies.set("access_token", "", { path: "/" });
      cookies.set("refresh_token", "", { path: "/" });
      cookies.set("user_type", "", { path: "/" });
      // cookies.remove("access_token");
      // cookies.remove("refresh_token");
      // cookies.remove("user_type");
      this.setState({ isCookiesDeleted: true });
    }
  }

  render() {
    if (this.state.isCookiesDeleted === true) {
      return <Redirect to="/home" />;
    } else {
      return (
        <Row>
          <Col sm={{ size: 10, order: 2, offset: 1 }}>
            <br></br>
            <Alert color="danger">Error Occured!</Alert>
          </Col>
        </Row>
      );
    }
  }
}

export default Logout;
