import express from "express";

import jwt from "jsonwebtoken";
import { currentUser } from "../midleware/currentUser.js";
import { requiredAuth } from "../midleware/requiredAuth.js";
import { validateRequest } from "../midleware/validateRequest.js";
import { body } from "express-validator";
const router = express.Router();

router.get("/outlets", async (req, res) => {
  try {
    const payload = jwt.verify(req.session.jwt, process.env.SECRET);
    const user = await userModel.findById(payload.id);
    if (!user) {
      return res.status(400).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something wrong happened: ${error}`);
  }
});

router.get("/outlets/:id/products", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await outletModel.findById(id);

    const final = [];

    for await (let productId of products.products) {
      const product = await productModel.findById(productId);
      final.push(product);
    }

    res.status(200).send(final);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something wrong happened: ${error}`);
  }
});

router.put(
  "/outlets",
  [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a id"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { name, size, year, locationType, id } = req.body;

      const user = await userModel.findById(req.currentUser.id);
      if (!user) {
        return res.status(400).send("User not found");
      }
      if (user.permission === "view") {
        return res.status(400).send("You are not authorized to do this");
      }

      const outlet = await outletModel.findById(id);
      if (!outlet) {
        return res.status(400).send("Outlet not found");
      }

      outlet.set({
        name: name || outlet.name,
        size: size || outlet.size,
        year: year || outlet.year,
        locationType: locationType || outlet.locationType,
        updated_at: Date.now(),
      });
      await outlet.save();

      res.status(200).send(outlet);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Something wrong happened: ${error}`);
    }
  }
);

router.post(
  "/outlets",
  [
    body("name")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a name"),
    body("size")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a size"),
    body("year")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a year"),
    body("location")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a location"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { name, size, year, locationType, sales } = req.body;

      const user = await userModel.findById(req.currentUser.id);
      if (!user) {
        return res.status(400).send("User not found");
      }
      if (user.permission === "view") {
        return res.status(400).send("You are not authorized to do this");
      }

      const outlet = new outletModel({
        name: name,
        size: size,
        year: year,
        locationType: locationType,
        sales: sales,
        product: [],
      });
      await outlet.save();

      res.status(200).send(outlet);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Something wrong happened: ${error}`);
    }
  }
);

router.delete(
  "/outlets",
  [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a id"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { id } = req.body;

      const user = await userModel.findById(req.currentUser.id);
      if (!user) {
        return res.status(400).send("User not found");
      }
      if (user.permission === "view") {
        return res.status(400).send("You are not authorized to do this");
      }

      const outlet = await outletModel.findById(id);
      if (!outlet) {
        return res.status(400).send("Outlet not found");
      }
      await outlet.delete();

      res.status(200).send(outlet);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Something wrong happened: ${error}`);
    }
  }
);

export { router as ordersRouter };

