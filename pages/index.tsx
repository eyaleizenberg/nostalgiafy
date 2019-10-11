import * as React from "react";
import { IntroHeader } from "../components/intro-header/intro-header.component";
import { Welcome } from "../components/welcome/welcome.component";
import { Info } from "../components/info/info.component";

export default class Index extends React.PureComponent {
  render() {
    return (
      <main id="top">
        <IntroHeader />
        <Welcome />
        <Info />
      </main>
    );
  }
}
