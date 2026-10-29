const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authorization = req.get('Authorization') || '';
  const match = authorization.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'Authentication token is required.' });
  }

  try {
    req.user = jwt.verify(match[1], process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

module.exports = authenticate;
