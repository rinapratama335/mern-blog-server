const express = require("express");
const { register, login, chekAuth } = require("../controllers/auth");
const { auth, authAdmin } = require("../middlewares/authentication");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/auth", auth, chekAuth); // cek authentikasi (harus login)
router.get("/auth", auth, authAdmin, chekAuth); // cek authentikasi (harus login sebagai admin)

module.exports = router;
