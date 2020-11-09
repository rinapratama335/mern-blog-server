const { Category } = require("../../models");
const slugify = require("slugify");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      message: "Categories successfully loaded",
      data: {
        categories: categories,
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

exports.getDetailCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const detailCategory = await Category.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!detailCategory)
      res.status(400).send({
        error: {
          message: `Category with id ${id} not found`,
        },
      });

    res.send({
      message: `Category with id ${id} successfully loaded`,
      data: {
        category: detailCategory,
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

exports.addCategory = async (req, res) => {
  try {
    const newCategory = await Category.create({
      name: req.body.name,
      slug: slugify(req.body.name, { lower: true }),
    });

    res.send({
      message: "Data successfully added",
      data: {
        category: newCategory,
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

exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCategory = await Category.update(
      {
        name: req.body.name,
        slug: slugify(req.body.name, { lower: true }),
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (updatedCategory) {
      const getCategory = Category.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      res.send({
        message: "Category has been updated",
        data: {
          category: await getCategory,
        },
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).send({
      error: {
        message: "Internal server error",
      },
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const getCategoryDelete = await Category.findByPk(id);

    if (getCategoryDelete) {
      await Category.destroy({
        where: {
          id,
        },
      });

      res.send({
        message: "Data has been deleted",
        data: id,
      });
    } else {
      return res.status(400).send({
        message: "Category not found",
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).send({
      error: {
        message: "Internal sever error",
      },
    });
  }
};
