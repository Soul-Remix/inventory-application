const Category = require('../models/category');
const Product = require('../models/product');
const { body, validationResult } = require('express-validator');
const { findById } = require('../models/category');

// Product Controller

const product_list = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category')
      .sort({ category: 1 });
    res.render('products', { title: 'All Products', products });
  } catch (err) {
    return next(err);
  }
};

const product_detail = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      const err = new Error('Product Not found');
      err.status = 404;
      return next(err);
    }
    res.render('product-detail', { title: 'Product Detail', product });
  } catch (err) {
    return next(err);
  }
};

// Create Product

const product_create_get = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('product-create', {
      title: 'Create Product',
      categories,
      product: {},
      errors: [],
    });
  } catch (err) {
    return next(err);
  }
};

const product_create_post = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Enter a valid title'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Enter a valid description'),
  body('price')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isNumeric()
    .withMessage('Enter a valid price'),
  body('inStock')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isInt()
    .withMessage('Enter a valid in stock number'),
  body('image')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a valid image URL'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const product = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        inStock: req.body.inStock,
        image: req.body.image,
        category: req.body.category,
      });
      const categories = await Category.find();
      if (!errors.isEmpty()) {
        res.render('product-create', {
          title: 'Create Product',
          product,
          categories,
          errors: errors.array(),
        });
      } else if (req.body.pass !== process.env.PASS) {
        res.render('product-create', {
          title: 'Create Product',
          product,
          categories,
          errors: [{ msg: "Password doesn't match" }],
        });
      } else {
        const isAvail = await Product.findOne({ title: req.body.title });
        if (isAvail) {
          res.redirect(isAvail.url);
        } else {
          product.save().then(res.redirect(`/product/${product._id}`));
        }
      }
    } catch (err) {
      return next(err);
    }
  },
];

// Update Product

const product_update_get = async (req, res, next) => {
  try {
    const [product, categories] = await Promise.all([
      Product.findById(req.params.id).populate('category'),
      Category.find(),
    ]);
    if (!product) {
      res.redirect('/products');
    } else {
      res.render('product-update', {
        title: 'Update product',
        product,
        categories,
        errors: [],
      });
    }
  } catch (err) {
    return next(err);
  }
};

const product_update_post = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Enter a valid title'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Enter a valid description'),
  body('price')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isNumeric()
    .withMessage('Enter a valid price'),
  body('inStock')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isInt()
    .withMessage('Enter a valid in stock number'),
  body('image')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a valid image URL'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const id = req.params.id;
      const product = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        inStock: req.body.inStock,
        image: req.body.image,
        category: req.body.category,
        _id: id,
      });
      const [productFound, categories] = await Promise.all([
        Product.findById(id),
        Category.find(),
      ]);
      if (!productFound) {
        res.redirect('/products');
      } else if (!errors.isEmpty()) {
        res.render('product-update', {
          title: 'Update Product',
          product,
          categories,
          errors: errors.array(),
        });
      } else if (req.body.pass !== process.env.PASS) {
        res.render('product-update', {
          title: 'Update Product',
          product,
          categories,
          errors: [{ msg: "Password doesn't match" }],
        });
      } else {
        await Product.findByIdAndUpdate(id, product);
        res.redirect(`/product/${product._id}`);
      }
    } catch (err) {
      return next(err);
    }
  },
];

// Delete Product

const product_delete_get = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      res.redirect('/products');
    } else {
      res.render('product-delete', { title: 'Delete Product', product });
    }
  } catch (err) {
    return next(err);
  }
};

const product_delete_post = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      res.redirect('/products');
    } else {
      await Product.findByIdAndDelete(req.params.id);
      res.redirect('/products');
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  product_list,
  product_detail,
  product_create_get,
  product_create_post,
  product_update_get,
  product_update_post,
  product_delete_get,
  product_delete_post,
};
