import jwt from "jsonwebtoken";

const currentUser = (req, res, next) => {
  let token;
  token = req.headers.token;
  if (!token) {
    token = req.session?.jwt;
  }
  try {
    if (!token) {
      return res.status(401).send({ error: [{ msg: `Não tem login` }] });
    }
    const payload = jwt.verify(token, process.env.SECRET);
    req.currentUser = payload;
  } catch (err) {
    console.log("erro user JWT ", err, " jwt ", req.session.jwt);
  }
  next();
};

export default currentUser;
