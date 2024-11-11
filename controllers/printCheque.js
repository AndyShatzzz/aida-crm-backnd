const escpos = require("escpos-serialport");
require("escpos-network");
const net = require("net");
const iconv = require("iconv-lite");

const { PRINTER_IP, PRINTER_PORT } = process.env;

module.exports.printCheque = (req, res) => {
  const { message } = req.body;

  const client = new net.Socket();
  let responseSent = false;
  const encodedMessage = iconv.encode(message, "CP866");

  client.connect(parseInt(PRINTER_PORT, 10), PRINTER_IP, () => {
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

    const printSequence = async () => {
      try {
        await sendCommand("\x1B\x40"); // Инициализация принтера
        await sendCommand(encodedMessage); // Сообщение для печати
        await sendCommand("\x0A"); // Перевод строки
        await sendCommand("\x1D\x56\x41"); // Обрезка бумаги
        await sendCommand("\x1B\x40");
        await client.destroy();
        console.log(message);

        if (!responseSent) {
          res.status(200).json({ success: true, message: "Печать завершена" });
          responseSent = true;
        }
      } catch (error) {
        if (!responseSent) {
          res.status(500).json({
            success: false,
            message:
              "Ошибка при печати, пожалуйста проверьте принтер чек и попытайтесь еще раз",
            error: error.message,
          });
          responseSent = true;
        }
      }
    };

    printSequence();
  });

  client.on("error", (error) => {
    if (!responseSent) {
      res.status(500).json({
        success: false,
        message:
          "Ошибка при печати, пожалуйста проверьте принтер чек и попытайтесь еще раз",
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
};
