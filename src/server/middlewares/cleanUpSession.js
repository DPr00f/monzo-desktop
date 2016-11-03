export default (req, res, next) => {
  if (req.session.redirectUrl) {
    delete req.session.redirectUrl;
  }
  next();
};
