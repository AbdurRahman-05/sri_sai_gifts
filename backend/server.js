const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

// ─── Product Schema & Model ───────────────────────────────────────────────────
const productSchema = new mongoose.Schema({
    name: { type: String },
    mainCategory: { type: String },
    category: { type: String },
    price: { type: Number, default: 0 },
    comparePrice: { type: Number },
    ratings: { type: Number, default: 4.8 },
    stock: { type: Number, default: 50 },
    description: { type: String },
    image: { type: String },
    material: { type: String },
    style: { type: String },
    width: { type: Number },
    height: { type: Number },
    depth: { type: Number },
    priority: { type: Number, default: 999 },
    customizable: { type: Boolean, default: false },
    features: [{ type: String }],
    insideImages: [{ type: String }],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// ─── User Schema & Model ──────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
    fullName: { type: String },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Saved confidentially (hashed)
    likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    cart: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }]
}, {
    timestamps: true,
    collection: 'users' // Explicitly naming as requested
});

const User = mongoose.model('User', userSchema);

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET all products (sorted oldest first)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create new product
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            stock: req.body.stock !== undefined ? req.body.stock : 50
        });
        await product.save();
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update existing product
app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST toggle stock
app.post('/api/products/:id/stock', async (req, res) => {
    try {
        const { inStock } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: { stock: inStock ? 50 : 0 } },
            { new: true }
        );
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// ─── User Auth Routes ───────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ success: false, message: 'Email already registered' });

        if (username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) return res.status(400).json({ success: false, message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ fullName, username, email, password: hashedPassword });
        await user.save();
        res.json({ success: true, user: { id: user._id, fullName: user.fullName, username: user.username, email: user.email, likedProducts: [] } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[Login Attempt] Identity: ${email}`);

        if (email === 'jb' && password === 'jb@2005') {
            console.log(`[Login Success] Admin: ${email}`);
            return res.json({ success: true, isAdmin: true });
        }

        const user = await User.findOne({
            $or: [{ email: email }, { username: email }]
        }).populate('likedProducts');

        if (!user) {
            console.warn(`[Login Failed] User not found: ${email}`);
            return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn(`[Login Failed] Incorrect password for: ${email}`);
            return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
        }

        console.log(`[Login Success] User: ${user.fullName} (${user.email})`);
        res.json({
            success: true, user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                likedProducts: user.likedProducts.map(p => (p._id || p.id || p).toString()),
                cart: user.cart
            }
        });
    } catch (err) {
        console.error('[Login Error]', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── User Action Routes ─────────────────────────────────────────────────────
app.get('/api/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({
            success: true,
            user: {
                likedProducts: user.likedProducts.map(id => id.toString()),
                cart: user.cart
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/user/:userId/like', async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const index = user.likedProducts.findIndex(id => id.toString() === productId);
        if (index > -1) {
            user.likedProducts.splice(index, 1); // Unlike
        } else {
            user.likedProducts.push(productId); // Like
        }
        await user.save();
        res.json({ success: true, likedProducts: user.likedProducts.map(id => id.toString()) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/user/:userId/cart', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const cartItemIdx = user.cart.findIndex(item => item.productId.toString() === productId);
        if (cartItemIdx > -1) {
            user.cart[cartItemIdx].quantity += (quantity || 1);
        } else {
            user.cart.push({ productId, quantity: quantity || 1 });
        }
        await user.save();
        res.json({ success: true, cart: user.cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/user/:userId/cart/:productId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.cart = user.cart.filter(item => item.productId.toString() !== req.params.productId);
        await user.save();
        res.json({ success: true, cart: user.cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/user/:userId/cart/:productId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const idx = user.cart.findIndex(item => item.productId.toString() === req.params.productId);
        if (idx === -1) return res.status(404).json({ error: 'Cart item not found' });

        if (quantity <= 0) {
            user.cart.splice(idx, 1);
        } else {
            user.cart[idx].quantity = quantity;
        }
        await user.save();
        res.json({ success: true, cart: user.cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Cloudinary Configuration ───────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'sri_sai_gifts',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [
            { width: 800, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
        ]
    },
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        res.json({
            success: true,
            imageUrl: req.file.path
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

const path = require('path');

// ─── Serve Frontend for Production ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
