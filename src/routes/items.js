import express from "express";
import itemModel from "../models/item.js";
import userModel from "../models/user.js";
import { currentUser } from "../midleware/currentUser.js";
import { requiredAuth } from "../midleware/requiredAuth.js";
import { validateRequest } from "../midleware/validateRequest.js";
import { body } from "express-validator";
const router = express.Router();

router.put(
  "/products",
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
      const { qtd, type, confectionTime, id } = req.body;

      const user = await userModel.findById(req.currentUser.id);
      if (!user) {
        return res.status(400).send("User not found");
      }
      if (user.permission !== "admin" || user.permission !== "edit") {
        return res.status(400).send("You are not authorized to do this");
      }
      const item = await itemModel.findById(id);
      if (!item) {
        return res.status(400).send("Product not found");
      }
      item.set({
        qtd: qtd || item.qtd,
        confectionTime: confectionTime || item.confectionTime,
        type: type || item.type,

        updated_at: Date.now(),
      });
      await item.save();

      res.status(200).send(item);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Something wrong happened: ${error}`);
    }
  }
);

router.post(
  "/products",
  [
    body("qtd")
      .trim()
      .isLength({ min: 4 })
      .notEmpty()
      .withMessage("Provide a quantity"),
    body("type")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a type"),
    body("confectionTime")
      .trim()
      .isLength({ min: 2 })
      .notEmpty()
      .withMessage("Provide a confection time"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { qtd, confectionTime, type } = req.body;

      const user = await userModel.findById(req.currentUser.id);
      if (!user) {
        return res.status(400).send("User not found");
      }
      if (user.permission === "view") {
        return res.status(400).send("You are not authorized to do this");
      }

      const item = new itemModel({
        qtd: qtd,
        confectionTime: confectionTime,
        type: type,
      });
      await item.save();

      res.status(200).send(item);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Something wrong happened: ${error}`);
    }
  }
);

// router.delete(
//   "/products",
//   [
//     body("id")
//       .trim()
//       .isLength({ min: 1 })
//       .notEmpty()
//       .withMessage("Provide a id"),
//   ],
//   validateRequest,
//   requiredAuth,
//   async (req, res) => {
//     try {
//       const { id } = req.body;

//       const user = await userModel.findById(req.currentUser.id);
//       if (!user) {
//         return res.status(400).send("User not found");
//       }
//       if (user.permission === "view") {
//         return res.status(400).send("You are not authorized to do this");
//       }
//       const product = await itemModel.findById(id);
//       if (!product) {
//         return res.status(400).send("Product not found");
//       }
//       const outlet = await outletModel.find({ products: id });

//       if (outlet) {
//         return res.status(400).send("Product is associated with an outlet");
//       }

//       await product.remove();
//       res.status(200).send(product);
//     } catch (error) {
//       console.log(error);
//       res.status(500).send(`Something wrong happened: ${error}`);
//     }
//   }
// );

export { router as itemRouter };

