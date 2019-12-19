import express from "express";
import helmet from "helmet";
import { commonMiddlewares } from "../middlewares";
import bodyParser from "body-parser";
const expressApp = express();
expressApp.use(helmet());
expressApp.set("trust proxy", 1);
expressApp.use(...commonMiddlewares);
expressApp.use(bodyParser.json({ limit: '50mb' }));

export const app = expressApp;
