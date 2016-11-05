export default (req, res, next) => {
  delete req.session.user;
  next();
};
