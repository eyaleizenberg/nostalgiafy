import * as React from "react";
import { NextPageContext } from "next";
import { checkLogin } from "../utilities/check-login";
import { getUserAlbums } from "../services/user-albums/user-albums";
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
import {
  setSocialAlbums,
  fetchSocialAlbums
} from "../services/social-albums/social-albums";

interface State {
  albumsDataSet: AlbumsDataSet;
  todaysAlbums: Album[];
  socialAlbums: Album[];
  showSpinner: boolean;
  loggingOut: boolean;
}

interface AlbumsProps {
  profilePic: string;
  displayName: string;
}

export default class AlbumsPage extends React.PureComponent<
  AlbumsProps,
  State
> {
  private currentDateKey: string = "";

  readonly state = {
    albumsDataSet: { byDate: {}, albumsInfo: {} } as AlbumsDataSet,
    todaysAlbums: [],
    socialAlbums: [],
    showSpinner: true,
    loggingOut: false
  };

  static getInitialProps = async (context: NextPageContext) => {
    const res = await checkLogin(context);
    return { ...res };
  };

  componentDidMount() {
    this.currentDateKey = new URL(window.location.href).searchParams.get(
      "debug"
    )
      ? "08-30"
      : generateTodayKey();

    const cachedAlbumsDataSet = getSavedAlbums();
    const showSpinner = !Object.keys(cachedAlbumsDataSet.albumsInfo).length;

    this.setState(
      {
        albumsDataSet: cachedAlbumsDataSet,
        todaysAlbums: getTodaysAlbums(cachedAlbumsDataSet, this.currentDateKey),
        showSpinner
      },
      async () => {
        const [albumsDataSet, allSocialAlbums] = await Promise.all([
          getUserAlbums(cachedAlbumsDataSet),
          fetchSocialAlbums(this.currentDateKey)
        ]);

        const albums = Object.values(albumsDataSet.albumsInfo);

        if (albums.length) {
          setSocialAlbums(albums);
        }

        const todaysAlbums = getTodaysAlbums(
          albumsDataSet,
          this.currentDateKey
        );

        const socialAlbums = allSocialAlbums.filter(
          ({ id }) => !(id in albumsDataSet.albumsInfo)
        );

        this.setState({
          albumsDataSet,
          todaysAlbums,
          socialAlbums,
          showSpinner: false
        });
      }
    );
  }

  onLogoutClick = () => {
    this.setState({ loggingOut: true });
  };

  renderNav() {
    return (
      <>
        <img src={this.props.profilePic} className="avatar" />
        <Link href="/api/logout">
          <Button
            variant="warning"
            size="sm"
            onClick={this.onLogoutClick}
            disabled={this.state.loggingOut}
          >
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

  renderTodayAlbums() {
    const { todaysAlbums } = this.state;

    if (!todaysAlbums.length) {
      return null;
    }

    return (
      <>
        <h1>From Your Saved Albums</h1>
        <Albums albums={todaysAlbums} />
        <style jsx>{`
          h1 {
            text-align: center;
            margin: 15px 0;
          }
        `}</style>
      </>
    );
  }

  renderSocialAlbums() {
    const { socialAlbums } = this.state;

    if (!socialAlbums.length) {
      return null;
    }

    return (
      <>
        <h1>Other Albums You Might Like</h1>
        <Albums albums={socialAlbums} />
        <style jsx>{`
          h1 {
            text-align: center;
            margin: 25px 0;
          }
        `}</style>
      </>
    );
  }

  renderNothing() {
    const { socialAlbums, todaysAlbums } = this.state;
    if (socialAlbums.length || todaysAlbums.length) {
      return null;
    }

    return (
      <>
        <h2>Nothing to show today.</h2>
        <h2>Come back tomorrow.</h2>
        <style jsx>{`
          h2 {
            text-align: center;
            margin: 15px 0;
          }
        `}</style>
      </>
    );
  }

  renderSavedAlbums() {
    return (
      <>
        {this.renderTodayAlbums()}
        {this.renderSocialAlbums()}
        {this.renderNothing()}
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
