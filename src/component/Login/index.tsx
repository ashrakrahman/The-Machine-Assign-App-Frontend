import React from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Alert
} from "reactstrap";
import { Redirect } from "react-router-dom";
import { BeatLoader } from "react-spinners";

interface LoginState {
  username: string;
  password: any;
  isFormSubmitted: null | boolean;
  shouldComponentRedirect: boolean;
  errorMessage: null | string;
  isLoading: boolean;
}

class Login extends React.Component<{}, LoginState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isFormSubmitted: null,
      shouldComponentRedirect: false,
      errorMessage: null,
      isLoading: false
    };
  }

  handleSubmit = (event: any) => {
    event.preventDefault();
    if (this.state.username === "" || this.state.password === "") {
      alert("Empty field!");
    } else {
      this.setState({ isLoading: true });
      const data = {
        username: this.state.username,
        password: this.state.password
      };

      axios
        .post(process.env.REACT_APP_BASE_API_URL + "/users/login", data, {
          headers: {}
        })
        .then(response => {
          const cookies = new Cookies();
          cookies.set("access_token", response.data.data.access_token, {
            path: "/"
          });
          cookies.set("refresh_token", response.data.data.refresh_token, {
            path: "/"
          });
          cookies.set("user_type", response.data.data.user_type, {
            path: "/"
          });
          this.setState({
            isFormSubmitted: true,
            username: "",
            password: "",
            shouldComponentRedirect: true,
            errorMessage: null,
            isLoading: false
          });
        })
        .catch(error => {
          if (error.response) {
            this.setState({
              isFormSubmitted: false,
              errorMessage: error.response.data["message"],
              isLoading: false
            });
            console.log(error.response.data);
          }
        });
    }
  };

  render() {
    const override = `
    display: block;
    margin-left: 10px;
    border-color: #0b5679;
    margin-top: 10px;
    `;
    if (!this.state.shouldComponentRedirect) {
      return (
        <Row>
          <Col
            sm={{ size: 6, order: 2, offset: 1 }}
            className="LoginFormFieldBody"
          >
            <br></br>
            {this.state.errorMessage != null ? (
              <Alert color="danger">{this.state.errorMessage}</Alert>
            ) : null}
            <h1>Login</h1>
            <hr></hr>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  placeholder=""
                  value={this.state.username}
                  onChange={e => this.setState({ username: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder=""
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })}
                />
              </FormGroup>
              <Button type="submit">Login</Button>
              {this.state.isLoading === true ? (
                <span>
                  <BeatLoader css={override} size={10} loading={true} />
                </span>
              ) : null}
            </Form>
          </Col>
        </Row>
      );
    } else {
      return <Redirect to="/home" />;
    }
  }
}

export default Login;
