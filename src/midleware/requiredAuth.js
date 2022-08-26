const requiredAuth = (req, res, next) => {
  if (!req.currentUser) {
    return res.status(401).send({ error: [{ msg: `Não tem login` }] });
  }
  next();
};

export default requiredAuth;
