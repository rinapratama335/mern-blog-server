const { check } = require("express-validator");

exports.categoryValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("name")
    .isLength({ min: 3 })
    .withMessage("Name must at least 3 characters long"),
];
