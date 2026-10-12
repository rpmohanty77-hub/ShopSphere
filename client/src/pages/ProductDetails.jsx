
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  CheckCircle2,
} from 'lucide-react'

function ProductDetails({
  products = [],
  onAddToCart,
  favorites = [],
  onToggleFavorite,
}) {
  const { productId } = useParams()

  // Match the MongoDB ID passed through the product URL.
  const product = products.find(
    (item) => String(item.id ?? item._id) === productId,
  )

  const money = (amount) =>
    `₹${Number(amount || 0).toLocaleString('en-IN')}`

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-3xl font-black">Product not found</h1>
        <p className="mt-3 text-slate-600">
          This product may not be available.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white"
        >
          <ArrowLeft size={18} /> Back to shop
        </Link>
      </main>
    )
  }

  const isFavorite = favorites.includes(product.id)

  const features = product.features?.length
    ? product.features
    : [
        'Designed for everyday use',
        'Part of the ShopSphere collection',
        'Product details from the catalogue',
      ]

  const discount =
    product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-cyan-700"
      >
        <ArrowLeft size={18} /> Back to shopping
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
        <div
          className={`flex min-h-80 items-center justify-center rounded-[2rem] sm:min-h-[480px] ${
            product.color || 'bg-slate-100'
          }`}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full max-h-[480px] w-full rounded-[2rem] object-contain p-6"
            />
          ) : (
            <span
              className="text-[9rem] sm:text-[12rem]"
              role="img"
              aria-label={product.name}
            >
              {product.emoji || '🛍️'}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
            {product.category}
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-black">
              {money(product.price)}
            </span>

            {product.oldPrice > product.price && (
              <>
                <span className="text-lg text-slate-400 line-through">
                  {money(product.oldPrice)}
                </span>
                {discount > 0 && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Save {discount}%
                  </span>
                )}
              </>
            )}
          </div>

          <p className="mt-6 leading-7 text-slate-600">
            {product.description || 'Discover this product from the ShopSphere collection.'}
          </p>

          <div className="mt-7 space-y-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 text-sm text-slate-700"
              >
                <CheckCircle2
                  size={18}
                  className="shrink-0 text-emerald-600"
                />
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => onAddToCart(product)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-cyan-800"
            >
              <ShoppingBag size={19} /> Add to cart
            </button>

            <button
              onClick={() => onToggleFavorite(product.id)}
              aria-pressed={isFavorite}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-4 font-semibold transition hover:bg-slate-50"
            >
              <Heart
                size={19}
                className={
                  isFavorite ? 'fill-rose-500 text-rose-500' : ''
                }
              />
              {isFavorite ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">
              Product information
            </p>
            <p className="mt-2">
              Product information is loaded from the ShopSphere catalogue API.
              Stock and checkout are still part of the development workflow.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductDetails
