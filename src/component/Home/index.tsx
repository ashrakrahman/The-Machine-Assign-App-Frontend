import React from "react";
import { Alert, Row, Col } from "reactstrap";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import { Store } from "redux";
import {
  getHasTokenStatus,
  setHasTokenStatusAction
} from "../../store/ducks/jwtInfoState";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { BeatLoader } from "react-spinners";

interface HomeState {
  userData: any;
  isAccessTokenExpired: boolean;
  isRefreshTokenExpired: boolean;
  hasMessage: boolean;
  isLoading: boolean;
}

interface HomeProps {
  setHasTokenStatusActionCreator: typeof setHasTokenStatusAction;
  hasToken: boolean;
}

class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      userData: null,
      isAccessTokenExpired: false,
      isRefreshTokenExpired: false,
      hasMessage: false,
      isLoading: true
    };
  }

  public async componentDidMount() {
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");
    const refresh_token = cookies.get("refresh_token");

    if (
      access_token === "" ||
      access_token === null ||
      access_token === undefined
    ) {
      this.props.setHasTokenStatusActionCreator(false);
    } else {
      this.props.setHasTokenStatusActionCreator(true);
    }

    if (this.state.isAccessTokenExpired === false) {
      await axios
        .get(process.env.REACT_APP_BASE_API_URL + "/users/info", {
          headers: { "x-access-token": access_token }
        })
        .then(response => {
          this.setState({
            userData: response.data,
            hasMessage: true,
            isLoading: false
          });
        })
        .catch(error => {
          if (error.response) {
            if (error.response.data.status === "401") {
              this.setState({ isAccessTokenExpired: true, isLoading: false });
            } else {
              this.setState({ isAccessTokenExpired: true, isLoading: false });
              alert("An Error occoured!");
            }
          }
        });
    }

    // check if refresh token is valid
    // if refresh token is valid gets a new access token and store it
    // if refresh token is invalid , redirect to login page, system needs login
    if (this.state.isAccessTokenExpired === true) {
      if (access_token !== "" && access_token !== undefined) {
        await axios
          .post(process.env.REACT_APP_BASE_API_URL + "/users/refresh", null, {
            headers: { "x-access-token": refresh_token }
          })
          .then(response => {
            const access_token = response.data.data.access_token;
            cookies.set("access_token", access_token, {
              path: "/"
            });
            console.log("======= Re-gain Access Token ============");
            this.getUserData(access_token);
          })
          .catch(error => {
            if (error.response) {
              console.log(error.response);
              this.setState({ isRefreshTokenExpired: true, isLoading: false });
            }
          });
      } else {
        this.setState({ isRefreshTokenExpired: true, isLoading: false });
      }
    }
  }

  public async getUserData(access_token: any) {
    await axios
      .get(process.env.REACT_APP_BASE_API_URL + "/users/info", {
        headers: { "x-access-token": access_token }
      })
      .then(response => {
        this.setState({
          userData: response.data,
          isAccessTokenExpired: false,
          hasMessage: true,
          isLoading: false
        });
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response);
          this.setState({ isRefreshTokenExpired: true, isLoading: false });
        }
      });
  }

  render() {
    if (this.state.isLoading) {
      const override = `
      display: block;
      margin-left: 48%;
      border-color: #0b5679;
      margin-top: 20%;
      `;
      return (
        <div className="sweet-loading">
          <BeatLoader css={override} size={20} loading={true} />
        </div>
      );
    } else {
      const name =
        this.state.userData != null ? this.state.userData.data.username : null;
      const cookies = new Cookies();
      const user_type = cookies.get("user_type");

      if (this.props.hasToken === true) {
        const message =
          "Welcome @" + name + ". You Logged in as " + user_type + ".";
        if (this.state.isRefreshTokenExpired === true) {
          return <Redirect to="/logout" />;
        }
        return (
          <Row>
            <Col sm={{ size: 10, order: 2, offset: 1 }}>
              <br></br>
              {this.state.hasMessage ? (
                <Alert color="success">{message} </Alert>
              ) : null}
            </Col>
          </Row>
        );
      } else {
        return (
          <Row>
            <Col sm={{ size: 10, order: 2, offset: 1 }}>
              <br></br>
              <Alert color="primary">Please Login to continue.</Alert>
            </Col>
          </Row>
        );
      }
    }
  }
}

/** connect the component to the store */

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
const mapDispatchToProps = {
  setHasTokenStatusActionCreator: setHasTokenStatusAction
};

/** connect Decimal component to the redux store */
const ConnectedHome = connect(mapStateToProps, mapDispatchToProps)(Home);

export default ConnectedHome;
