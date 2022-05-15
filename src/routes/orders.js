import express from "express";

import jwt from "jsonwebtoken";
import orderModel from "../models/order.js";
import currentUser from "../midleware/currentUser.js";
import requiredAuth from "../midleware/requiredAuth.js";
import validateRequest from "../midleware/validateRequest.js";
import { body } from "express-validator";
const router = express.Router();

// router.get("/outlets", async (req, res) => {
//   try {
//     const payload = jwt.verify(req.session.jwt, process.env.SECRET);
//     const user = await userModel.findById(payload.id);
//     if (!user) {
//       return res.status(400).send("User not found");
//     }
//     res.status(200).send(user);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(`Something wrong happened: ${error}`);
//   }
// });

// router.get("/outlets/:id/products", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const products = await outletModel.findById(id);

//     const final = [];

//     for await (let productId of products.products) {
//       const product = await productModel.findById(productId);
//       final.push(product);
//     }

//     res.status(200).send(final);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(`Something wrong happened: ${error}`);
//   }
// });

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
      nst { name, obs, date, items ,id} = req.body;

      const user = await userModel.findById(req.currentUser.id);
      if (!user) {
        return res.status(400).send("User not found");
      }
      if (user.permission === "view") {
        return res.status(400).send("You are not authorized to do this");
      }

      const order = await orderModel.findById(id);
      if (!order) {
        return res.status(400).send("Order not found");
      }

      order.set({
        name: name || order.name,
        obs: obs || order.obs,
        date: date || order.date,
        items: items || order.items,
        updated_at: Date.now(),
      });
      await order.save();

      res.status(200).send(order);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Something wrong happened: ${error}`);
    }
  }
);

router.post(
  "/order",
  [
    body("name")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a name"),
    body("obs")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a size"),
    body("date")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a year"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { name, obs, date, items } = req.body;

      const user = await userModel.findById(req.currentUser.id);
      if (!user) {
        return res.status(400).send("User not found");
      }
      if (user.permission === "view") {
        return res.status(400).send("You are not authorized to do this");
      }

      const order = new orderModel({
        name: name,
        obs: obs,
        date: date,
        items: items,
        created_at: Date.now(),
      });
      await order.save();

      res.status(200).send(order);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Something wrong happened: ${error}`);
    }
  }
);

// router.delete(
//   "/outlets",
//   [
//     body("id")
//       .trim()
//       .isLength({ min: 1 })
//       .notEmpty()
//       .withMessage("Provide a id"),
//   ],
//   validateRequest,
//   currentUser,
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

//       const outlet = await outletModel.findById(id);
//       if (!outlet) {
//         return res.status(400).send("Outlet not found");
//       }
//       await outlet.delete();

//       res.status(200).send(outlet);
//     } catch (error) {
//       console.log(error);
//       res.status(500).send(`Something wrong happened: ${error}`);
//     }
//   }
// );

export { router as orderRouter };

