import * as React from "react";
import {IntroHeader} from "../components/intro-header/intro-header.component";

const Index = () => {
  return (
    <>
      <main>
        <IntroHeader />
        <div className="splashImage" />
        {/* <section> */}
        {/*   <Link href="/about"> */}
        {/*     <a>Go to About Me</a> */}
        {/*   </Link> */}
        {/*   <br /> */}
        {/*   <Link href="/api/login"> */}
        {/*     <Button variant="primary">Primary</Button> */}
        {/*   </Link> */}
        {/*   <br /> */}
        {/*   <Link href="/albums"> */}
        {/*     <a>albums</a> */}
        {/*   </Link> */}
        {/*   <span>{text}</span> */}
        {/* </section> */}
        <style jsx>{`
        .splashImage {
            background-image: url('/static/record-player.jpg');
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            background-attachment: scroll;
            height: 400px;
        }
        @media (min-width: 768px) {
          .splashImage {
            height: 800px;
          }
        }
        `}
        </style>
      </main>

    </>
  );
};

export default Index;
