import express from "express";
import itemModel from "../models/createItem.js";
import userModel from "../models/user.js";
import currentUser from "../midleware/currentUser.js";
import requiredAuth from "../midleware/requiredAuth.js";
import validateRequest from "../midleware/validateRequest.js";
import { body } from "express-validator";

const router = express.Router();

router.get("/item", async (req, res) => {
  try {
    const items = await itemModel.find().sort("orderNumber");
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: [{ msg: `Algo errado aconteceu: ${error}` }] });
  }
});

router.get("/item/:id", async (req, res) => {
  try {
    const item = await itemModel.findById(req.params.id);
    res.status(200).send(item);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: [{ msg: `Algo errado aconteceu: ${error}` }] });
  }
});

router.put(
  "/item",
  [body("id").trim().isLength({ min: 1 }).withMessage("Introduza um id")],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { name, id, confetionTime } = req.body;
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
      const item = await itemModel.findById(id);
      if (!item) {
        return res
          .status(400)
          .send({ error: [{ msg: "Item não encontrado" }] });
      }
      item.set({
        name: name || item.name,
        confetionTime: confetionTime || item.confectionTime,
      });
      await item.save();

      res.status(200).send(item);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ error: [{ msg: `Algo errado aconteceu: ${error}` }] });
    }
  }
);

router.put(
  "/item/changeOrder",
  [
    body("number").not().isEmpty().withMessage("Introduza um número"),
    body("direction")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Introduza uma direção"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { number, direction } = req.body;
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
      if (number <= 0 && direction == "up") {
        return res
          .status(403)
          .send({ error: [{ msg: "Já sou o primeiro da lista!" }] });
      }
      const allItens = await itemModel.count();

      if (number >= allItens - 1 && direction == "down") {
        return res
          .status(400)
          .send({ error: [{ msg: "Já sou o último da lista!" }] });
      }

      const item1 = await itemModel.findOne({ orderNumber: number });
      const item2 = await itemModel.findOne({
        orderNumber: direction == "up" ? number - 1 : number + 1,
      });
      if (!item1 || !item2) {
        return res
          .status(400)
          .send({ error: [{ msg: "Item não encontrado" }] });
      }
      const orderNumberItem1 = item1.orderNumber;
      item1.set({
        orderNumber: item2.orderNumber,
      });
      item2.set({
        orderNumber: orderNumberItem1,
      });
      await item1.save();
      await item2.save();
      res.status(200).json("Movido com sucesso");
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ error: [{ msg: `Algo errado aconteceu: ${error}` }] });
    }
  }
);
router.post(
  "/item",
  [
    body("confetionTime")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Introduza um tempo de confecção"),

    body("name").trim().isLength({ min: 1 }).withMessage("Introduza um nome"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { name, confetionTime } = req.body;
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
      const totalItensNumber = await itemModel.countDocuments();
      const itemType = new itemModel({
        name: name,
        confetionTime: confetionTime,
        orderNumber: totalItensNumber,
      });
      await itemType.save();

      res.status(200).json("Adicionado com sucesso");
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ error: [{ msg: `Algo errado aconteceu: ${error}` }] });
    }
  }
);

router.delete(
  "/item",
  [body("id").trim().isLength({ min: 1 }).withMessage("Introduza um id")],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { id } = req.body;
      const user = await userModel.findById(req.currentUser.id);
      if (!user) {
        return res
          .status(400)
          .send({ error: [{ msg: "Utilizador não encontrado" }] });
      }

      if (user.permission === "view") {
        return res
          .status(400)
          .send({ error: [{ msg: "Não tens autorização" }] });
      }
      const item = await itemModel.findById(id);

      if (!item) {
        return res
          .status(400)
          .send({ error: [{ msg: "Item não encontrado" }] });
      }

      await item.remove();
      res.status(200).json("Item removido com sucesso!");
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ error: [{ msg: `Algo errado aconteceu: ${error}` }] });
    }
  }
);

export { router as itemRouter };
