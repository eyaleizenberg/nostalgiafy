import * as React from "react";
import Container from "react-bootstrap/Container";
import { Features } from "../features/features.component";
import { AboutMe } from "../about-me/about-me.component";

export class Info extends React.PureComponent {
  handleBackToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.querySelector("#top");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }

    event.preventDefault();
  };

  render() {
    return (
      <Container>
        <div id="what-is" className="description">
          <h1>What is Nostalgiafy?</h1>
        </div>
        <p className="lead">
          Nostalgiafy is a free open source web application which connects to
          your Spotify account and shows you which of your saved albums was
          released today - but a few years ago.
        </p>
        <div id="features" className="description">
          <h1>Features</h1>
        </div>
        <Features />
        <div id="about" className="description">
          <h1>About Me</h1>
        </div>
        <AboutMe />
        <div className="description">
          <a href="#top" onClick={this.handleBackToTop}>
            <h5>Back to top</h5>
          </a>
        </div>
        <style jsx>
          {`
            .description {
              text-align: center;
              padding-top: 40px;
            }
            h4 {
              margin-top: 20px;
            }
            h5 {
              margin-bottom: 20px;
            }
          `}
        </style>
      </Container>
    );
  }
}
