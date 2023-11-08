import path from 'path';
import fs from 'fs';

export default function webpSupport(req, res, next) {
  try {
    const { accept } = req.headers;
    if (accept.includes('image/webp') && ['.png', '.jpg', '.jpeg'].includes(path.extname(req.path))) {
      const root = path.resolve('public');
      if (fs.existsSync(path.join(root, `${req.path}.webp`))) {
        req.url = `${req.path}.webp`;
      }
    }
    next();
  } catch (e) {
    next(e);
  }
}
