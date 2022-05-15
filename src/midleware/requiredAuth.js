const requiredAuth = (req, res, next) => {
  if (!req.currentUser) {
    res.status(401).send("Not authorized");
  }
  next();
};

export default requiredAuth;

