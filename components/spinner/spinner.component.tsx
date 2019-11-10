import * as React from "react";
import Gramophone from "../header/gramophone.svg";

export const Spinner = () => (
  <div className="container">
    <div className="gramophone-container">
      <img src={Gramophone} className="gramophone" />
    </div>
    <style jsx>{`
      @keyframes spin {
        0% {
          transform: rotate(0deg);
          left: 300px;
        }
        100% {
          transform: rotate(360deg);
          left: 300px;
        }
      }

      .gramophone-container {
        animation: spin 1.3s linear infinite;
        width: 4.06rem;
        border-radius: 50%;
        box-shadow: 0px 0px 0px 6px #000, 0px 0px 0px 7px #252424,
          0px 0px 0px 8px #000, 0px 0px 0px 9px #313030, 0px 0px 0px 10px #000,
          0px 0px 0px 11px #3a3838, 0px 0px 0px 12px #000,
          0px 0px 0px 13px #2b2a2a, 0px 0px 0px 14px #000,
          0px 0px 0px 15px #313030, 0px 0px 0px 16px #000,
          0px 0px 0px 17px #252424, 0px 0px 0px 18px #000,
          0px 0px 0px 19px #313030, 0px 0px 0px 20px #000,
          0px 0px 0px 21px #3a3838, 0px 0px 0px 22px #000,
          0px 0px 0px 23px #2b2a2a, 0px 0px 0px 24px #000,
          0px 0px 0px 25px #313030, 0px 0px 0px 26px #000,
          0px 0px 0px 27px #313030, 0px 0px 0px 28px #000,
          0px 0px 0px 29px #333333, 0px 0px 0px 30px #000,
          0px 0px 0px 31px #333232, 0px 0px 0px 32px #000,
          0px 0px 0px 33px #4c4a4a, 0px 0px 0px 34px #000,
          0px 0px 0px 35px #2f2e2e, 0px 0px 0px 36px #000,
          0px 0px 0px 37px #252424, 0px 0px 0px 38px #000,
          0px 0px 0px 39px #2f2e2e, 0px 0px 0px 40px #000,
          0px 0px 0px 41px #2f2e2e, 0px 0px 0px 42px #000,
          0px 0px 0px 55px #2f2e2e, 0px 0px 0px 56px #000,
          0px 0px 0px 57px #2f2e2e, 0px 0px 0px 58px #cecece;
      }

      .gramophone-container:before {
        content: "";
        position: absolute;
        width: 6px;
        height: 6px;
        background: #eeeeee;
        top: calc(50% - 3px);
        left: calc(50% - 3px);
        border-radius: 50%;
      }

      .gramophone {
        height: 4rem;
        width: 4rem;
      }

      .container {
        height: 80vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </div>
);
