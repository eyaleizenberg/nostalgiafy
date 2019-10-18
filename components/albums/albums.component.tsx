import * as React from "react";
import Row from "react-bootstrap/Row";
import { Album } from "../../types";
import { AlbumCard } from "../album-card/album-card.component";

export interface AlbumsProps {
  albums: Album[];
}

export class Albums extends React.PureComponent<AlbumsProps> {
  private currentYear: number = new Date().getFullYear();

  render() {
    return (
      <Row>
        {this.props.albums.map(album => (
          <AlbumCard key={album.id} {...album} currentYear={this.currentYear} />
        ))}
      </Row>
    );
  }
}
