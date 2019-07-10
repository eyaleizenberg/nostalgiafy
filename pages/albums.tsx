import * as React from 'react';
import { NextContext } from 'next'
import { checkLogin } from '../utilities/check-login';
import { getAlbums } from '../utilities/api';

interface State {
  albums: any;
}

export default class Albums extends React.PureComponent<null, State> {
  readonly state = { albums: [] };

  static getInitialProps = async (context: NextContext) => {
    await checkLogin(context);
    return {};
  }

  async componentDidMount() {
    getAlbums();
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
