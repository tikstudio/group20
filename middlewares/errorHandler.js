// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  // if (req.file && req.file.path) {
  //   fsp.unlink(req.file.path).catch(console.error)
  // }
  res.json({
    status: 'error',
    message: err.message,
    errors: err.errors,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });
}
