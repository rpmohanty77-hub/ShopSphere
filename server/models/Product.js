
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must contain at least 2 characters'],
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      enum: [
        'Electronics',
        'Fashion',
        'Home & Living',
        'Accessories',
      ],
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },

    oldPrice: {
      type: Number,
      min: [0, 'Old price cannot be negative'],
      default: null,
    },

    image: {
      type: String,
      trim: true,
      default: '',
    },

    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Stock must be a whole number',
      },
    },

    label: {
      type: String,
      trim: true,
      default: 'NEW ARRIVAL',
      maxlength: 40,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

productSchema.index({ name: 1, category: 1 })

module.exports = mongoose.model('Product', productSchema)
