import * as React from 'react';
import Router from 'next/router';
import fetch from "isomorphic-unfetch";
import { NextContext } from 'next'

export default class Albums extends React.PureComponent {
  static getInitialProps = async ({ res, req }: NextContext) => {
    const opts = {} as any;
    if (req) {
      opts.headers = { cookie: req.headers.cookie };
    }
    const response = await fetch('http://localhost:3000/api/check-login', opts);
    if (response.status === 403) {
      if (res) {
        res.writeHead(302, { Location: '/' });
        res.end();
      }

      Router.replace('/');
    }

    return {};
  }

  render() {
    return (
      <main>
        <section>
          <h1>ALBUMS!</h1>
        </section>
      </main>
    );
  }
}
