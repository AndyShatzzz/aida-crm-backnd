const router = require("express").Router();

const {
  getUsers,
  getUserId,
  patchUser,
  patchUserAvatar,
  getUserMeOwn,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getUserMeOwn);
router.get("/:userId", getUserId);
router.patch("/:userId", patchUser);
router.patch("/me/avatar", patchUserAvatar);

module.exports = router;
