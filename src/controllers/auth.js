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
    const { errors } = schema.validate(req.body);

    if (errors) {
      return res.status(400).send({
        error: {
          message: errors.details[0].message,
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

// method login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // lakukan validasi terhadap inputan
    const schema = joi.object({
      email: joi.string().email().min(13).required(),
      password: joi.string().min(8).required(),
    });

    // jika ada error validasi maka tampilkan
    const { errors } = schema.validate(req.body);

    if (errors) {
      return res.status(400).send({
        error: {
          message: errors.details[0].message,
        },
      });
    }

    // jika lolos validasi, lakukan pengecakan email ada di database atau tidak
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    // jika email tidak ada di database tampilkan error
    if (!user) {
      return res.status(400).send({
        error: {
          message: "Email or password is invalid",
        },
      });
    }

    // jika lolos validasi dan email ada di database
    // compare password dari user dengan yang ada di databse
    const validPassword = await bcrypt.compare(password, user.password);

    // jika tidak valid kasih error
    if (!validPassword) {
      return res.status(400).send({
        error: {
          message: "Email or password is invalid",
        },
      });
    }

    // jika lolos semua dan berhasil login, buat token
    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtKey
    );

    // kirim response
    res.send({
      message: "Login successfully",
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

  console.log(req.body.email);
  console.log(req.body.password);
};

// method cek authentikasi
exports.chekAuth = async (req, res) => {
  console.log(req.user.id);

  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },

      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.status(200).send({
      data: {
        user: user,
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
