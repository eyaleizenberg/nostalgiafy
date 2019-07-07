import * as React from 'react';
import fetch from "isomorphic-unfetch";
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
        <Link href="/login">
          <a>Log me in baby!</a>
        </Link>
        <span>{text}</span>
      </section>
    </main>
  );
}

Index.getInitialProps = async () => {
  const result = await fetch('http://localhost:3000/api/kuku.ts');
  return {
    text: await result.text()
  }
}

export default Index;
