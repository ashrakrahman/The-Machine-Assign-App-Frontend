import React from "react";
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
import axios from "axios";
import Select from "react-select";

interface RegisterState {
  username: string;
  email: any;
  password: any;
  isFormSUbmitted: null | boolean;
  type: string;
}

class Register extends React.Component<{}, RegisterState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      isFormSUbmitted: null,
      type: ""
    };
  }

  handleSubmit = (event: any) => {
    event.preventDefault();
    if (
      this.state.username === "" ||
      this.state.email === "" ||
      this.state.password === "" ||
      this.state.type === ""
    ) {
      alert("Empty field!");
    } else {
      const checkUsername = this.state.username;
      const regex = RegExp("^[a-zA-Z0-9_.-]*$");
      if (!regex.test(checkUsername)) {
        alert("Invalid username!");
      } else {
        const formData = {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          type: this.state.type
        };

        axios
          .post(
            process.env.REACT_APP_BASE_API_URL + "/users/registration",
            formData,
            {
              headers: {}
            }
          )
          .then(response => {
            this.setState({
              isFormSUbmitted: true,
              username: "",
              email: "",
              password: ""
            });
            window.scrollTo(0, 0);
          })
          .catch(error => {
            if (error.response) {
              this.setState({ isFormSUbmitted: false });
              window.scrollTo(0, 0);
            }
          });
      }
    }
  };

  /** sets the value of field element in state
   * @param {any} event - the onchange input event
   */
  private onChangeHandler = (event: any) => {
    this.setState({ type: event.value || "" });
  };

  render() {
    const isFormSubmitted = this.state.isFormSUbmitted;
    const options = [
      { value: "admin", label: "Admin" },
      { value: "operator", label: "Operator" }
    ];
    let selectedValue: any;
    selectedValue = this.state.type;
    if (selectedValue !== "") {
      if (selectedValue === "admin") {
        selectedValue = { value: "admin", label: "Admin" };
      } else {
        selectedValue = { value: "operator", label: "Operator" };
      }
    }

    return (
      <Row style={{ marginBottom: "150px" }}>
        <Col
          sm={{ size: 6, order: 2, offset: 1 }}
          className="LoginFormFieldBody"
        >
          <br></br>
          {isFormSubmitted !== null &&
            (isFormSubmitted === true ? (
              <Alert color="success">
                Registration Successful. Login to continue.
              </Alert>
            ) : (
              <Alert color="danger">
                Duplicate Username or An Error Occured!.
              </Alert>
            ))}
          <h1>Registration</h1>
          <hr></hr>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="exampleusername">Username</Label>
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
              <Label for="examplePassword">Register As: </Label>
              <Select
                multi={false}
                name={"reg-as"}
                options={options}
                value={selectedValue || ""}
                onChange={this.onChangeHandler}
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="example@abc.com"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder=""
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
              />
            </FormGroup>
            <Button type="submit">Submit</Button>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default Register;
