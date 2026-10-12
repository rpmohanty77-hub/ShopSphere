
require('dotenv').config()

const mongoose = require('mongoose')

async function fixProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    const collection = mongoose.connection.db.collection('products')

    const products = [
      {
        name: 'Everyday Sneakers',
        description: 'Lightweight sneakers designed for everyday comfort and casual style.',
        category: 'Fashion',
        price: 1899,
        oldPrice: 2499,
        stock: 30,
        label: 'POPULAR',
      },
      {
        name: 'Minimal Desk Lamp',
        description: 'A minimal desk lamp for a comfortable and well-lit workspace.',
        category: 'Home & Living',
        price: 1299,
        oldPrice: 1699,
        stock: 20,
        label: 'TRENDING',
      },
      {
        name: 'Classic Wrist Watch',
        description: 'A classic wrist watch with a timeless design for everyday wear.',
        category: 'Accessories',
        price: 2199,
        oldPrice: 2899,
        stock: 15,
        label: 'BESTSELLER',
      },
    ]

    for (const product of products) {
      const result = await collection.updateOne(
        { name: product.name },
        { $set: product },
      )

      console.log(`${product.name}: matched ${result.matchedCount}`)
    }

    const result = await collection.find(
      { isActive: true },
      { projection: { name: 1, category: 1, price: 1, oldPrice: 1 } },
    ).toArray()

    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

fixProducts()
