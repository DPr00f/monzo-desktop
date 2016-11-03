export default (req, res) => {
  if (req.session.redirectUrl) {
    res.redirect(req.session.redirectUrl);
  } else {
    res.status(412).json({
      error: true,
      message: 'Unknown redirect page'
    });
  }
};
