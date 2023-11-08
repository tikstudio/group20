import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';

const EXCLUDE = [
  'POST:/users/login',
  'POST:/users/register',
];
const { JWT_SECRET } = process.env;

export default function authorization(req, res, next) {
  try {
    if (EXCLUDE.includes(`${req.method}:${req.path}`) || req.method === 'OPTIONS') {
      next();
      return;
    }
    const { authorization: token = '' } = req.headers;
    const { userId } = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    if (!userId) {
      throw HttpError(401);
    }
    req.userId = userId;
    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
}
