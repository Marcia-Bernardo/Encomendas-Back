import mongoose from "mongoose";
import { app } from "./app.js";

const start = async () => {
  try {
    // console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Servidor a correr na porta ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.log(`Erro: ${err}`);
  }
};

start();

