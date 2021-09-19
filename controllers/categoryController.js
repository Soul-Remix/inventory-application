const Category = require('../models/category');
const Product = require('../models/product');
const { body, validationResult } = require('express-validator');

// Index controller

const index = async (req, res, next) => {
  try {
    const [categoriesCount, productsCount, products] = await Promise.all([
      Category.countDocuments({}),
      Product.countDocuments({}),
      Product.find(),
    ]);
    const allProductsCount = products.reduce((a, b) => {
      return a + b.inStock;
    }, 0);
    const runningLow = products.filter((item) => {
      return item.inStock < 5;
    });
    res.render('index', {
      title: 'Home Page',
      categoriesCount,
      productsCount,
      allProductsCount,
      runningLow,
    });
  } catch (err) {
    return next(err);
  }
};

// Category controller

const category_list = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.render('categories', { title: 'All Categories', categories });
  } catch (err) {
    return next(err);
  }
};

const category_detail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [category, products] = await Promise.all([
      Category.findById(id),
      Product.find({ category: id }),
    ]);
    if (!category) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('category-detail', {
      title: 'Category Detail',
      category,
      products,
    });
  } catch (err) {
    return next(err);
  }
};

// Create Category

const category_create_get = (req, res) => {
  res.render('category-create', {
    title: 'Create Category',
    category: {},
    errors: [],
  });
};

const category_create_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Category Name is required'),
  body('pass')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Password is required'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const category = new Category({
        name: req.body.name,
      });
      if (!errors.isEmpty()) {
        res.render('category-create', {
          title: 'Create Category',
          category,
          errors: errors.array(),
        });
      } else if (req.body.pass !== process.env.PASS) {
        res.render('category-create', {
          title: 'Create Category',
          category,
          errors: ["Password Doesn't Match"],
        });
      } else {
        const isAvail = await Category.findOne({ name: req.body.name });
        if (isAvail) {
          res.redirect(isAvail.url);
        } else {
          await category.save();
          res.redirect(`/category/${category._id}`);
        }
      }
    } catch (err) {
      return next(err);
    }
  },
];

// Update Category

const category_update_get = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.redirect('/categories');
    }
    res.render('category-update', {
      title: 'Update Category',
      category,
      errors: [],
    });
  } catch (err) {
    return next(err);
  }
};

const category_update_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Enter a valid category name'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const category = new Category({
        name: req.body.name,
        _id: req.params.id,
      });
      if (!errors.isEmpty()) {
        res.render('category-update', {
          title: 'Create Category',
          category,
          errors: errors.array(),
        });
      } else if (req.body.pass !== process.env.PASS) {
        res.render('category-create', {
          title: 'Create Category',
          category,
          errors: ["Password Doesn't Match"],
        });
      } else {
        const isAvail = await Category.findOne({ name: req.body.name });
        if (isAvail) {
          res.redirect(isAvail.url);
        } else {
          await Category.findByIdAndUpdate(req.params.id, category);
          res.redirect(`/category/${category._id}`);
        }
      }
    } catch (err) {
      return next(err);
    }
  },
];

// Delete Category

const category_delete_get = async (req, res, next) => {
  try {
    const [category, products] = await Promise.all([
      Category.findById(req.params.id),
      Product.find({ category: req.params.id }),
    ]);
    if (!category) {
      res.redirect('/categories');
    } else {
      res.render('category-delete', {
        title: 'Delete Category',
        category,
        products,
        errors: [],
      });
    }
  } catch (err) {
    return next(err);
  }
};

const category_delete_post = async (req, res, next) => {
  try {
    const [category, products] = await Promise.all([
      Category.findById(req.params.id),
      Product.find({ category: req.params.id }),
    ]);
    if (!category) {
      res.redirect('/categories');
    } else if (req.body.pass !== process.env.PASS) {
      res.render('category-delete', {
        title: 'Delete Category',
        category,
        products,
        errors: ["Password Doesn't Match"],
      });
    } else if (products.length > 0) {
      res.render('category-delete', {
        title: 'Delete Category',
        category,
        products,
        errors: ['Make sure to delete all products in selected category first'],
      });
    } else {
      await Category.findByIdAndDelete(req.params.id);
      res.redirect('/categories');
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  index,
  category_list,
  category_detail,
  category_create_get,
  category_create_post,
  category_update_get,
  category_update_post,
  category_delete_get,
  category_delete_post,
};
