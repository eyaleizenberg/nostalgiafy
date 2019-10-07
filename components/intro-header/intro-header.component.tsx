import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Gramophone from "../logo/gramophone.svg";

export class IntroHeader extends React.PureComponent {
  render() {
    return (
      <>
        <Navbar collapseOnSelect expand="sm">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={Gramophone}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            <span className="brand-name">
              Nostalgiafy
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav>
              <Nav.Item>
                <Nav.Link href="#features">Features</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#about">About Me</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <style jsx>{`
          .brand-name {
            color: #ffc640;
            font-family: "Lobster", cursive;
            margin-left: 10px;
          }
        `}</style>
      </>
    );
  }
}
