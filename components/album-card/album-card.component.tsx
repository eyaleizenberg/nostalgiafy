import * as React from "react";
import { Album } from "../../types";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import wiki from "wikijs";

export interface AlbumCardProps extends Album {
  currentYear: number;
}

export interface AlbumCardState {
  wikiSummary: string;
  wikiExpanded: boolean;
  wikiSummaryHeight: number;
}

export class AlbumCard extends React.PureComponent<
  AlbumCardProps,
  AlbumCardState
> {
  readonly state = {
    wikiSummary: "",
    wikiExpanded: false,
    wikiSummaryHeight: 70
  };

  async componentDidMount() {
    const { artist, name } = this.props;

    const searchResult = await wiki()
      .search(`${artist} - ${name}`)
      .then((data: any) => data.results[0]);

    if (searchResult) {
      const wikiSummary = await wiki({
        apiUrl: "https://en.wikipedia.org/w/api.php"
      })
        .page(searchResult)
        .then((page: any) => page.summary());
      this.setState({ wikiSummary });
    }
  }

  private headerText(): string {
    const { releaseDate, currentYear } = this.props;
    const releaseYear: number = new Date(releaseDate).getFullYear();
    const diff: number = currentYear - releaseYear;

    if (diff > 1) {
      return `${diff} years ago`;
    }

    return "1 year ago";
  }

  handleClick = () => {
    this.setState({ wikiExpanded: !this.state.wikiExpanded });
  };

  renderWiki() {
    const { wikiSummary, wikiExpanded } = this.state;
    return (
      <Card.Body className={`card-body-wiki ${wikiExpanded ? "expanded" : ""}`}>
        <Card.Text className="wiki-summary">{wikiSummary}</Card.Text>
        <style jsx>{`
          :global(.card-body-wiki) {
            height: 318px;
            overflow: scroll;
            transition: opacity 150ms ease-in-out;
            opacity: 0;
            z-index: 10;
          }
          :global(.card-body-wiki.expanded) {
            transition: opacity 300ms ease-in-out 150ms;
            opacity: 1;
          }
        `}</style>
      </Card.Body>
    );
  }

  renderButtons() {
    const { wikiSummary, wikiExpanded } = this.state;

    return (
      <div className="buttons-container">
        <a
          href={`https://open.spotify.com/album/${this.props.id}`}
          target="_blank"
        >
          <Button variant="success">Play On Spotify</Button>
        </a>
        {wikiSummary && (
          <Button variant="warning" onClick={this.handleClick}>
            {wikiExpanded ? "Collapse Wiki" : "Expand Wiki"}
          </Button>
        )}
        <style jsx>{`
          .buttons-container {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
        `}</style>
      </div>
    );
  }

  renderAlbumTitle() {
    const { artist, name } = this.props;

    return (
      <Card.Body
        style={{ opacity: this.state.wikiExpanded ? 0.5 : 1 }}
        className="album-card-name"
      >
        <Card.Title>{artist}</Card.Title>
        <Card.Subtitle style={{ fontStyle: "italic" }}>{name}</Card.Subtitle>
        <style jsx>{`
          :global(.album-card-name) {
            transition: opacity 300ms ease-in-out;
          }
        `}</style>
      </Card.Body>
    );
  }

  render() {
    const { imageUrl } = this.props;
    const { wikiExpanded } = this.state;

    return (
      <Col lg md className="album-card-container">
        <Card border="warning" className={"album-card"}>
          <Card.Header
            style={{ opacity: wikiExpanded ? 0.5 : 1 }}
            className="album-card-header"
          >
            {this.headerText()}
          </Card.Header>
          <Card.Img
            variant="top"
            src={imageUrl}
            style={{
              opacity: wikiExpanded ? 0.03 : 1,
              transform: `scaleX(${wikiExpanded ? -1 : 1}`
            }}
            className={"album-image"}
          />
          {this.renderWiki()}
          {this.renderAlbumTitle()}
          <Card.Body>{this.renderButtons()}</Card.Body>
        </Card>
        <style jsx>{`
          :global(.album-card-header) {
            transition: opacity 300ms ease-in-out;
          }
          :global(.album-image) {
            transition: opacity 300ms ease-in-out;
            position: absolute;
            top: 47px;
            transition: transform 300ms ease-in-out;
          }
          :global(.album-card-container) {
            margin-bottom: 3rem;
          }
          :global(.album-card) {
            width: 20rem;
            margin: 0 auto;
          }
        `}</style>
      </Col>
    );
  }
}
