const router = require("express").Router();

const { getTables, postTable } = require("../controllers/tables");

router.get("/", getTables);
router.post("/", postTable);

module.exports = router;
