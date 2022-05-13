import jwt from "jsonwebtoken";
export const currentUser = (req, res, next) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(req.session.jwt, process.env.SECRET);
    req.currentUser = payload;
  } catch (err) {
    console.log("erro user JWT ", err, " jwt ", req.session.jwt);
  }
  next();
};
