import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Gramophone from "./gramophone.svg";
import { baseUrl } from "../../utilities/base-url/base-url";

export class IntroHeader extends React.PureComponent {
  handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = (event.target as HTMLAnchorElement).href.replace(
      `${baseUrl}/`,
      ""
    );
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }

    event.preventDefault();
  };

  renderLinks() {
    return [
      { href: "#what-is", text: "What is it?" },
      { href: "#features", text: "Features" },
      { href: "#about", text: "About Me" }
    ].map(({ href, text }, index) => (
      <Nav.Item key={index}>
        <Nav.Link href={href} onClick={this.handleClick}>
          {text}
        </Nav.Link>
      </Nav.Item>
    ));
  }

  render() {
    return (
      <Navbar collapseOnSelect expand="sm">
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
          <Nav>{this.renderLinks()}</Nav>
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
