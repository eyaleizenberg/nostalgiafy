import * as React from "react";
import { NextPageContext } from "next";
import { checkLogin } from "../utilities/check-login";
import { getAlbums } from "../utilities/albums-service/albums-service";
import { getSavedAlbums } from "../utilities/localstorage";
import { AlbumsDataSet, Album } from "../types";
import Container from "react-bootstrap/Container";
import { Albums } from "../components/albums/albums.component";
import { getTodaysAlbums } from "../utilities/album-utils/album-utils";
/* import { generateTodayKey } from "../utilities/date-utils/date-utils"; */

interface State {
  albumsDataSet: AlbumsDataSet;
  todaysAlbums: Album[];
}

export default class AlbumsPage extends React.PureComponent<null, State> {
  readonly currentDateKey: string = "01-22"; // generateTodayKey();
  readonly state = {
    albumsDataSet: { byDate: {}, albumsInfo: {} } as AlbumsDataSet,
    todaysAlbums: []
  };

  static getInitialProps = async (context: NextPageContext) => {
    await checkLogin(context);
    return {};
  };

  componentDidMount() {
    const cachedAlbumsDataSet = getSavedAlbums();
    this.setState(
      {
        albumsDataSet: cachedAlbumsDataSet,
        todaysAlbums: getTodaysAlbums(cachedAlbumsDataSet, this.currentDateKey)
      },
      async () => {
        const albumsDataSet = await getAlbums(cachedAlbumsDataSet);
        this.setState({
          albumsDataSet,
          todaysAlbums: getTodaysAlbums(albumsDataSet, this.currentDateKey)
        });
      }
    );
  }

  render() {
    const { todaysAlbums } = this.state;
    return (
      <Container>
        <h1>Albums</h1>
        {!!todaysAlbums.length && <Albums albums={todaysAlbums} />}
      </Container>
    );
  }
}
