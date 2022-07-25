import express from "express";
import orderModel from "../models/order.js";
import userModel from "../models/user.js";
import currentUser from "../midleware/currentUser.js";
import requiredAuth from "../midleware/requiredAuth.js";
import validateRequest from "../midleware/validateRequest.js";
import { body } from "express-validator";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const orders = await orderModel.find();

    res.send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});

router.put(
  "/order",
  // [
  //   body("id")
  //     .trim()
  //     .isLength({ min: 1 })
  //     .notEmpty()
  //     .withMessage("Introduza um id"),
  // ],
  // validateRequest,
  // currentUser,
  // requiredAuth,
  async (req, res) => {
    try {
      const { id, itemName } = req.body;
      // const { currentUser } = req;
      // const user = await userModel.findById(currentUser.id);
      // if (!user) {
      //   return res.status(400).send("Utilizador não encontrado");
      // }
      // if (user.permission !== "admin") {
      //   return res.status(400).send("Não tem permissão para fazer isto");
      // }

      const order = await orderModel.findById(id);
      if (!order) {
        return res.status(400).send("Encomenda não encontrada");
      }
      const itemsUpdated = [];
      order.items.forEach((item) => {
        if (item.item == itemName) {
          item.isPreparing = !item.isPreparing;
        }

        itemsUpdated.push(item);
      });

      order.set({
        items: itemsUpdated,
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
    body("name").trim().isLength({ min: 1 }).withMessage("Introduza um nome"),

    body("date")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Introduza a data do pedido e hora de entrega"),

    body("items")
      .isArray()
      .notEmpty()
      .withMessage("Introduza pelo menos um item"),
  ],
  validateRequest,

  async (req, res) => {
    try {
      console.log(req.body);
      const { name, obs, date, items } = req.body;

      // const user = await userModel.findById(req.currentUser.id);
      // if (!user) {
      //   return res.status(400).send("Utilizador não encontrado");
      // }
      // if (user.permission !== "admin") {
      //   return res.status(400).send("Você não tem permissão para fazer isto");
      // }
      const newDate = new Date(date);
      newDate.setHours(newDate.getHours() + 1);
      const order = new orderModel({
        name,
        obs,
        date: newDate,
        items: items,
      });
      await order.save();

      res.status(200).send(order);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Algo errado aconteceu: ${error}`);
    }
  }
);

router.delete(
  "/order",
  [body("id").trim().isLength({ min: 1 }).withMessage("Provide a id")],
  validateRequest,
  // currentUser,
  // requiredAuth,
  async (req, res) => {
    try {
      const { id } = req.body;

      // const user = await userModel.findById(req.currentUser.id);
      // if (!user) {
      //   return res.status(400).send("User not found");
      // }
      // if (user.permission === "view") {
      //   return res.status(400).send("You are not authorized to do this");
      // }

      const order = await orderModel.findById(id);
      if (!order) {
        return res.status(400).send("Outlet not found");
      }
      await order.delete();

      res.status(200).send(order);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Something wrong happened: ${error}`);
    }
  }
);

export { router as orderRouter };
