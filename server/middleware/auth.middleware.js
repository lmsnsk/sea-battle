module.exports = (req, res, next) => {
  if (req.session && req.session.player) {
    return next()
  } else {
    return res.status(401).
      json({ error: 'Unauthorized: Invalid username or password' })
  }
}