const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');

/* GET home page. */
router.get('/', categoryController.index);

// Category Routes

router.get('/categories', categoryController.category_list);

router.get('/category/create', categoryController.category_create_get);

router.post('/category/create', categoryController.category_create_post);

router.get('/category/:id/update', categoryController.category_update_get);

router.post('/category/:id/update', categoryController.category_update_post);

router.get('/category/:id/delete', categoryController.category_delete_get);

router.post('/category/:id/delete', categoryController.category_delete_post);

router.get('/category/:id', categoryController.category_detail);

// Product Routes

router.get('/products', productController.product_list);

router.get('/product/create', productController.product_create_get);

router.post('/product/create', productController.product_create_post);

router.get('/product/:id/update', productController.product_update_get);

router.post('/product/:id/update', productController.product_update_post);

router.get('/product/:id/delete', productController.product_delete_get);

router.post('/product/:id/delete', productController.product_delete_post);

router.get('/product/:id', productController.product_detail);

module.exports = router;
