const express = require("express");
const { register, login, chekAuth } = require("../controllers/auth");
const {
  getAllCategories,
  getDetailCategory,
  addCategory,
  editCategory,
  deleteCategory,
} = require("../controllers/category");
const { auth, authAdmin } = require("../middlewares/authentication");
const { runValidation } = require("../validators");
const { categoryValidator } = require("../validators/category");
const router = express.Router();

/* User */
router.post("/register", register);
router.post("/login", login);
router.get("/auth", auth, chekAuth); // cek authentikasi (harus login)
router.get("/auth", auth, authAdmin, chekAuth); // cek authentikasi (harus login sebagai admin)

/* Category */
router.get("/categories", auth, authAdmin, getAllCategories);
router.get("/category/:id", auth, authAdmin, getDetailCategory);
router.post(
  "/category",
  auth,
  authAdmin,
  categoryValidator,
  runValidation,
  addCategory
);
router.patch(
  "/category/:id",
  auth,
  authAdmin,
  categoryValidator,
  runValidation,
  editCategory
);
router.delete("/category/:id", auth, authAdmin, deleteCategory);

module.exports = router;
