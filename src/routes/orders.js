import express from "express";

import { endOfDay } from "date-fns";
import { startOfDay } from "date-fns";

import { body } from "express-validator";

import { utcToZonedTime } from "date-fns-tz/esm";

import currentUser from "../midleware/currentUser.js";
import requiredAuth from "../midleware/requiredAuth.js";
import validateRequest from "../midleware/validateRequest.js";
import orderModel from "../models/order.js";
import userModel from "../models/user.js";
const router = express.Router();

router.get("/status/:status", async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await orderModel
      .find({
        status: { $gte: 0, $lt: status },
        date: {
          $gte: utcToZonedTime(startOfDay(new Date()), "Europe/Madrid"),
          $lte: utcToZonedTime(endOfDay(new Date()), "Europe/Madrid"),
        },
      })
      .sort("date");

    return res.send(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});
router.get("/uniqueStatus/:status", async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await orderModel
      .find({
        status: status,
        date: {
          $gte: utcToZonedTime(startOfDay(new Date()), "Europe/Madrid"),
          $lte: utcToZonedTime(endOfDay(new Date()), "Europe/Madrid"),
        },
      })
      .sort("date");

    return res.send(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});

router.get("/date/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const orders = await orderModel
      .find({
        date: {
          $gte: utcToZonedTime(startOfDay(new Date(date)), "Europe/Madrid"),
          $lte: utcToZonedTime(endOfDay(new Date(date)), "Europe/Madrid"),
        },
      })
      .sort("date");

    return res.send(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});

router.get("/order/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await orderModel.findById(id);

    return res.send(orders);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: [{ msg: `Algo errado aconteceu: ${error}` }] });
  }
});

router.put(
  "/orderUpdate",
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
      const { id, obs, items, name, date } = req.body;
      const { currentUser } = req;
      const user = await userModel.findById(currentUser.id);
      if (!user) {
        return res
          .status(400)
          .send({ error: [{ msg: "Utilizador não encontrado" }] });
      }
      if (user.permission !== "admin") {
        return res
          .status(400)
          .send({ error: [{ msg: "Não tem permissão para fazer isto" }] });
      }

      const order = await orderModel.findById(id);
      if (!order) {
        return res
          .status(400)
          .send({ error: [{ msg: "Encomenda não encontrada" }] });
      }

      order.set({
        obs,
        items,
        name,
        date,
      });
      await order.save();

      return res.status(200).send(order);
    } catch (erro) {
      console.log(erro);
      return res
        .status(500)
        .send({ error: [{ msg: `Algo errado aconteceu: ${erro}` }] });
    }
  }
);

router.put(
  "/statusItemOrder",
  [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Introduza um id"),
    body("itemName")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Introduza o nome do prato"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { id, itemName } = req.body;
      const { currentUser } = req;
      const user = await userModel.findById(currentUser.id);
      if (!user) {
        return res
          .status(400)
          .send({ error: [{ msg: "Utilizador não encontrado" }] });
      }
      if (user.permission !== "admin") {
        return res
          .status(400)
          .send({ error: [{ msg: "Não tem permissão para fazer isto" }] });
      }

      const order = await orderModel.findById(id);
      if (!order) {
        return res
          .status(400)
          .send({ error: [{ msg: "Encomenda não encontrada" }] });
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
      return res
        .status(500)
        .send({ error: [{ msg: `Algo errado aconteceu: ${error}` }] });
    }
  }
);

router.put(
  "/orderStatus",
  [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Introduza um id"),
    body("status")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Introduza um número entre 0 e 2 para o estado"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { id, status } = req.body;
      const { currentUser } = req;
      const user = await userModel.findById(currentUser.id);
      if (!user) {
        return res
          .status(400)
          .send({ error: [{ msg: "Utilizador não encontrado" }] });
      }
      if (user.permission !== "admin") {
        return res
          .status(400)
          .send({ error: [{ msg: "Não tem permissão para fazer isto" }] });
      }

      const order = await orderModel.findById(id);
      if (!order) {
        return res
          .status(400)
          .send({ error: [{ msg: "Encomenda não encontrada" }] });
      }

      order.set({
        status: status,
      });
      await order.save();

      return res.status(200).send(order);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ error: [{ msg: `Algo errado aconteceu: ${error}` }] });
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
  currentUser,
  requiredAuth,

  async (req, res) => {
    try {
      const { name, obs, date, items } = req.body;
      if (items.length == 0) {
        return res.status(400).send({ error: [{ msg: "sem itens" }] });
      }

      const { currentUser } = req;
      const user = await userModel.findById(currentUser.id);
      if (!user) {
        return res
          .status(400)
          .send({ error: [{ msg: "Utilizador não encontrado" }] });
      }
      if (user.permission !== "admin") {
        return res
          .status(400)
          .send({ error: [{ msg: "Não tem permissão para fazer isto" }] });
      }

      const newDate = new Date(date);
      newDate.setHours(newDate.getHours());
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
      return res
        .status(500)
        .send({ error: [{ msg: `Algo errado aconteceu: ${error}` }] });
    }
  }
);

router.delete(
  "/order",
  [body("id").trim().isLength({ min: 1 }).withMessage("Provide a id")],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { id } = req.body;

      const { currentUser } = req;
      const user = await userModel.findById(currentUser.id);
      if (!user) {
        return res
          .status(400)
          .send({ error: [{ msg: "Utilizador não encontrado" }] });
      }
      if (user.permission !== "admin") {
        return res
          .status(400)
          .send({ error: [{ msg: "Não tem permissão para fazer isto" }] });
      }

      const order = await orderModel.findById(id);
      if (!order) {
        return res
          .status(400)
          .send({ error: [{ msg: "Encomenda não encontrada" }] });
      }
      await order.delete();

      return res.status(200).json("Encomenda removida com sucesso!");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ error: [{ msg: `Algo errado aconteceu: ${error}` }] });
    }
  }
);

export { router as orderRouter };

