import * as React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SocialIcons } from "../social-icons/social-icons.component";

export const AboutMe = () => (
  <Row className="justify-content-md-center">
    <Col md="auto" lg={4} className="about-me-container">
      <img
        src="https://s.gravatar.com/avatar/e1cd9e80343c7e97de31ad2fd3731b23?s=800"
        className="avatar"
      />
      <p className="lead">
        My name is Eyal Eizenberg. I am an engineering team leader at Wix. I
        love music and web development and thought this could be a fun project
        that others might like to use as well.
      </p>
      <p className="lead">
        Feel free to contact/follow me on the following platforms:
      </p>
      <SocialIcons />
    </Col>
    <style jsx>{`
      :global(.about-me-container) {
        text-align: center;
      }
      .avatar {
        border-radius: 50%;
        width: 90px;
        height: 90px;
        margin: 2px 0 10px 0;
      }
      @media (min-width: 576px) {
        .avatar {
          width: 110px;
          height: 110px;
        }
      }
    `}</style>
  </Row>
);
