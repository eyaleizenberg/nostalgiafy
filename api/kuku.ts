import express, { Request, Response } from 'express';
import helmet from 'helmet';

const app = express();
app.use(helmet());

app.get('*', (req: Request, res: Response) => {
  console.log('Hello KUKU!', req.url)
  res.set('Content-Type', 'text/html');
  res.status(200).end('KUKU 098');
});

module.exports = app;

