import Router from "next/router";
import fetch from "isomorphic-unfetch";
import { NextPageContext } from "next";

export const checkLogin = async ({ req, res }: NextPageContext) => {
  const opts = {} as any;

  if (req) {
    opts.headers = { cookie: req.headers.cookie };
  }

  const response = await fetch("http://localhost:3000/api/check-login", opts);
  if (response.status === 403) {
    if (res) {
      res.writeHead(302, { Location: "/" });
      res.end();
    } else {
      Router.replace("/");
    }
  }
};
