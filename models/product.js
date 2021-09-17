const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  inStock: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
});

ProductSchema.virtual('url').get(() => {
  return `/product/${this._id}`;
});

module.exports = mongoose.model('Product', ProductSchema);
