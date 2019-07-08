import * as React from 'react';
import Link from "next/link";
import Header from "../components/header";

const Index = ({ text }: { text: string }) => {
  return (
    <main>
      <Header />
      <section>
        <Link href="/about">
          <a>Go to About Me</a>
        </Link>
        <br />
        <Link href="/api/login">
          <a>Log me in baby!</a>
        </Link>
        <br />
        <Link href="/albums">
          <a>albums</a>
        </Link>
        <span>{text}</span>
      </section>
    </main>
  );
}

export default Index;
