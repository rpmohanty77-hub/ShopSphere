
import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import {
  Search,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Headphones,
  Heart,
  Menu,
  X,
  Minus,
  Plus,
  Trash2,
  PackageOpen,
} from 'lucide-react'
import ProductDetails from './pages/ProductDetails'

const categories = [
  'All Products',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Accessories',
]


const getProductEmoji = (name, category) => {
  if (name.toLowerCase().includes('headphone')) return '🎧'
  if (name.toLowerCase().includes('sneaker')) return '👟'
  if (name.toLowerCase().includes('lamp')) return '💡'
  if (name.toLowerCase().includes('watch')) return '⌚'

  const emojis = {
    Electronics: '🎧',
    Fashion: '👟',
    'Home & Living': '💡',
    Accessories: '⌚',
  }

  return emojis[category] || '🛍️'
}

const getProductColor = (category) => {
  const colors = {
    Electronics: 'bg-sky-100',
    Fashion: 'bg-orange-100',
    'Home & Living': 'bg-amber-100',
    Accessories: 'bg-violet-100',
  }

  return colors[category] || 'bg-slate-100'
}


const money = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`

function App() {
  
const [products, setProducts] = useState([])
const [productsLoading, setProductsLoading] = useState(true)
const [productsError, setProductsError] = useState('')

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Products')

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shopsphere-cart') || '[]')
    } catch {
      return []
    }
  })

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('shopsphere-favorites') || '[]',
      )
    } catch {
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigate = useNavigate()

  
useEffect(() => {
  async function fetchProducts() {
    try {
      setProductsLoading(true)
      setProductsError('')

      const response = await fetch(
        'http://localhost:5000/api/products'
      )

      if (!response.ok) {
        throw new Error('Could not load products from the server.')
      }

      const result = await response.json()
      console.log('Products received from API:', result.data)

      const formattedProducts = result.data.map((product) => ({
        ...product,
        id: product._id,
        emoji: getProductEmoji(product.name, product.category),
        color: getProductColor(product.category),
        features: [],
      }))

      setProducts(formattedProducts)
    } catch (error) {
      setProductsError(
        error.message || 'Something went wrong while loading products.'
      )
    } finally {
      setProductsLoading(false)
    }
  }

  fetchProducts()
}, [])


  useEffect(() => {
    localStorage.setItem('shopsphere-cart', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem(
      'shopsphere-favorites',
      JSON.stringify(favorites),
    )
  }, [favorites])

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText)

      const matchesCategory =
        activeCategory === 'All Products' ||
        product.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [products, search, activeCategory])

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  function addToCart(product) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id,
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentItems, { ...product, quantity: 1 }]
    })
  }

  function updateQuantity(productId, change) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    )
  }

  function toggleFavorite(productId) {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )
  }

  function goToShop() {
    navigate('/')
    setIsCartOpen(false)
    setMobileMenuOpen(false)

    window.setTimeout(() => {
      document
        .getElementById('products')
        ?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  function HomePage() {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <div className="bg-slate-950 px-4 py-2.5 text-center text-xs font-medium text-white sm:text-sm">
          Discover your next favourite thing at ShopSphere.
        </div>

        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <Link
              to="/"
              className="shrink-0 text-2xl font-black tracking-tight"
            >
              Shop<span className="text-cyan-600">Sphere</span>
              <span className="ml-1 align-top text-xs text-cyan-600">
                ®
              </span>
            </Link>

            <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
              <a href="#home" className="hover:text-cyan-700">
                Home
              </a>
              <a href="#products" className="hover:text-cyan-700">
                Shop
              </a>
              <a href="#benefits" className="hover:text-cyan-700">
                Why ShopSphere
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <label className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 sm:flex">
                <Search size={17} className="text-slate-500" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    document
                      .getElementById('products')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="w-32 bg-transparent text-sm outline-none lg:w-44"
                />
              </label>

              <button
                onClick={() => setIsCartOpen(true)}
                aria-label={`Open cart, ${cartCount} items`}
                className="relative rounded-full border border-slate-200 p-2.5 hover:bg-slate-100"
              >
                <ShoppingBag size={20} />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              </button>

              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
                className="rounded-full border border-slate-200 p-2.5 md:hidden"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="space-y-1 border-t border-slate-100 px-5 py-3 md:hidden">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                Home
              </a>
              <a
                href="#products"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                Shop
              </a>
              <a
                href="#benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                Why ShopSphere
              </a>
            </nav>
          )}

          <div className="border-t border-slate-100 px-5 py-3 sm:hidden">
            <label className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5">
              <Search size={17} className="text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
          </div>
        </header>

        <main>
          <section id="home" className="overflow-hidden bg-slate-50">
            <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
              <div>
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-800">
                  <span className="h-2 w-2 rounded-full bg-cyan-600" />
                  Your everyday marketplace
                </p>

                <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                  Good finds.
                  <br />
                  <span className="text-cyan-700">
                    Better everyday.
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                  Explore useful essentials, discover new favourites
                  and enjoy a simpler way to shop—all in one place.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#products"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-bold text-white hover:bg-cyan-800"
                  >
                    Explore products <ArrowRight size={17} />
                  </a>
                  <a
                    href="#benefits"
                    className="rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold hover:border-slate-500"
                  >
                    Discover more
                  </a>
                </div>

                <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-600">
                  <span>✓ Curated essentials</span>
                  <span>✓ Simple shopping</span>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xl">
                <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-cyan-200/60 blur-2xl" />
                <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-orange-200/60 blur-2xl" />

                <div className="relative rounded-[2rem] bg-slate-950 p-5 shadow-2xl sm:p-8">
                  <div className="flex items-center justify-between text-sm text-white">
                    <span className="font-semibold">
                      The everyday edit
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                      Collection 01
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex aspect-[4/5] flex-col justify-between rounded-3xl bg-cyan-100 p-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-900">
                        Listen better
                      </span>
                      <span className="self-center text-7xl sm:text-8xl">
                        🎧
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        Sound essentials
                      </span>
                    </div>

                    <div className="mt-8 flex aspect-[4/5] flex-col justify-between rounded-3xl bg-orange-100 p-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-900">
                        Move freely
                      </span>
                      <span className="self-center text-7xl sm:text-8xl">
                        👟
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        Daily comfort
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
                    <div>
                      <p className="text-sm font-semibold">
                        Find your next favourite
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        A little discovery goes a long way.
                      </p>
                    </div>
                    <ArrowRight className="text-cyan-300" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="products"
            className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20"
          >
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                  Made for your day
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  Explore our collection
                </h2>
                <p className="mt-3 text-slate-600">
                  Thoughtful picks for work, home and everything in between.
                </p>
              </div>
              <p className="text-sm text-slate-500">
                {filteredProducts.length} products shown
              </p>
            </div>

            <div className="mt-8 flex gap-2 overflow-x-auto pb-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    activeCategory === category
                      ? 'bg-slate-950 text-white'
                      : 'border border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            
{productsLoading && (
  <div className="mt-8 rounded-2xl bg-slate-50 py-12 text-center">
    <p className="font-semibold text-slate-700">
      Loading your products...
    </p>
    <p className="mt-2 text-sm text-slate-500">
      Please wait a moment.
    </p>
  </div>
)}

{!productsLoading && productsError && (
  <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 py-10 text-center">
    <p className="font-semibold text-rose-700">
      Could not load products
    </p>
    <p className="mt-2 text-sm text-rose-600">
      {productsError}
    </p>
    <p className="mt-2 text-sm text-slate-600">
      Please check whether the backend server is running.
    </p>
  </div>
)}


            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`relative flex aspect-square items-center justify-center ${product.color}`}
                  >
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black tracking-wider text-slate-800">
                      {product.label}
                    </span>

                    <button
                      onClick={() => toggleFavorite(product.id)}
                      aria-label={`Toggle favourite for ${product.name}`}
                      aria-pressed={favorites.includes(product.id)}
                      className="absolute right-4 top-4 rounded-full bg-white/90 p-2 hover:scale-110"
                    >
                      <Heart
                        size={18}
                        className={
                          favorites.includes(product.id)
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-slate-600'
                        }
                      />
                    </button>

                    <Link
                      to={`/products/${product.id}`}
                      className="text-8xl transition duration-300 group-hover:scale-110"
                      aria-label={`View ${product.name}`}
                    >
                      {product.emoji}
                    </Link>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {product.category}
                    </p>

                    <Link
                      to={`/products/${product.id}`}
                      className="mt-2 block text-lg font-bold hover:text-cyan-700"
                    >
                      {product.name}
                    </Link>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-lg font-black">
                        {money(product.price)}
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        {money(product.oldPrice)}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-800"
                    >
                      <ShoppingBag size={17} />
                      Add to cart
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {!productsLoading &&
  !productsError &&
  filteredProducts.length === 0 && (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 py-12 text-center">
                <Search className="mx-auto text-slate-400" size={30} />
                <h3 className="mt-3 font-bold">No products found</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try another search or choose a different category.
                </p>
                <button
                  onClick={() => {
                    setSearch('')
                    setActiveCategory('All Products')
                  }}
                  className="mt-4 font-semibold text-cyan-700 underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          <section
            id="benefits"
            className="border-y border-slate-100 bg-slate-50"
          >
            <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:grid-cols-3 lg:px-8">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800">
                  <Truck size={23} />
                </div>
                <div>
                  <h3 className="font-bold">Delivery information</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Clear delivery details during checkout.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800">
                  <ShieldCheck size={23} />
                </div>
                <div>
                  <h3 className="font-bold">Thoughtful shopping</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    A straightforward experience from discovery to order.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800">
                  <Headphones size={23} />
                </div>
                <div>
                  <h3 className="font-bold">Customer support</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    A dedicated place for shopping assistance.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50">
            <button
              aria-label="Close cart overlay"
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 cursor-default"
            />

            <aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
              className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h2 id="cart-title" className="text-xl font-bold">
                    Your Cart
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {cartCount} item(s)
                  </p>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close shopping cart"
                  className="rounded-full border border-slate-200 p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {cartItems.length === 0 ? (
                  <div className="py-16 text-center">
                    <PackageOpen
                      size={40}
                      className="mx-auto text-slate-400"
                    />
                    <h3 className="mt-4 font-bold">
                      Your cart is empty
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Add a product to get started.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-cyan-800"
                    >
                      Continue shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-slate-100 pb-4"
                    >
                      <div
                        className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-3xl ${item.color}`}
                      >
                        {item.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {money(item.price)}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="min-w-5 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Increase ${item.name} quantity`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100"
                          >
                            <Plus size={14} />
                          </button>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.name} from cart`}
                            className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <p className="mt-2 text-sm font-bold">
                          Item total: {money(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t p-5">
                <div className="flex justify-between text-lg font-bold">
                  <span>Subtotal</span>
                  <span>{money(cartTotal)}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Shipping and final charges will be calculated at checkout.
                </p>
                <button
                  disabled={cartItems.length === 0}
                  onClick={() => {
                    setIsCartOpen(false)
                    navigate('/checkout')
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 font-bold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </div>
            </aside>
          </div>
        )}

        <footer className="bg-slate-950 px-5 py-8 text-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <Link to="/" className="text-xl font-black">
              Shop<span className="text-cyan-400">Sphere</span>
            </Link>
            <p className="text-sm text-slate-400">
              An e-commerce project built from the ground up.
            </p>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} ShopSphere
            </p>
          </div>
        </footer>
      </div>
    )
  }

  function CheckoutPage() {
    const [form, setForm] = useState({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
    })
    const [error, setError] = useState('')
    const [placedOrder, setPlacedOrder] = useState(false)
    const [orderNumber, setOrderNumber] = useState('')

    function handleSubmit(event) {
      event.preventDefault()

      if (!cartItems.length) {
        setError('Your cart is empty. Add products before checkout.')
        return
      }

      if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
        setError('Enter a valid 10-digit Indian mobile number.')
        return
      }

      if (!/^\d{6}$/.test(form.postalCode.trim())) {
        setError('Enter a valid 6-digit PIN code.')
        return
      }

      const newOrderNumber = `SS-${Date.now().toString().slice(-8)}`

      const order = {
        orderNumber: newOrderNumber,
        customer: form,
        items: cartItems,
        subtotal: cartTotal,
        createdAt: new Date().toISOString(),
        status: 'Pending',
      }

      try {
        const savedOrders = JSON.parse(
          localStorage.getItem('shopsphere-orders') || '[]',
        )

        localStorage.setItem(
          'shopsphere-orders',
          JSON.stringify([order, ...savedOrders]),
        )

        setOrderNumber(newOrderNumber)
        setError('')
        setPlacedOrder(true)
      } catch {
        setError('Could not save the demo order. Please try again.')
      }
    }

    if (placedOrder) {
      return (
        <div className="min-h-screen bg-slate-50 px-5 py-16">
          <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
              ✓
            </div>
            <h1 className="mt-5 text-3xl font-black">Order saved!</h1>
            <p className="mt-3 text-slate-600">
              Demo order number: <strong>{orderNumber}</strong>
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              This order is stored in this browser only. No payment was
              taken and no real shipment has been created.
            </p>
            <button
              onClick={() => {
                setCartItems([])
                navigate('/')
              }}
              className="mt-7 rounded-full bg-slate-950 px-6 py-3 font-bold text-white hover:bg-cyan-800"
            >
              Continue shopping
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/"
            className="text-sm font-semibold text-cyan-800 hover:underline"
          >
            ← Back to shopping
          </Link>

          <h1 className="mt-5 text-3xl font-black sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-slate-600">
            Enter your delivery details and review your demo order.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-3xl bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-xl font-bold">Delivery information</h2>

              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-semibold">
                  Full name
                </label>
                <input
                  id="fullName"
                  required
                  value={form.fullName}
                  onChange={(event) =>
                    setForm({ ...form, fullName: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
                  Mobile number
                </label>
                <input
                  id="phone"
                  required
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      phone: event.target.value.replace(/\D/g, '').slice(0, 10),
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <label htmlFor="address" className="mb-2 block text-sm font-semibold">
                  Delivery address
                </label>
                <textarea
                  id="address"
                  required
                  rows={3}
                  value={form.address}
                  onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600"
                  placeholder="House number, street, area"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-semibold">
                    City
                  </label>
                  <input
                    id="city"
                    required
                    value={form.city}
                    onChange={(event) =>
                      setForm({ ...form, city: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="mb-2 block text-sm font-semibold">
                    PIN code
                  </label>
                  <input
                    id="postalCode"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={form.postalCode}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        postalCode: event.target.value.replace(/\D/g, '').slice(0, 6),
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600"
                    placeholder="6-digit PIN code"
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!cartItems.length}
                className="w-full rounded-xl bg-slate-950 px-5 py-3.5 font-bold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Place demo order
              </button>

              <p className="text-xs leading-5 text-slate-500">
                Demo only: this saves the order in browser storage. Real
                payment and server-side order processing are not connected.
              </p>
            </form>

            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold">Order summary</h2>

              {cartItems.length === 0 ? (
                <p className="mt-5 text-sm text-slate-500">
                  Your cart is empty.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${item.color}`}>
                        {item.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold">
                        {money(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 border-t pt-5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{money(cartTotal)}</span>
                </div>
                <div className="mt-3 flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span>Calculated later</span>
                </div>
                <div className="mt-4 flex justify-between text-lg font-black">
                  <span>Total before shipping</span>
                  <span>{money(cartTotal)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/products/:productId"
        element={
          <ProductDetails
            products={products}
            onAddToCart={(product) => {
              addToCart(product)
              setIsCartOpen(true)
              navigate('/')
            }}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        }
      />

      <Route path="/checkout" element={<CheckoutPage />} />

      <Route
        path="*"
        element={
          <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
            <h1 className="text-4xl font-black">Page not found</h1>
            <p className="mt-3 text-slate-600">
              The page you are looking for does not exist.
            </p>
            <Link
              to="/"
              className="mt-6 rounded-full bg-slate-950 px-6 py-3 font-bold text-white hover:bg-cyan-800"
            >
              Back to home
            </Link>
          </div>
        }
      />
    </Routes>
  )
}

export default App
