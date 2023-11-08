import express from 'express';
import path from 'path';
import HttpError from 'http-errors';
import morgan from 'morgan';
import indexRouter from './routes';
import errorHandler from './middlewares/errorHandler';
import cors from './middlewares/cors';
import webpSupport from './middlewares/webpSupport';
import Socket from './services/Socket';
import authorization from './middlewares/authorization';

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

const ser = app.listen(4000, () => {
  console.log('server started ...');
});

Socket.init(ser);
