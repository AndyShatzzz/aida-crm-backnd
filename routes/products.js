const router = require("express").Router();

const {
  getProducts,
  postProduct,
  deleteProduct,
  patchProduct,
  patchProductQuantity,
} = require("../controllers/products");

router.get("/", getProducts);
router.post("/", postProduct);
router.delete("/:productId", deleteProduct);
router.patch("/:productId", patchProduct);
router.patch("/quantity/:productId", patchProductQuantity);

module.exports = router;
