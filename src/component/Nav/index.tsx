import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import Cookies from "universal-cookie";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { NavLink as RRNavLink } from "react-router-dom";
import Register from "../Register";
import Login from "../Login";
import Logout from "../Logout";
import Home from "../Home";
import Machine from "../Machine";
import AssignMachine from "../AssignMachine";
import AssignList from "../AssignList";
import OperatorList from "../OperatorList";
import { connect } from "react-redux";
import { Store } from "redux";
import {
  getHasTokenStatus,
  setHasTokenStatusAction
} from "../../store/ducks/jwtInfoState";

interface NavProps {
  setHasTokenStatusActionCreator: typeof setHasTokenStatusAction;
  hasToken: boolean;
}

interface NavBarState {
  isOpen: boolean;
}

class NavBar extends React.Component<NavProps, NavBarState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  public componentDidMount() {
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");

    if (
      access_token === "" ||
      access_token === null ||
      access_token === undefined
    ) {
      this.props.setHasTokenStatusActionCreator(false);
    } else {
      this.props.setHasTokenStatusActionCreator(true);
    }
  }

  render() {
    const cookies = new Cookies();
    const user_type = cookies.get("user_type");
    if (this.props.hasToken === true) {
      if (user_type === "admin") {
        return (
          <Router>
            <Navbar
              color="dark"
              dark
              className="justify-content-between"
              expand="md"
            >
              <NavbarBrand href="/the-machine-assign-app-test/#/home">
                The Machine Assign App
              </NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <NavLink
                      to="/machines"
                      activeClassName="active"
                      tag={RRNavLink}
                    >
                      Machines
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      to="/assign"
                      activeClassName="active"
                      tag={RRNavLink}
                    >
                      Assign Machines
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      to="/assign-list"
                      activeClassName="active"
                      tag={RRNavLink}
                    >
                      Assign List
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      to="/logout"
                      activeClassName="active"
                      tag={RRNavLink}
                    >
                      Logout
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Navbar>
            <Switch>
              {/* Forward Public Routes to the Home Page */}
              <Route exact path="/login" component={Home} />
              <Route exact path="/operator-list" component={Home} />

              <Route exact path="/assign" component={AssignMachine} />
              <Route exact path="/assign-list" component={AssignList} />
              <Route exact path="/machines" component={Machine} />
              <Route exact path="/logout" component={Logout} />
              <Route exact path="/home" component={Home} />
            </Switch>
          </Router>
        );
      } else {
        return (
          <Router>
            <Navbar
              color="dark"
              dark
              className="justify-content-between"
              expand="md"
            >
              <NavbarBrand href="/the-machine-assign-app-test/#/home">
                The Machine Assign App
              </NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <NavLink
                      to="/operator-list"
                      activeClassName="active"
                      tag={RRNavLink}
                    >
                      Operator List
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      to="/logout"
                      activeClassName="active"
                      tag={RRNavLink}
                    >
                      Logout
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Navbar>
            <Switch>
              {/* Forward Public Routes to the Home Page */}
              <Route exact path="/login" component={Home} />

              {/* Forward Private Routes to the Home Page */}
              <Route exact path="/assign" component={Home} />
              <Route exact path="/assign-list" component={Home} />
              <Route exact path="/machines" component={Home} />

              <Route exact path="/operator-list" component={OperatorList} />
              <Route exact path="/logout" component={Logout} />
              <Route exact path="/home" component={Home} />
            </Switch>
          </Router>
        );
      }
    } else {
      return (
        <Router>
          <Navbar
            color="dark"
            className="justify-content-between"
            dark
            expand="md"
          >
            <NavbarBrand href="/the-machine-assign-app-test/#/home">
              The Machine Assign App
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink to="/login" activeClassName="active" tag={RRNavLink}>
                    Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="/register"
                    activeClassName="active"
                    tag={RRNavLink}
                  >
                    Register
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
          <Switch>
            {/* Forward Private Routes to the Home Page */}
            <Route exact path="/products" component={Home} />
            <Route exact path="/assign" component={Home} />
            <Route exact path="/assign-list" component={Home} />
            <Route exact path="/operator-list" component={Home} />
            <Route exact path="/machines" component={Home} />

            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/home" component={Home} />
          </Switch>
        </Router>
      );
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
const ConnectedNavBar = connect(mapStateToProps, mapDispatchToProps)(NavBar);

export default ConnectedNavBar;
