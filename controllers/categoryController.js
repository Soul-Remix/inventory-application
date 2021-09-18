const Category = require('../models/category');
const Product = require('../models/product');

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

const category_list = async (req, res) => {
  const categories = await Category.find();
  res.render('categories', { title: 'All Categories', categories });
};

const category_detail = (req, res) => {
  res.send('not implemented');
};

// Create Category

const category_create_get = (req, res) => {
  res.send('not implemented');
};

const category_create_post = (req, res) => {
  res.send('not implemented');
};

// Update Category

const category_update_get = (req, res) => {
  res.send('not implemented');
};

const category_update_post = (req, res) => {
  res.send('not implemented');
};

// Delete Category

const category_delete_get = (req, res) => {
  res.send('not implemented');
};

const category_delete_post = (req, res) => {
  res.send('not implemented');
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
