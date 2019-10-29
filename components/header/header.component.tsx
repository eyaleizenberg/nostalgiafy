import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Gramophone from "./gramophone.svg";

interface HeaderProps {
  children: JSX.Element;
  navbarProps?: any;
}

export class Header extends React.PureComponent<HeaderProps> {
  render() {
    return (
      <Navbar
        collapseOnSelect
        expand="sm"
        variant="dark"
        style={{ backgroundColor: "#303030" }}
        {...this.props.navbarProps}
      >
        <Navbar.Brand href="#home">
          <img
            alt=""
            src={Gramophone}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          <span className="brand-name">Nostalgiafy</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto"></Nav>
          <Nav>{this.props.children}</Nav>
        </Navbar.Collapse>
        <style jsx>{`
          .brand-name {
            color: #f39c12;
            font-family: "Lobster", cursive;
            margin-left: 10px;
          }
        `}</style>
      </Navbar>
    );
  }
}

