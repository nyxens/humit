module.exports = function requireAuth(req, res, next) {
  if (req.session.userId) return next();
  //API testing — Bearer token: "API_TEST_SECRET:userId"
  const auth = req.headers["authorization"] || "";
  if (auth.startsWith("Bearer ") && process.env.API_TEST_SECRET) {
    const token = auth.slice(7); // remove "Bearer "
    const colonIdx = token.indexOf(":");
    const secret = token.slice(0, colonIdx);
    const userId = token.slice(colonIdx + 1);
    if (secret === process.env.API_TEST_SECRET && userId) {
      req.session.userId = userId;
      return next();
    }
  }
  return res.status(401).json({ error: "Login required" });
};