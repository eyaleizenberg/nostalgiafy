import { NowRequest, NowResponse } from "@now/node";

export default function handler(req: NowRequest, res: NowResponse) {
  console.log('Hello KUKU!', req.url)
  res.statusCode = 200;
  res.end('KUKU123')
}