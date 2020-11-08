const express = require("express");
const { User } = require("../../models");

// enkripsi menggunakan bcrypt
const bcrypt = require("bcrypt");

// untuk generate token jika berhasil login
const jwt = require("jsonwebtoken");

// key untuk dekripsi token
const jwtKey = process.env.JWT_KEY;

// joi untuk validasi
const joi = require("joi");

// method register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validasi
    const schema = joi.object({
      name: joi.string().min(3).required(),
      email: joi.string().email().min(12).required(),
      password: joi.string().min(8).required(),
    });

    // kasih error jika ada kesalahan
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    // cek apakah email sudah ada di database atau belum
    const checkEmail = await User.findOne({
      where: {
        email: email,
      },
    });

    // jika email sudah ada tampilkan error
    if (checkEmail) {
      return res.status(400).send({
        error: {
          message: "Email has been already exist",
        },
      });
    }

    // jika tidak ada error lakukan langkah selanjutnya
    const saltStrength = 10;

    // enkripsi password
    const hashedPassword = await bcrypt.hash(password, saltStrength);

    // simpan ke database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // buat token setalah berhasil register
    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtKey
    );

    // kirim response dan juga tokennya
    res.send({
      message: "Register success",
      data: {
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          token: token,
        },
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      error: {
        message: "Internal server error",
      },
    });
  }
};
