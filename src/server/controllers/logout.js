export default respond => (req, res, next) => {
  delete req.session.user;
  if (respond) {
    res.json({
      error: false,
      message: 'Logout successfully'
    });
  } else {
    next();
  }
};
