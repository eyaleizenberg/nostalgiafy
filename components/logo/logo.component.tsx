import * as React from "react";
import Gramophone from "./gramophone.svg";

export class Logo extends React.PureComponent {
  render() {
    return (
      <>
        <div>
          <img src={Gramophone} />
          <h1>Nostalgiafy</h1>
        </div>
        <style jsx>{`
          div {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          img {
            width: 15%;
          }

          h1 {
            color: #ffc640;
            font-family: "Lobster", cursive;
            margin-left: 12px;
          }
        `}</style>
      </>
    );
  }
}
