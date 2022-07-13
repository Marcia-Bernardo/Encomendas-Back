import express from "express";
import orderModel from "../models/order.js";
import userModel from "../models/user.js";
import currentUser from "../midleware/currentUser.js";
import requiredAuth from "../midleware/requiredAuth.js";
import validateRequest from "../midleware/validateRequest.js";
import { body } from "express-validator";
import itemModel from "../models/item.js";
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    // const orders = await orderModel.find();
    // const items = [];
    // console.log(orders.items);
    const orders = await orderModel.find();

    const result = orders.map(async (q) => {
      return {
        ...q._doc,
        items: q.items.map(async (p) => {
          console.log(p);
          const value = await itemModel.findById(p);
          console.log("value", value);
          return value;
        }),
      };
    });

    const data = await Promise.all(result);
    console.log(data);
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});

router.put(
  "/outlets",
  [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Introduza um id"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { name, obs, date, items, id } = req.body;
      const { currentUser } = req;
      const user = await userModel.findById(currentUser.id);
      if (!user) {
        return res.status(400).send("Utilizador não encontrado");
      }
      if (user.permission !== "admin") {
        return res.status(400).send("Não tem permissão para fazer isto");
      }

      const order = await orderModel.findById(id);
      if (!order) {
        return res.status(400).send("Encomenda não encontrada");
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
      res.status(500).send(`Algo errado aconteceu: ${error}`);
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
        return res.status(400).send("Utilizador não encontrado");
      }
      if (user.permission !== "admin") {
        return res.status(400).send("Você não tem permissão para fazer isto");
      }
      console.log(new Date(date).toDateString());

      const order = new orderModel({
        name: name,
        obs: obs,
        date: Date.parse(date),
        items: items,
        created_at: Date.now(),
      });
      await order.save();

      res.status(200).send(order);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Algo errado aconteceu: ${error}`);
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

