import * as React from "react";
import { NextPageContext } from "next";
import { checkLogin } from "../utilities/check-login";
import { getAlbums } from "../utilities/albums-service/albums-service";
import { getSavedAlbums } from "../utilities/localstorage";
import { AlbumsDataSet } from "../types";
import { generateTodayKey } from "../utilities/date-utils/date-utils";

interface State {
  albumsDataSet: AlbumsDataSet;
}

export default class Albums extends React.PureComponent<null, State> {
  readonly currentDateKey: string = generateTodayKey();
  readonly state = { albumsDataSet: { byDate: {}, albumsInfo: {} } as AlbumsDataSet };

  static getInitialProps = async (context: NextPageContext) => {
    await checkLogin(context);
    return {};
  };

  async componentDidMount() {
    const cachedAlbumsDataSet = getSavedAlbums();
    this.setState({ albumsDataSet: cachedAlbumsDataSet});
    const albumsDataSet = await getAlbums(cachedAlbumsDataSet);
    this.setState({ albumsDataSet });
  }

  renderTodayAlbums() {
    const {
      albumsDataSet: { byDate, albumsInfo }
    } = this.state;
    const albumsToday = byDate[this.currentDateKey];

    if (!albumsToday) {
      return <span>No albums today...</span>;
    }

    return Object.keys(albumsToday).map((albumId: string) => {
      const album = albumsInfo[albumId];
      return <span key={albumId}>{`${album.name}`}</span>;
    });
  }

  render() {
    return (
      <main>
        <section>
          <h1>ALBUMS!</h1>
          {this.renderTodayAlbums()}
        </section>
      </main>
    );
  }
}
