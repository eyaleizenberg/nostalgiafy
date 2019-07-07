import express from 'express';
import helmet from 'helmet';
import { commonMiddlewares } from '../middlewares'
const expressApp = express();
expressApp.use(helmet());
expressApp.set("trust proxy", 1);
expressApp.use(...commonMiddlewares);

export const app = expressApp;

