import * as React from "react";
import {IntroHeader} from "../components/intro-header/intro-header.component";
import {Welcome} from '../components/welcome/welcome.component';

export default class Index extends React.PureComponent {
  render() {
    return (
      <>
        <main>
          <IntroHeader />
          <Welcome />
        </main>
      </>
    );
  }
};

