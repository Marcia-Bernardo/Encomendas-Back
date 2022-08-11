import express from "express";

import endOfDay from "date-fns/endOfDay/index.js";
import startOfDay from "date-fns/startOfDay/index.js";

import { body } from "express-validator";

import currentUser from "../midleware/currentUser.js";
import requiredAuth from "../midleware/requiredAuth.js";
import validateRequest from "../midleware/validateRequest.js";
import orderModel from "../models/order.js";
import userModel from "../models/user.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const orders = await orderModel.find({
      status: { $ne: 2 },
    });

    return res.send(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});

router.get("/status/:status", async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await orderModel.find({
      status: { $gte: 0, $lt: status },
      date: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) },
    });

    return res.send(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});

router.get("/date", async (req, res) => {
  try {
    const orders = await orderModel.find({
      date: {
        $gte: startOfDay(new Date("2022-08-10T19:15:00.000Z")),
        $lte: endOfDay(new Date("2022-08-12T19:15:00.000Z")),
      },
    });

    return res.send(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});

router.get("/order/:id", async (req, res) => {
  try {
    const orders = await orderModel.findById(req.params.id);

    return res.send(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});

router.put(
  "/orderUpdate",
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
      const { id, obs, items, name, date } = req.body;
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
      items.forEach((item) => {
        let count = 0;

        order.items.forEach((newItem) => {
          if (newItem.item == item.item) {
            item.qtd = newItem.qtd;
            itemsUpdated.push(item);
            count++;
          }
        });
        console.log(count);
        if (count == 0) {
          itemsUpdated.push({ ...item, status: 0 });
        }
        count = 0;
      });
      console.log(itemsUpdated);
      order.set({
        items: itemsUpdated,
      });
      console.log(order);
      await order.save();

      return res.status(200).send(order);
    } catch (error) {
      console.log(error);
      return res.status(500).send(`Algo errado aconteceu: ${error}`);
    }
  }
);

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
          if (item.status == 2) {
            item.status = 0;
          } else {
            item.status = item.status + 1;
          }
        }
        itemsUpdated.push(item);
      });

      order.set({
        items: itemsUpdated,
      });
      console.log(order);
      await order.save();

      return res.status(200).send(order);
    } catch (error) {
      console.log(error);
      return res.status(500).send(`Algo errado aconteceu: ${error}`);
    }
  }
);

router.put(
  "/orderStatus",
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
      const { id, status } = req.body;
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

      order.set({
        status: status,
      });
      await order.save();

      return res.status(200).send(order);
    } catch (error) {
      console.log(error);
      return res.status(500).send(`Algo errado aconteceu: ${error}`);
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
      .withMessage("Introduza pelo menos um artigo"),
  ],
  validateRequest,

  async (req, res) => {
    try {
      const { name, obs, date, items } = req.body;
      console.log(items.length);
      if (items.length == 0) {
        return res.status(400).send({ error: [{ msg: "sem itens" }] });
      }
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

      return res.status(200).send(order);
    } catch (error) {
      console.log(error);
      return res.status(500).send(`Algo errado aconteceu: ${error}`);
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
        return res.status(400).send("Order not found");
      }
      await order.delete();

      return res.status(200).send(order);
    } catch (error) {
      console.log(error);
      return res.status(500).send(`Something wrong happened: ${error}`);
    }
  }
);

export { router as orderRouter };
