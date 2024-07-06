const jwt = require("jsonwebtoken");
const jwtSecret = require('../jwtSecret');

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ error: "please 1 authenticate using a valid token" });
  }
  try {
    const { user } = jwt.verify(token, jwtSecret);
    req.user = user;
    next();
  } catch (error) {

    return res
      .status(401)
      .json({ error: "please 2 authenticate using a valid token" });
  }
};

module.exports = fetchUser;
