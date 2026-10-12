
const express = require('express')
const mongoose = require('mongoose')
const Product = require('../models/Product')

const router = express.Router()

// GET /api/products - Fetch all active products
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query

    const filter = { isActive: true }

    if (category && category !== 'All Products') {
      filter.category = category
    }

    if (search && search.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: 'i',
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {}

      if (minPrice !== undefined) {
        const minimum = Number(minPrice)

        if (!Number.isFinite(minimum) || minimum < 0) {
          return res.status(400).json({
            success: false,
            message: 'minPrice must be a valid non-negative number',
          })
        }

        filter.price.$gte = minimum
      }

      if (maxPrice !== undefined) {
        const maximum = Number(maxPrice)

        if (!Number.isFinite(maximum) || maximum < 0) {
          return res.status(400).json({
            success: false,
            message: 'maxPrice must be a valid non-negative number',
          })
        }

        filter.price.$lte = maximum
      }

      if (
        filter.price.$gte !== undefined &&
        filter.price.$lte !== undefined &&
        filter.price.$gte > filter.price.$lte
      ) {
        return res.status(400).json({
          success: false,
          message: 'minPrice cannot be greater than maxPrice',
        })
      }
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    console.error('Fetch products error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch products',
    })
  }
})

// GET /api/products/:id - Fetch a single product
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      })
    }

    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Fetch product error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch product',
    })
  }
})

// POST /api/products - Create a product
// Admin authentication will be added before production use.
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Product validation failed',
        errors: Object.values(error.errors).map(
          (item) => item.message,
        ),
      })
    }

    console.error('Create product error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to create product',
    })
  }
})

// PUT /api/products/:id - Update a product
// Admin authentication will be added before production use.
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      })
    }

    const allowedFields = [
      'name',
      'description',
      'category',
      'price',
      'oldPrice',
      'image',
      'stock',
      'label',
      'isActive',
    ]

    const updates = {}

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Provide at least one valid field to update',
      })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      },
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    })
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product data',
      })
    }

    console.error('Update product error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to update product',
    })
  }
})

// DELETE /api/products/:id - Soft-delete a product
// Admin authentication will be added before production use.
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true, runValidators: true },
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Product deactivated successfully',
    })
  } catch (error) {
    console.error('Delete product error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to deactivate product',
    })
  }
})

module.exports = router
