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

  readonly summaryRef = React.createRef<HTMLDivElement>();

  async componentDidMount() {
    const { artist, name } = this.props;

    const searchResult = await wiki()
      .search(`${artist} - ${name}`)
      .then((data: any) => data.results[0]);

    if (searchResult) {
      const wikiSummary = await wiki()
        .page(searchResult)
        .then((page: any) => page.summary());
      this.setState({ wikiSummary });
    }
  }

  private generateAgoText(): string {
    const { releaseDate, currentYear } = this.props;
    const releaseYear: number = new Date(releaseDate).getFullYear();
    const diff: number = currentYear - releaseYear;

    if (diff > 1) {
      return `${diff} years ago`;
    }

    return "1 year ago";
  }

  handleClick = () => {
    if (this.state.wikiExpanded) {
      this.setState({ wikiExpanded: false, wikiSummaryHeight: 70 });
    } else if (this.summaryRef.current) {
      this.setState({
        wikiSummaryHeight: this.summaryRef.current.scrollHeight,
        wikiExpanded: true
      });
    }
  };

  renderWiki() {
    const { wikiExpanded, wikiSummary, wikiSummaryHeight } = this.state;
    if (!wikiSummary) {
      return null;
    }

    return (
      <>
        <div
          className={`summary-container ${
            wikiExpanded ? "expanded" : "collapsed"
          }`}
          style={{ height: wikiSummaryHeight }}
        >
          <div ref={this.summaryRef}>
            <Card.Text className="wiki-summary">{wikiSummary}</Card.Text>
          </div>
        </div>
        <style jsx>{`
          .summary-container {
            position: relative;
            overflow: hidden;
            margin-top: 15px;
            transition: height 300ms ease-in-out;
          }
          .summary-container.collapsed:after {
            content: "";
            text-align: right;
            position: absolute;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 50px;
            background: linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0),
              rgba(48, 48, 48, 1) 90%
            );
          }
          :global(.wiki-summary) {
          }
        `}</style>
      </>
    );
  }

  renderButtons() {
    const { wikiSummary, wikiExpanded } = this.state;

    return (
      <div className="buttons-container">
        {wikiSummary && (
          <Button variant="warning" onClick={this.handleClick}>
            {wikiExpanded ? "Collapse Wiki" : "Expand Wiki"}
          </Button>
        )}
        <a
          href={`https://open.spotify.com/album/${this.props.id}`}
          target="_blank"
        >
          <Button variant="success">Play On Spotify</Button>
        </a>
        <style jsx>{`
          .buttons-container {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }
        `}</style>
      </div>
    );
  }

  render() {
    const { artist, name, imageUrl } = this.props;

    return (
      <Col lg md className="album-card-container">
        <Card border="warning" style={{ width: "20rem" }}>
          <Card.Header>{this.generateAgoText()}</Card.Header>
          <Card.Img variant="top" src={imageUrl} />
          <Card.Body>
            <Card.Title>{artist}</Card.Title>
            <Card.Subtitle>{name}</Card.Subtitle>
            {this.renderWiki()}
            {this.renderButtons()}
          </Card.Body>
        </Card>
        <style jsx>{`
          :global(.album-card-container) {
            margin-bottom: 3rem;
          }
        `}</style>
      </Col>
    );
  }
}
