const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  const token = req.headers.authorization;
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
 try {
    const decoded = jwt.verify(token, "masai");
     console.log("Decode",decoded)
    const userId = decoded._id;
    console.log("userId",userId)
    req.user = {
      userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = {
  authenticateUser,
};
