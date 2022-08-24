import jwt from "jsonwebtoken";

const currentUser = (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    token = req.session?.jwt;
  }
  try {
    const payload = jwt.verify(token, process.env.SECRET);
    req.currentUser = payload;
  } catch (err) {
    console.log("erro user JWT ", err, " jwt ", req.session.jwt);
  }
  next();
};

export default currentUser;
