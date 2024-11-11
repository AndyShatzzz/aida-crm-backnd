const router = require("express").Router();

const { printCheque } = require("../controllers/printCheque");

router.post("/", printCheque);

module.exports = router;
