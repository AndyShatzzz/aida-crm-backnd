const router = require("express").Router();

const { getTables, postTable, deleteTable } = require("../controllers/tables");

router.get("/", getTables);
router.post("/", postTable);
router.delete("/:tableId", deleteTable);

module.exports = router;
