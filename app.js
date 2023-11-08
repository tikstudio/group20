import express from 'express';
import path from 'path';
import HttpError from 'http-errors';
import morgan from 'morgan';
import indexRouter from './routes';
import errorHandler from './middlewares/errorHandler.js';
import cors from './middlewares/cors.js';
import webpSupport from './middlewares/webpSupport.js';
import Socket from './services/Socket.js';
import authorization from './middlewares/authorization.js';

process.env.TZ = 'UTC';

const app = express();

app.use(morgan('dev'));
app.use(cors);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(webpSupport);
app.use(express.static(path.resolve('public')));

app.use(authorization);

app.use(indexRouter);

app.use((req, res, next) => {
  next(HttpError(404));
});

app.use(errorHandler);

const server = app.listen(4000, () => {
  console.log('server started ...');
});

 Socket.init(server);
