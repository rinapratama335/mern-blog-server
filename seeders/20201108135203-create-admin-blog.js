"use strict";

const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hash = bcrypt.hashSync(process.env.PASSWORD, 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Irwanto",
          email: "irwantoadmin@yahoo.com",
          password: hash,
          role: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
