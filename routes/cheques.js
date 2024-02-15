const router = require("express").Router();

const {
  getCheques,
  postCheque,
  deleteCheque,
  patchCheque,
  patchChequeStatus,
  putUpdateState,
} = require("../controllers/cheques");

router.get("/", getCheques);
router.post("/", postCheque);
router.delete("/:chequeId", deleteCheque);
router.patch("/:chequeId", patchCheque);
router.patch("/status/:chequeId", patchChequeStatus);
router.put("/:chequeId", putUpdateState);

module.exports = router;
