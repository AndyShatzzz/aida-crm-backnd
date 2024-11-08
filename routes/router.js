const router = require("express").Router();
const auth = require("../middlewares/auth");
// const { validateCreateUser, validateLogin } = require('../middlewares/validation');

const { createUsers, login } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUsers);

router.use("/users", auth, require("./users"));
router.use("/products", auth, require("./products"));
router.use("/cards", auth, require("./cards"));
router.use("/cheques", auth, require("./cheques"));
router.use("/tables", auth, require("./tables"));

module.exports = router;
