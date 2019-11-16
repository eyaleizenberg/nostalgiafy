import * as React from "react";
import { NextPageContext } from "next";
import { checkLogin } from "../utilities/check-login";
import { getAlbums } from "../services/albums-service/albums-service";
import { getSavedAlbums } from "../utilities/localstorage";
import { AlbumsDataSet, Album } from "../types";
import Container from "react-bootstrap/Container";
import { Albums } from "../components/albums/albums.component";
import { getTodaysAlbums } from "../utilities/album-utils/album-utils";
import { generateTodayKey } from "../utilities/date-utils/date-utils";
import { Header } from "../components/header/header.component";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import { Spinner } from "../components/spinner/spinner.component";

interface State {
  albumsDataSet: AlbumsDataSet;
  todaysAlbums: Album[];
  showSpinner: boolean;
}

interface AlbumsProps {
  profilePic: string;
  displayName: string;
}

export default class AlbumsPage extends React.PureComponent<
  AlbumsProps,
  State
> {
  readonly currentDateKey: string = generateTodayKey();
  readonly state = {
    albumsDataSet: { byDate: {}, albumsInfo: {} } as AlbumsDataSet,
    todaysAlbums: [],
    showSpinner: true
  };

  static getInitialProps = async (context: NextPageContext) => {
    const res = await checkLogin(context);
    return { ...res };
  };

  componentDidMount() {
    const cachedAlbumsDataSet = getSavedAlbums();
    const showSpinner = !Object.keys(cachedAlbumsDataSet.albumsInfo).length;

    this.setState(
      {
        albumsDataSet: cachedAlbumsDataSet,
        todaysAlbums: getTodaysAlbums(cachedAlbumsDataSet, this.currentDateKey),
        showSpinner
      },
      async () => {
        const albumsDataSet = await getAlbums(cachedAlbumsDataSet);
        this.setState({
          albumsDataSet,
          todaysAlbums: getTodaysAlbums(albumsDataSet, this.currentDateKey),
          showSpinner: false
        });
      }
    );
  }

  renderNav() {
    return (
      <>
        <img src={this.props.profilePic} className="avatar" />
        <Link href="/logout">
          <Button variant="warning" size="sm">
            Logout
          </Button>
        </Link>
        <style jsx>{`
          .avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
          }
        `}</style>
      </>
    );
  }

  renderSavedAlbums() {
    const { todaysAlbums } = this.state;
    return (
      <>
        <h1>Your Saved Albums</h1>
        {!!todaysAlbums.length && <Albums albums={todaysAlbums} />}
        <style jsx>{`
          h1 {
            text-align: center;
            margin: 15px 0;
          }
        `}</style>
      </>
    );
  }

  render() {
    const { showSpinner } = this.state;
    return (
      <>
        <Header navbarProps={{ expand: undefined }}>{this.renderNav()}</Header>
        <Container>
          {showSpinner ? <Spinner /> : this.renderSavedAlbums()}
        </Container>
      </>
    );
  }
}
