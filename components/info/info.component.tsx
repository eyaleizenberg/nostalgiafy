import * as React from "react";
import Container from "react-bootstrap/Container";
import { Features } from "../features/features.component";

export class Info extends React.PureComponent {
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
        <style jsx>
          {`
            .description {
              text-align: center;
              padding-top: 40px;
            }
            h4 {
              margin-top: 20px;
            }
          `}
        </style>
      </Container>
    );
  }
}
