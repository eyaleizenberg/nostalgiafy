import Router from "next/router";
import fetch from "isomorphic-unfetch";
import { NextPageContext } from "next";
import { baseUrl } from "./base-url/base-url";

export const checkLogin = async ({ req, res }: NextPageContext) => {
  const opts = {} as any;

  if (req) {
    opts.headers = { cookie: req.headers.cookie };
  }

  const response = await fetch(`${baseUrl}/api/check-login`, opts);
  if (response.status === 403) {
    if (res) {
      res.writeHead(302, { Location: "/" });
      res.end();
    } else {
      Router.replace("/");
    }
  }

  return response.json();
};
