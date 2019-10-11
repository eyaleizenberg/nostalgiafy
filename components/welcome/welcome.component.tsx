import * as React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Link from "next/link";

export interface State {
  buttonClicked: boolean;
}

export class Welcome extends React.PureComponent<{}, State> {
  readonly state = { buttonClicked: false };

  handleButtonClicked = () => {
    this.setState({ buttonClicked: true });
  };

  render() {
    const { buttonClicked } = this.state;
    return (
      <div className="splash-image">
        <Container>
          <div className="header-text">
            <div className="welcome-text">
              <span>{`Welcome to `}</span>
              <span className="brand-name">Nostalgiafy!</span>
            </div>
            <div className="login-container">
              <Link href="/api/login">
                <Button
                  variant="warning"
                  disabled={buttonClicked}
                  onClick={this.handleButtonClicked}
                >
                  Log In
                </Button>
              </Link>
              <span className="scroll-text">
                Or scroll down to learn more...
              </span>
            </div>
          </div>
        </Container>
        <style jsx>
          {`
            .login-container {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 80px;
            }
            .welcome-text {
              font-size: 30px;
            }
            .header-text {
              text-align: center;
              padding-top: 120px;
            }
            .scroll-text {
              font-size: 20px;
              margin-left: 10px;
            }
            .splash-image {
              background-image: url("/static/record-dark.jpg");
              background-size: cover;
              background-position: center center;
              background-repeat: no-repeat;
              background-attachment: scroll;
              height: 400px;
            }
            .brand-name {
              color: #f39c12;
              font-family: "Lobster", cursive;
            }
            @media (min-width: 576px) {
              .welcome-text {
                font-size: 45px;
              }
              .header-text {
                padding-top: 100px;
              }
              .login-container {
                margin-top: 90px;
              }
              .scroll-text {
                font-size: 25px;
              }
            }
            @media (min-width: 768px) {
              .login-container :global(.btn) {
                padding: 0.5rem 1rem;
                font-size: 1.171875rem;
                line-height: 1.5;
                border-radius: 0.3rem;
              }
              .splash-image {
                height: 800px;
              }
              .welcome-text {
                font-size: 60px;
              }
              .login-container {
                margin-top: 180px;
              }
              .header-text {
                padding-top: 250px;
              }
            }
          `}
        </style>
      </div>
    );
  }
}
