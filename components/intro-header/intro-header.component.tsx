import * as React from "react";
import Nav from "react-bootstrap/Nav";
import { baseUrl } from "../../utilities/base-url/base-url";
import { Header } from "../header/header.component";

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
      <Header>
        <>{this.renderLinks()}</>
      </Header>
    );
  }
}
