import * as React from "react";
import { Component } from "react";
import Link from "next/link";

interface Props {
  isServer: boolean;
}

class AboutPage extends Component<Props> {
  static getInitialProps() {
    const isServer = typeof window === "undefined";
    return { isServer };
  }

  render() {
    return (
      <main>
        <section>
          <p>
            This is another page of the SSR example, you accessed it{" "}
            <strong>{this.props.isServer ? "server" : "client"} side</strong>.
          </p>
          <p>You can reload to see how the page change.</p>
          <Link href="/">
            <a>Go to Home</a>
          </Link>
        </section>
      </main>
    );
  }
}

export default AboutPage;

