// require("dotenv").config();
// const express = require("express");

// const mongoose = require("mongoose");
// const cors = require("cors");

// const { errors } = require("celebrate");
// const router = require("./routes/router");
// const auth = require("./middlewares/auth");

// const errorHandler = require("./middlewares/errorHandler");
// const defaultErrorNotFound = require("./middlewares/defaultErrorNotFound");
// const { errorLogger } = require("./middlewares/logger");

// const { PORT = 3000 } = process.env;

// const app = express();

// app.use(express.json());

// mongoose.connect("mongodb://127.0.0.1:27017/crmbd", {
//   useNewUrlParser: true,
// });

// app.use(cors({ origin: true, credentials: true }));
// app.get("/crash-test", () => {
//   setTimeout(() => {
//     throw new Error("Сервер сейчас упадёт");
//   }, 2000);
// });
// app.use("/", router);
// app.use(errorLogger);
// app.use(errors());

// app.use("*", auth, defaultErrorNotFound);

// app.use(errorHandler);

// app.listen(PORT);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");

const router = require("./routes/router");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");
const defaultErrorNotFound = require("./middlewares/defaultErrorNotFound");
const { errorLogger } = require("./middlewares/logger");
const escpos = require("escpos-serialport");
require("escpos-network");
const net = require("net");
const iconv = require("iconv-lite");

const { PORT = 3000, PRINTER_IP, PRINTER_PORT } = process.env;

const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/crmbd", {
  useNewUrlParser: true,
});

app.use(cors({ origin: true, credentials: true }));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 2000);
});

app.use("/", router);
app.use(errorLogger);
app.use(errors());

// app.post("/print", async (req, res) => {
//   const { message } = req.body;

//   const client = new net.Socket();
//   let responseSent = false;
//   const encodedMessage = iconv.encode(message, "CP866");

//   client.connect(parseInt(PRINTER_PORT, 10), PRINTER_IP, () => {
//     console.log(
//       "Соединение с принтером установлено, отправляем команды ESC/POS"
//     );

//     const escposCommands = [
//       "\x1B\x40", // Инициализация принтера
//       // "\x1B\x61\x01", // Центрирование текста
//       // "\x1B\x61\x00", // Выравнивание по левому краю
//       // "\x1B\x21\x10", // Установка жирного текста
//       encodedMessage, // Сообщение для печати
//       "\x0A", // Перевод строки
//       "\x1D\x56\x41", // Обрезка бумаги
//     ];

//     const buffer = Buffer.concat(
//       escposCommands.map((cmd) =>
//         Buffer.isBuffer(cmd) ? cmd : Buffer.from(cmd, "binary")
//       )
//     );

//     client.write(buffer, () => {
//       console.log("Команды на печать отправлены");
//       client.destroy();
//       if (!responseSent) {
//         res.status(200).json({ success: true, message: "Печать завершена" });
//         responseSent = true;
//       }
//     });
//   });

//   client.on("error", (error) => {
//     console.error("Ошибка при подключении к принтеру:", error);
//     if (!responseSent) {
//       res.status(500).json({
//         success: false,
//         message: "Ошибка при печати",
//         error: error.message,
//       });
//       responseSent = true;
//     }
//   });

//   client.on("close", () => {
//     if (!responseSent) {
//       res.status(500).json({
//         success: false,
//         message: "Принтер закрыл соединение до завершения печати",
//       });
//       responseSent = true;
//     }
//   });
// });

app.post("/print", async (req, res) => {
  const { message } = req.body;

  const client = new net.Socket();
  let responseSent = false;
  const encodedMessage = iconv.encode(message, "CP866");

  client.connect(parseInt(PRINTER_PORT, 10), PRINTER_IP, () => {
    console.log(
      "Соединение с принтером установлено, отправляем команды ESC/POS"
    );

    // Функция для отправки команды и ожидания завершения
    const sendCommand = (command) => {
      return new Promise((resolve, reject) => {
        client.write(command, "binary", (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    };

    // Асинхронная функция для последовательной отправки команд
    const printSequence = async () => {
      try {
        await sendCommand("\x1B\x40"); // Инициализация принтера
        await sendCommand(encodedMessage); // Сообщение для печати
        await sendCommand("\x0A"); // Перевод строки

        // // Пауза перед обрезкой для завершения печати (настраиваемая)
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        await sendCommand("\x1D\x56\x41"); // Обрезка бумаги
        await sendCommand("\x1B\x40");
        await client.destroy();

        if (!responseSent) {
          res
            .status(200)
            .json({ success: true, message: "Печать завершена и чек обрезан" });
          responseSent = true;
        }
      } catch (error) {
        console.error("Ошибка при отправке команды на печать:", error);
        if (!responseSent) {
          res.status(500).json({
            success: false,
            message: "Ошибка при печати",
            error: error.message,
          });
          responseSent = true;
        }
      }
    };

    printSequence();
  });

  client.on("error", (error) => {
    console.error("Ошибка при подключении к принтеру:", error);
    if (!responseSent) {
      res.status(500).json({
        success: false,
        message: "Ошибка при печати",
        error: error.message,
      });
      responseSent = true;
    }
  });

  client.on("close", () => {
    if (!responseSent) {
      res.status(500).json({
        success: false,
        message: "Принтер закрыл соединение до завершения печати",
      });
      responseSent = true;
    }
  });
});

app.use("*", auth, defaultErrorNotFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
