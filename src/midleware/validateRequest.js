// @ts-ignore
import { validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(401).send({ error: errors.array(), message: "Invalid data" });
  }

  next();
};
export default validateRequest;

