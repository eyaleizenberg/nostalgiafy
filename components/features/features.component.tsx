import * as React from "react";
import InLove from "./in-love.svg";
import Github from "./github.svg";
import Zeit from "./zeit-black-triangle.svg";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PaypalButton } from "../feature-buttons/paypal-button.component";
import { GithubButton } from "../feature-buttons/github-button.component";
import { ZeitButton } from "../feature-buttons/zeit-button.component";

const allFeatures: Feature[] = [
  {
    icon: InLove,
    title: "It's Free!",
    description:
      "This is a fun project I did and I am not looking to make any money from it. If you like it, you can donate to help support the running costs.",
    Button: PaypalButton
  },
  {
    icon: Github,
    title: "Open Source",
    description:
      "The entire project is completely open source so others can learn from it, contribute to it, or just feel safer that you know what's going on.",
    Button: GithubButton
  },
  {
    icon: Zeit,
    title: "Built on Zeit",
    description:
      "The entire project is built using Zeit Next.js and the Now serverless platform.",
    Button: ZeitButton
  }
];

interface Feature {
  icon: string;
  title: string;
  description: string;
  Button: React.ComponentClass | React.FunctionComponent;
}

export class Features extends React.PureComponent {
  renderFeature({ title, description, icon, Button }: Feature, key: number) {
    return (
      <Col key={key} lg={4} className="feature-container">
        <div className="icon-container">
          <img src={icon} />
        </div>
        <div className="text-container">
          <h3>{title}</h3>
          <p className="lead">{description}</p>
        </div>
        <div className="button-container">
          <Button />
        </div>
        <style jsx>
          {`
            .icon-container {
              background-color: #f39c12;
              border-radius: 50%;
              padding: 20px;
              width: 90px;
              height: 90px;
              margin: 0 auto;
            }
            h3 {
              margin: 10px 0;
            }
            :global(.feature-container) {
              margin-bottom: 3rem;
            }
            .button-container {
              display: flex;
              justify-content: center;
            }
            img {
              height: 50px;
              width: 50px;
            }
            .text-container {
              text-align: center;
            }
            @media (min-width: 576px) {
              .icon-container {
                width: 110px;
                height: 110px;
              }
              img {
                height: 70px;
                width: 70px;
              }
            }
          `}
        </style>
      </Col>
    );
  }

  render() {
    return (
      <Row>
        {allFeatures.map((feature, index) =>
          this.renderFeature(feature, index)
        )}
      </Row>
    );
  }
}
