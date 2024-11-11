const router = require("express").Router();

const {
  getTables,
  postTable,
  deleteTable,
  patchTables,
} = require("../controllers/tables");

router.get("/", getTables);
router.post("/", postTable);
router.delete("/:tableId", deleteTable);
router.patch("/:tableId", patchTables);

module.exports = router;
