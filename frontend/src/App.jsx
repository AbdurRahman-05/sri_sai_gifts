import React, { useState, useEffect, useRef } from 'react';
import { uploadImageToCloudinary } from './cloudinary';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import {
  Mail,
  Lock,
  Download,
  ChevronDown,
  Users,
  Search,
  Menu,
  X,
  Watch,
  Wallet,
  Box,
  PenTool,
  Umbrella,
  Heart,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  Bell,
  Truck,
  ShieldCheck,
  Award,
  TrendingUp,
  Smartphone,
  Key,
  Clipboard,
  Circle,
  Zap,
  Gift,
  Trophy,
  Coffee,
  PenLine,
  Clock,
  Frame,
  Layout,
  Calendar,
  Briefcase,
  Plane,
  GlassWater,
  Battery,
  Cable,
  Speaker,
  Usb,
  Package,
  BookOpen,
  Notebook,
  StickyNote,
  Pen,
  IdCard,
  Utensils,
  Sparkles,
  Flame,
  Flower2,
  Flashlight,
  FlaskConical,
  Wine,
  CupSoda,
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  ChevronLeft,
  Star,
  Shield,
  ShoppingCart,
  MapPin,
  Phone,
  LogOut,
  RefreshCw,
  RotateCcw,
  ChevronRight,
  Play,
  Filter,
  History,
  AlertCircle,
  SlidersHorizontal,
  LayoutGrid
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const cardVariants = {
  offHover: (angle) => ({
    rotateY: angle,
    z: 60,
    opacity: 0.9,
    scale: 1,
    zIndex: 30,
    transition: {
      type: "spring",
      mass: 3,
      stiffness: 400,
      damping: 50
    }
  }),
  onHover: (hoverScale) => ({
    rotateY: 0,
    z: 120,
    opacity: 1,
    scale: hoverScale,
    zIndex: 50,
    transition: {
      type: "spring",
      mass: 3,
      stiffness: 400,
      damping: 50
    }
  })
};

const AngledCard = ({
  item,
  angle,
  hoverScale,
  cardWidth,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex-shrink-0 group overflow-visible cursor-pointer"
      style={{
        width: cardWidth,
        height: "380px",
        transformStyle: "preserve-3d",
      }}
      onClick={onClick}
      custom={isHovered ? hoverScale : angle}
      variants={cardVariants}
      initial="offHover"
      animate={isHovered ? "onHover" : "offHover"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full w-full overflow-hidden border border-white/10 shadow-2xl rounded-2xl"
        style={{ backgroundColor: 'var(--bg-accent)', minHeight: '300px' }}>
        <img
          src={item.url}
          alt={item.alt || "Slider Image"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/70 p-8 flex flex-col justify-center items-center text-center transition-all duration-500">
          <span style={{ color: '#ff003c', opacity: isHovered ? 1 : 0 }} className="font-bold text-xs tracking-widest uppercase mb-2 transition-all duration-500 transform translate-y-0 pointer-events-none drop-shadow-md">Collections</span>
          <h3 className="text-white text-2xl font-bold mb-3 transition-colors duration-300 drop-shadow-xl">{item.title}</h3>
          <div style={{ opacity: isHovered ? 1 : 0 }} className="flex items-center justify-center gap-3 transition-all duration-500 delay-100 transform translate-y-0 pointer-events-none">
            <span className="text-white/90 text-sm font-medium">{item.count}</span>
            <div style={{ backgroundColor: '#ff003c' }} className="w-10 h-[1px] opacity-50" />
            <span style={{ color: '#ff003c' }} className="text-xs font-bold uppercase tracking-wider drop-shadow-md">Explore</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AngledSlider = ({
  items,
  speed = 40,
  direction = "left",
  containerHeight = "450px",
  cardWidth = "300px",
  gap = "40px",
  angle = 20,
  hoverScale = 1.05,
  className,
  onItemClick
}) => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const duplicatedItems = [...items, ...items, ...items];

  useEffect(() => {
    const calculateWidth = () => {
      const numWidth = parseInt(cardWidth?.toString().replace("px", "") || "300");
      const numGap = parseInt(gap?.toString().replace("px", "") || "40");

      if (!isNaN(numWidth) && !isNaN(numGap)) {
        const calculatedWidth = (numWidth + numGap) * items.length;
        setWidth(calculatedWidth);
      } else if (containerRef.current) {
        const scrollWidth = containerRef.current.scrollWidth;
        setWidth(scrollWidth / 3);
      }
    };

    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, [items, cardWidth, gap]);

  useEffect(() => {
    if (width <= 0) return;

    const startX = direction === "left" ? 0 : -width;
    const endX = direction === "left" ? -width : 0;

    if (isHovered) return;

    const runAnimation = () => {
      const currentX = x.get();
      const totalDist = width;
      const dist = Math.abs(endX - currentX);
      const duration = speed * (dist / totalDist);

      const controls = animate(x, endX, {
        duration: duration,
        ease: "linear",
        onComplete: () => {
          x.set(startX);
          runAnimation();
        }
      });
      return controls;
    };

    const animation = runAnimation();
    return () => animation.stop();
  }, [width, speed, direction, isHovered, x]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden py-10",
        className
      )}
      style={{
        height: containerHeight,
        perspective: "1200px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={containerRef}
        className="flex items-center"
        style={{ x, gap, transformStyle: "preserve-3d" }}
      >
        {duplicatedItems.map((item, index) => (
          <AngledCard
            key={`${item.id}-${index}`}
            item={item}
            angle={angle}
            hoverScale={hoverScale}
            cardWidth={cardWidth}
            onClick={() => onItemClick && onItemClick(item.title)}
          />
        ))}
      </motion.div>
    </div>
  );
};

const categoryStructure = {
  "Bags & Travel Accessories": ["Jute Bags", "Laptop Bags", "Ladies Slings", "Ladies Wallets", "Capsule Umbrella", "Umbrella", "Tiffin Pouch"],
  "BAGS": ["Lunch Bag", "Cash Bag", "Return Gift Bags", "Travel Bag", "Jute Bag", "Laptop Bag", "School Bag", "Trolley"],
  "Office & Desktop Accessories": ["Clock", "Wooden Pen Stand Clock", "Pen Stand", "Dock / Pen Stand Dock", "Paper Pad & Pen Stand", "Mobile Stand", "Scale", "Clip Board"],
  "Writing & Stationery": ["Designer Notebook", "Memo Pad", "Diaries", "Metal Ball Pen", "Plastic Ball Pen", "Engraved Pen", "Card Holder"],
  "Tech & Electronic Accessories": ["Power Bank", "USB", "USB Pendrive", "Speaker", "Charging Stand"],
  "Drinkware & Kitchen Items": ["Bottle", "Mugs", "Ceramic Mug", "Lunch Box", "Hip Flask", "Bar Sets"],
  "Home Decor & Decorative Items": ["Photo Frame", "Show Pieces", "Aroma Candles", "Flower Vases", "Plastic Paper Weight", "Coaster"],
  "Lighting Products": ["Solar Lamp", "Torch & Lamp", "Rechargeable Touch Lamp", "Light & Touch Lamp"],
  "Keychains & Small Accessories": ["Key Ring", "Keychain", "Key Hanger"],
  "GIFT SETS": ["Executive Gift Set", "Corporate Gift Box", "Premium Combo", "Festive Hampers"]
};

const getMainCategoryForSub = (subCat) => {
  if (!subCat) return '';
  const searchCat = subCat.trim();
  for (const [main, subs] of Object.entries(categoryStructure)) {
    if (main.toLowerCase() === searchCat.toLowerCase()) return main;
    if (subs.some(s => s.toLowerCase() === searchCat.toLowerCase())) return main;
  }
  return '';
};

const optimizeCloudinaryUrl = (url, width = 800, quality = 'auto') => {
  if (!url || !url.includes('cloudinary.com')) return url;
  // If the URL already has transformations, don't double up
  if (url.includes('/upload/w_') || url.includes('/upload/q_')) return url;
  // Dynamic optimization: smaller for thumbnails, higher for details
  return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto,c_limit/`);
};

const Navbar = ({ onSignInClick, onHomeClick, onProductsClick, onAboutClick, onCatalogueClick, currentUser, onLogout, onAccountClick, onWishlistClick, onCartClick, onContactClick, cartAnimation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = currentUser?.cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const likedCount = currentUser?.likedProducts?.length || 0;

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="container navbar-content">
          <div
            onClick={(e) => {
              e.preventDefault();
              onHomeClick();
              setIsMenuOpen(false);
            }}
            style={{ cursor: 'pointer' }}
            className="brand-wrapper"
          >
            <img src="/images/logo.png" alt="Sri Sai Gifts Logo" style={{ height: '50px', width: 'auto' }} />
          </div>

          <div className="nav-links">
            <a href="/" className="nav-link" onClick={(e) => { e.preventDefault(); onHomeClick(); }}>Home</a>
            <a href="/products" className="nav-link" onClick={(e) => { e.preventDefault(); onProductsClick && onProductsClick(); }}>Products</a>
            <a href="/about" className="nav-link" onClick={(e) => { e.preventDefault(); onAboutClick(); }}>About</a>
            <a href="/catalogue" className="nav-link" onClick={(e) => { e.preventDefault(); onCatalogueClick && onCatalogueClick(); }}>Catalogue</a>
            <a href="/contact" className="nav-link" onClick={(e) => { e.preventDefault(); onContactClick && onContactClick(); }}>Contact</a>
          </div>

          <div className="nav-actions">
            <div className="desktop-actions">
              <div onClick={onWishlistClick} style={{ position: 'relative', cursor: 'pointer' }}>
                <Heart className="action-icon" size={20} style={{ color: likedCount > 0 ? '#ef4444' : '#0f172a' }} />
                {likedCount > 0 && <span className="cart-badge" style={{ background: '#ef4444' }}>{likedCount}</span>}
              </div>
              <motion.div
                onClick={onCartClick}
                style={{ position: 'relative', cursor: 'pointer' }}
                animate={cartAnimation ? {
                  scale: [1, 1.3, 1],
                  rotate: [0, -10, 10, 0]
                } : {}}
                transition={{ duration: 0.5 }}
              >
                <ShoppingCart className="action-icon" size={20} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="cart-badge"
                      className="cart-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  onClick={onAccountClick}
                  className="desktop-user-avatar"
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0f172a', color: '#ff003c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    {currentUser.fullName[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>{currentUser.fullName.split(' ')[0]}</span>
                </div>
                <button className="btn-signin desktop-btn" style={{ background: '#ef4444', border: 'none' }} onClick={onLogout}>Sign Out</button>
              </div>
            ) : (
              <button className="btn-signin desktop-btn" onClick={onSignInClick}>Sign In</button>
            )}

            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-links">
          <a href="/" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); onHomeClick(); setIsMenuOpen(false); }}>Home</a>
          <a href="/products" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); onProductsClick && onProductsClick(); setIsMenuOpen(false); }}>Products</a>
          <a href="/about" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); onAboutClick(); setIsMenuOpen(false); }}>About</a>
          <a href="/catalogue" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); onCatalogueClick && onCatalogueClick(); setIsMenuOpen(false); }}>Catalogue</a>
          <a href="/contact" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); onContactClick && onContactClick(); setIsMenuOpen(false); }}>Contact</a>
          <div className="mobile-menu-actions">
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
              <div onClick={() => { onWishlistClick(); setIsMenuOpen(false); }} style={{ position: 'relative' }}>
                <Heart className="action-icon" size={24} style={{ color: likedCount > 0 ? '#ef4444' : '#0f172a' }} />
                {likedCount > 0 && <span className="cart-badge" style={{ background: '#ef4444' }}>{likedCount}</span>}
              </div>
              <div onClick={() => { onCartClick(); setIsMenuOpen(false); }} style={{ position: 'relative' }}>
                <ShoppingCart className="action-icon" size={24} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
            </div>
            {currentUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn-signin" style={{ width: '100%', background: 'rgba(255, 0, 60, 0.1)', color: '#0f172a' }} onClick={() => { onAccountClick(); setIsMenuOpen(false); }}>My Account</button>
                <button className="btn-signin" style={{ width: '100%', background: '#ef4444', border: 'none' }} onClick={() => { onLogout(); setIsMenuOpen(false); }}>Sign Out</button>
              </div>
            ) : (
              <button className="btn-signin" style={{ width: '100%' }} onClick={() => { onSignInClick(); setIsMenuOpen(false); }}>Sign In</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const AuthModal = ({ isOpen, onClose, onAdminLogin, onUserLogin }) => {
  const [activeTab, setActiveTab] = useState('signIn');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = e.target;

    try {
      if (activeTab === 'signIn') {
        const email = form.email.value;
        const password = form.password.value;

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
          if (data.isAdmin) {
            onAdminLogin();
          } else {
            onUserLogin(data.user);
          }
          onClose();
        } else {
          setError(data.message || 'Invalid credentials. Please check your username/email and password.');
        }
      } else {
        const fullName = form.fullName.value;
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, username, email, password })
        });
        const data = await res.json();
        if (data.success) {
          onUserLogin(data.user);
          onClose();
        } else {
          setError(data.message || 'Registration failed');
        }
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setError(`Connection error: ${err.message}. Please ensure the backend server is running.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'signIn' ? 'active' : ''}`}
            onClick={() => setActiveTab('signIn')}
          >
            Sign In
          </button>
          <button
            className={`modal-tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Account
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: '#ef4444',
              fontSize: '0.875rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#fee2e2',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #fecaca',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.05)'
            }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: '500' }}>{error}</span>
          </motion.div>
        )}

        {activeTab === 'signIn' && (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email or Username</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input type="text" name="email" placeholder="you@example.com or username" required />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input type="password" name="password" placeholder="••••••••" required />
              </div>
            </div>

            <button className="btn-modal-submit" type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </form>
        )}

        {activeTab === 'create' && (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <Users size={18} className="input-icon" />
                <input type="text" name="fullName" placeholder="John Doe" required />
              </div>
            </div>
            <div className="form-group">
              <label>Username</label>
              <div className="input-wrapper">
                <Users size={18} className="input-icon" />
                <input type="text" name="username" placeholder="johndoe123" required />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input type="email" name="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input type="password" name="password" placeholder="••••••••" required />
              </div>
            </div>

            <button className="btn-modal-submit" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const CheckoutModal = ({ isOpen, onClose, onConfirm, total }) => {
  const [address, setAddress] = useState({
    plotNo: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(address);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="modal-content"
        style={{ maxWidth: '500px', padding: '32px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button className="modal-close" onClick={onClose} style={{ top: '20px', right: '20px' }}><X size={24} /></button>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', color: '#0f172a', fontFamily: "'Playfair Display', serif" }}>Delivery Details</h2>
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.95rem' }}>Provide your shipping address to complete the order.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Plot / Door No.</label>
              <input
                type="text"
                required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
                value={address.plotNo}
                onChange={e => setAddress({ ...address, plotNo: e.target.value })}
                placeholder="e.g. 12/A"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Phone Number</label>
              <input
                type="tel"
                required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
                value={address.phone}
                onChange={e => setAddress({ ...address, phone: e.target.value })}
                placeholder="Mobile Number"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Street Address</label>
            <input
              type="text"
              required
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
              value={address.street}
              onChange={e => setAddress({ ...address, street: e.target.value })}
              placeholder="e.g. MG Road, Area Name"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>City</label>
              <input
                type="text"
                required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
                value={address.city}
                onChange={e => setAddress({ ...address, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>State</label>
              <input
                type="text"
                required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
                value={address.state}
                onChange={e => setAddress({ ...address, state: e.target.value })}
                placeholder="State"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Pincode</label>
            <input
              type="text"
              required
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
              value={address.pincode}
              onChange={e => setAddress({ ...address, pincode: e.target.value })}
              placeholder="6-digit Pincode"
            />
          </div>

          <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '12px', border: '1px solid #fde68a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.95rem' }}>
              <span style={{ color: '#92400e', fontWeight: '600' }}>Order Total:</span>
              <span style={{ fontWeight: '800', color: '#92400e' }}>₹{total.toLocaleString()}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#b45309', margin: 0 }}>This will open WhatsApp to share your order & address.</p>
          </div>

          <button type="submit" style={{
            marginTop: '8px',
            padding: '16px',
            borderRadius: '12px',
            background: '#ff003c',
            color: 'white',
            border: 'none',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.2s'
          }}
            onMouseOver={e => e.currentTarget.style.background = '#d60032'}
            onMouseOut={e => e.currentTarget.style.background = '#ff003c'}
          >
            Send Order on WhatsApp <ArrowRight size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AccountModal = ({ isOpen, onClose, currentUser, products }) => {
  if (!isOpen || !currentUser) return null;

  const likedProducts = products.filter(p => {
    const pid = (p.id || p._id || '').toString();
    return currentUser.likedProducts?.some(liked => {
      const likedId = (typeof liked === 'string' ? liked : (liked?._id || liked?.id || liked))?.toString();
      return likedId === pid;
    });
  });
  const cartItems = currentUser.cart || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '600px', width: '95%' }}
      >
        <button className="modal-close" onClick={onClose}><X /></button>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#0f172a', color: '#ff003c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem', fontWeight: 'bold' }}>
            {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>{currentUser.fullName}</h2>
          <p style={{ color: '#64748b' }}>@{currentUser.username || 'user'}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#ef4444' }}>
              <Heart size={20} fill="#ef4444" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Wishlist</h3>
            </div>
            {likedProducts.length > 0 ? (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {likedProducts.map(p => (
                  <div key={p.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', background: 'white', padding: '8px', borderRadius: '8px' }}>
                    <img src={p.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#0f172a' }}>{p.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No items liked yet.</p>
            )}
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#ff003c' }}>
              <ShoppingCart size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Cart</h3>
            </div>
            {cartItems.length > 0 ? (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {cartItems.map(item => {
                  const p = products.find(prod => (prod.id || prod._id) === item.productId);
                  return (
                    <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', background: 'white', padding: '8px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <img src={p?.image || ''} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                        <div>
                          <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>{p?.name || 'Product'}</p>
                          <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Your cart is empty.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: '/images/hero_bags_travel.png',
      subtitle: 'Bags & Travel Accessories',
      title: 'Travel in Style',
      description: 'Laptop bags, jute totes, wallets & umbrellas — perfect branded travel companions.'
    },
    {
      image: '/images/hero_office_desktop.png',
      subtitle: 'Office & Desktop Accessories',
      title: 'Desk Essentials',
      description: 'Pen stands, desk clocks, mobile stands & clipboards — elevate every workspace.'
    },
    {
      image: '/images/hero_writing_stationery.png',
      subtitle: 'Writing & Stationery',
      title: 'Write with Purpose',
      description: 'Premium pens, designer notebooks, diaries & card holders for the discerning professional.'
    },
    {
      image: '/images/hero_tech_electronics.png',
      subtitle: 'Tech & Electronic Accessories',
      title: 'Smart Tech Gifts',
      description: 'Power banks, speakers, USB pendrives & charging stands for the modern professional.'
    },
    {
      image: '/images/hero_drinkware_kitchen.png',
      subtitle: 'Drinkware & Kitchen Items',
      title: 'Sip in Style',
      description: 'Custom bottles, ceramic mugs, hip flasks & bar sets — gifts they\'ll cherish daily.'
    },
    {
      image: '/images/hero_home_decor.png',
      subtitle: 'Home Decor & Decorative Items',
      title: 'Decorate with Grace',
      description: 'Photo frames, aroma candles, flower vases & show pieces for beautiful spaces.'
    },
    {
      image: '/images/hero_lighting_products.png',
      subtitle: 'Lighting Products',
      title: 'Brighten Every Moment',
      description: 'Solar lamps, rechargeable touch lamps & stylish torches — illuminate your brand.'
    },
    {
      image: '/images/hero_keychains_accessories.png',
      subtitle: 'Keychains & Small Accessories',
      title: 'Small Yet Memorable',
      description: 'Premium metal keychains, key rings & hangers — compact gifts with big impact.'
    },
    {
      image: '/images/hero_gift_sets.png',
      subtitle: 'Gift Sets',
      title: 'Premium Gift Sets',
      description: 'Executive gift sets, festive hampers & luxury combos — the art of gifting, perfected.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="hero-background"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2 },
            scale: { duration: 6, ease: "linear" }
          }}
          style={{ backgroundImage: `url("${slides[currentSlide].image}")` }}
        />
      </AnimatePresence>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="hero-content"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="hero-subtitle">{slides[currentSlide].subtitle}</span>
            <h1 className="hero-title-big">{slides[currentSlide].title}</h1>
            <p className="hero-desc">
              {slides[currentSlide].description}
            </p>
            <button className="hero-btn-gold">
              Explore Collection <ArrowRight size={24} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Glass Stat Cards */}
      <div style={{
        position: 'absolute',
        bottom: '120px',
        right: '5%',
        zIndex: 15,
        display: 'flex',
        gap: '16px',
      }} className="hero-stats-desktop">
        {[
          { value: '500+', label: 'Products' },
          { value: '9', label: 'Categories' },
          { value: '★', label: 'Premium' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.2, duration: 0.6 }}
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              padding: '20px 28px',
              textAlign: 'center',
              minWidth: '110px',
            }}
          >
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ff003c', lineHeight: 1, marginBottom: '6px', fontFamily: "'Outfit', sans-serif" }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Slide counter */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        right: '5%',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.85rem',
        fontWeight: '600',
        fontFamily: "'Outfit', sans-serif"
      }}>
        <span style={{ color: '#ff003c', fontSize: '1.2rem', fontWeight: '800' }}>{String(currentSlide + 1).padStart(2, '0')}</span>
        <span style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
        <span>{String(slides.length).padStart(2, '0')}</span>
      </div>

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Truck className="feature-icon" />,
      title: 'Free Delivery',
      description: 'On orders above ₹50,000'
    },
    {
      icon: <ShieldCheck className="feature-icon" />,
      title: 'Warranty',
      description: 'Up to 10 years warranty'
    },
    {
      icon: <Award className="feature-icon" />,
      title: 'Premium Quality',
      description: '100% genuine premium materials'
    },
    {
      icon: <TrendingUp className="feature-icon" />,
      title: 'Best Prices',
      description: 'Biggest store, biggest savings'
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="feature-item"
            >
              <div className="feature-icon-wrapper">
                {React.cloneElement(feature.icon, { size: 40 })}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Categories = ({ onCategoryClick, products }) => {
  const knownCategories = [
    'Bags & Travel Accessories',
    'Office & Desktop Accessories',
    'Writing & Stationery',
    'Tech & Electronic Accessories',
    'Drinkware & Kitchen Items',
    'Home Decor & Decorative Items',
    'Lighting Products',
    'Keychains & Small Accessories',
    'GIFT SETS'
  ];

  const categoryImages = {
    'Bags & Travel Accessories': 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop',
    'Office & Desktop Accessories': 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=800&auto=format&fit=crop',
    'Writing & Stationery': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
    'Tech & Electronic Accessories': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop',
    'Drinkware & Kitchen Items': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
    'Home Decor & Decorative Items': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
    'Lighting Products': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop',
    'Keychains & Small Accessories': 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800&auto=format&fit=crop',
    'GIFT SETS': 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop',
    'Others': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'
  };

  const getCategoryCount = (catName) => {
    if (!products) return 0;
    return products.filter(p => {
      let mainCat = (p.mainCategory || getMainCategoryForSub(p.category) || 'Others').toLowerCase().trim();
      const sectionName = catName.toLowerCase().trim();

      const isKnown = knownCategories.some(kc => kc.toLowerCase().trim() === mainCat);

      if (sectionName === 'others') {
        return !isKnown || mainCat === 'others';
      }
      return mainCat === sectionName;
    }).length;
  };

  const categoriesList = knownCategories.map(name => ({
    name,
    image: categoryImages[name],
    count: `${getCategoryCount(name)} Items`
  }));

  const othersCount = getCategoryCount('Others');
  if (othersCount > 0) {
    categoriesList.push({
      name: 'Others',
      image: categoryImages['Others'],
      count: `${othersCount} Items`
    });
  }

  const categories = categoriesList;

  const sliderItems = categories.map(cat => ({
    id: cat.name,
    url: cat.image,
    title: cat.name,
    count: cat.count
  }));

  return (
    <section className="section-padding section-bg-accent" id="catalog" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Decorative background elements */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 0, 60,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 0, 60,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container-fluid" style={{ maxWidth: '100%', padding: '0 2rem' }}>
        {/* Enhanced heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #ff003c 0%, #d60032 100%)',
            color: 'white',
            padding: '6px 20px',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '20px',
            fontFamily: "'Outfit', sans-serif"
          }}>Curated Collections</span>
          <h2 style={{ fontSize: '3.2rem', marginBottom: '16px', color: '#0f172a' }}>Shop by Category</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #ff003c)' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff003c' }} />
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #ff003c, transparent)' }} />
          </div>
          <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '500px', margin: '0 auto', fontFamily: "'Outfit', sans-serif" }}>Explore our handpicked premium gift categories</p>
        </motion.div>

        <AngledSlider
          items={sliderItems}
          onItemClick={onCategoryClick}
          containerHeight="500px"
          cardWidth="320px"
          speed={30}
        />
      </div>
    </section>
  );
};

const ProductDetails = ({ product, onBack, onLikeClick, onCartClick, onBuyNowClick }) => {
  const [activeImage, setActiveImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const stockCount = product.stock !== undefined ? product.stock : 50;

  useEffect(() => {
    setActiveImage(product.image);
  }, [product.image]);

  const handleDec = () => setQuantity(prev => Math.max(1, prev - 1));
  const handleInc = () => setQuantity(prev => Math.min(stockCount, prev + 1));

  const mainCat = product.mainCategory || getMainCategoryForSub(product.category);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const galleryImages = [product.image, ...(product.insideImages || [])].filter(Boolean);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '120px 20px 60px', fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px',
            color: '#64748b', fontSize: '1rem', fontWeight: '500', cursor: 'pointer',
            marginBottom: '32px', transition: 'color 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.color = '#0f172a'}
          onMouseOut={e => e.currentTarget.style.color = '#64748b'}
        >
          <ChevronLeft size={20} /> Back to {mainCat ? mainCat : 'Products'}
        </button>

        <div className="product-details-grid">
          {/* Left – Image and Gallery */}
          <div>
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              aspectRatio: '1/1',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <img
                src={optimizeCloudinaryUrl(activeImage, 1200, 'auto:best') || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80"}
                alt={product.name || "Gift Set"}
                loading="eager"
                decoding="async"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))',
                  transition: 'opacity 0.3s'
                }}
              />
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '12px'
              }}>
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: activeImage === img ? '2px solid #ff003c' : '2px solid transparent',
                      cursor: 'pointer',
                      background: 'white',
                      padding: '4px',
                      boxShadow: activeImage === img ? '0 0 0 1px #ff003c' : '0 2px 4px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <img src={optimizeCloudinaryUrl(img, 200)} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right – Info */}
          <div>
            {/* Category breadcrumb */}
            {(mainCat || product.category) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {mainCat && <span style={{ background: '#fef3c7', color: '#d60032', fontSize: '0.75rem', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{mainCat}</span>}
                {mainCat && product.category && <span style={{ color: '#cbd5e1' }}>›</span>}
                {product.category && <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>{product.category}</span>}
              </div>
            )}

            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px', lineHeight: 1.2, fontFamily: "'Playfair Display', serif" }}>
              {product.name || 'Exclusive Gift Set'}
            </h1>

            {/* Dynamic star ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[1, 2, 3, 4, 5].map(star => {
                  const rating = product.ratings || 4.8;
                  const filled = star <= Math.floor(rating);
                  const half = !filled && star <= rating + 0.5;
                  return <Star key={star} size={18} fill={filled ? '#ff003c' : 'none'} color={filled || half ? '#ff003c' : '#cbd5e1'} />;
                })}
              </div>
              <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{product.ratings || 4.8}</span>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>(124 reviews)</span>
            </div>

            {/* Price block removed */}

            {/* Description */}
            {product.description && (
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Product Description</h3>
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7', margin: 0, paddingLeft: '14px', borderLeft: '3px solid #ff003c', whiteSpace: 'pre-line' }}>
                  {product.description}
                </p>
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 0 28px' }} />

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Features</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {product.features.map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '0.9rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff003c', display: 'inline-block', flexShrink: 0 }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inside Gallery Section */}
            {product.insideImages && product.insideImages.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Inside Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {product.insideImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      style={{
                        aspectRatio: '1/1',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                      }}
                    >
                      <img src={optimizeCloudinaryUrl(img, 600)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Gallery ${idx}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specs */}
            {(product.material || product.style || product.width > 0 || product.height > 0 || product.depth > 0) && (
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Specifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
                  {product.material && (
                    <div style={{ padding: '4px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>Material</div>
                      <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>{product.material}</div>
                    </div>
                  )}
                  {product.style && (
                    <div style={{ padding: '4px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>Style</div>
                      <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>{product.style}</div>
                    </div>
                  )}
                  {product.height > 0 && (
                    <div style={{ padding: '4px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>Height</div>
                      <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>{product.height}"</div>
                    </div>
                  )}
                  {product.width > 0 && (
                    <div style={{ padding: '4px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>Width</div>
                      <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>{product.width}"</div>
                    </div>
                  )}
                  {product.depth > 0 && (
                    <div style={{ padding: '4px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>Bottom Patty</div>
                      <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>{product.depth}"</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
              {[{ icon: <Truck size={20} color="#ff003c" />, label: 'Free Delivery' }, { icon: <Shield size={20} color="#ff003c" />, label: 'Warranty' }, { icon: <Award size={20} color="#ff003c" />, label: 'Premium Quality' }].map(({ icon, label }) => (
                <div key={label} style={{ background: '#fffbf0', padding: '12px 6px', borderRadius: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', border: '1px solid #fde68a' }}>
                  {icon}
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#0f172a' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Quantity row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <button onClick={handleDec} style={{ width: '38px', height: '42px', background: 'white', border: 'none', fontSize: '1.1rem', color: '#64748b', cursor: 'pointer' }}>−</button>
                <div style={{ width: '44px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', fontWeight: '700', fontSize: '0.9rem', color: '#0f172a', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>{quantity}</div>
                <button onClick={handleInc} style={{ width: '38px', height: '42px', background: 'white', border: 'none', fontSize: '1.1rem', color: '#64748b', cursor: 'pointer' }}>+</button>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: stockCount > 0 ? '#16a34a' : '#ef4444' }}>
                {stockCount > 0 ? '✓ In Stock' : '✕ Out of Stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => onCartClick && onCartClick(product, quantity)}
                style={{ flex: 1, padding: '14px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#0f172a', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}>
                <ShoppingCart size={18} style={{ marginRight: '8px' }} /> Add to Cart
              </button>
              <button
                onClick={() => onBuyNowClick && onBuyNowClick(product, quantity)}
                style={{ flex: 1.2, padding: '14px', borderRadius: '8px', border: 'none', background: '#ff003c', color: 'white', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#d60032'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#ff003c'}>
                Buy Now
              </button>
              <button
                onClick={() => onLikeClick && onLikeClick(product)}
                style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: (product.liked || false) ? '#ef4444' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                onMouseOut={e => e.currentTarget.style.color = (product.liked || false) ? '#ef4444' : '#64748b'}>
                <Heart size={20} fill={(product.liked || false) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, index, onClick, onLikeClick, onCartClick }) => {
  const inStock = product.stock !== undefined ? product.stock > 0 : true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="uiverse-product-card"
      onClick={() => onClick && onClick(product)}
    >

      <button
        className="uiverse-wishlist"
        onClick={(e) => {
          e.stopPropagation();
          onLikeClick && onLikeClick(product);
        }}
      >
        <Heart
          size={18}
          fill={(product.liked || false) ? '#ef4444' : 'none'}
          color={(product.liked || false) ? '#ef4444' : '#94a3b8'}
        />
      </button>

      <img
        src={optimizeCloudinaryUrl(product.image, 600, 'auto:good') || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80"}
        alt={product.name}
        className="uiverse-card-image"
        style={{ filter: inStock ? 'none' : 'grayscale(100%)' }}
      />

      <div className="uiverse-card-text">
        <span>{product.name}</span>
      </div>

      <div className="uiverse-actions">
        <button
          className="uiverse-action-btn btn-cart"
          onClick={(e) => {
            e.stopPropagation();
            if (inStock && onCartClick) onCartClick(product, 1);
          }}
        >
          <ShoppingCart size={16} /> Cart
        </button>
        <button
          className="uiverse-action-btn btn-whatsapp"
          onClick={(e) => {
            e.stopPropagation();
            const message = `*Product Enquiry* 🎁\n\n*Name:* ${product.name}\n*Price:* ₹${product.price}\n*Image:* ${product.image || 'N/A'}\n\nHi! I'm interested in this product. Can you provide more details?`;
            window.open(`https://wa.me/918883888907?text=${encodeURIComponent(message)}`, '_blank');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12.01 2.01a10.003 10.003 0 0 0-8.52 15.28L2 22l4.87-1.46A9.957 9.957 0 0 0 12.01 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm.01 18.25c-1.63 0-3.19-.43-4.57-1.25l-3.26.98.98-3.21C4.4 15.42 4.02 13.78 4.02 12A8.01 8.01 0 0 1 12.02 4c4.41 0 8 3.59 8 8s-3.59 8-8 8zm4.33-5.59c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.61.77-.75.93-.14.16-.28.18-.52.06a6.52 6.52 0 0 1-1.92-1.19c-.58-.51-1.02-1.15-1.14-1.39-.12-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.23-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.41-.54-.42H8.72c-.16 0-.41.06-.62.3-.21.24-.81.79-.81 1.93 0 1.14.83 2.24.94 2.4.11.16 1.63 2.49 3.96 3.5.55.24 1.05.39 1.48.5.55.15 1.06.13 1.46.08.45-.06 1.4-.57 1.6-1.13.2-.56.2-.104.14-.114-.06-.02-.22-.06-.46-.18z" />
          </svg>
          Enquire
        </button>
      </div>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', height: '100%' }}>
    <div className="skeleton" style={{ height: '240px', width: '100%' }}></div>
    <div style={{ padding: '24px' }}>
      <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '16px' }}></div>
      <div className="skeleton" style={{ height: '28px', width: '90%', marginBottom: '16px' }}></div>
      <div className="skeleton" style={{ height: '32px', width: '40%', marginBottom: '24px' }}></div>
      <div className="skeleton" style={{ height: '48px', width: '100%', borderRadius: '8px' }}></div>
    </div>
  </div>
);

const FeaturedProducts = ({ products, loading, onProductClick, onCategoryClick, onLikeClick, onCartClick }) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const categories = [...Object.keys(categoryStructure), 'Others'];

  if (loading && products.length === 0) {
    return (
      <section className="section-padding">
        <div className="container">
          <div style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', display: 'grid', gap: '24px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding collection-bg" id="new-arrivals">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <span style={{
            display: 'inline-block',
            background: 'rgba(255, 0, 60, 0.1)',
            color: '#ff003c',
            padding: '6px 20px',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '20px',
            border: '1px solid rgba(255, 0, 60, 0.2)',
            fontFamily: "'Outfit', sans-serif"
          }}>Premium Range</span>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '16px', color: 'white', fontFamily: "'Playfair Display', serif" }}>Explore Our Collection</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #ff003c)' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff003c' }} />
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #ff003c, transparent)' }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Discover our wide variety of customizable corporate and personal gifts</p>
        </motion.div>
        {categories.map((category) => {
          const knownCategoryNames = Object.keys(categoryStructure);
          const allCategoryProducts = products
            .filter(product => {
              const mainCat = (product.mainCategory || getMainCategoryForSub(product.category) || 'Others').toLowerCase().trim();
              const sectionName = category.toLowerCase().trim();

              const isKnown = knownCategoryNames.some(kc => kc.toLowerCase().trim() === mainCat);

              if (sectionName === 'others') {
                return !isKnown || mainCat === 'others';
              }
              return mainCat === sectionName;
            })
            .sort((a, b) => {
              // Custom Priority: Laptop Bags/Anutica > General Bags > Jute Bags > Umbrellas
              const getRank = (p) => {
                const cat = (p.category || '').toLowerCase();
                const name = (p.name || '').toLowerCase();
                if (cat.includes('laptop') || name.includes('laptop') || name.includes('anutica')) return 1;
                if (cat.includes('bag') && !cat.includes('jute')) return 2;
                if (cat.includes('jute')) return 3;
                if (cat.includes('umbrella')) return 4;
                return 5;
              };

              const rankA = getRank(a);
              const rankB = getRank(b);
              if (rankA !== rankB) return rankA - rankB;

              const pA = a.priority ?? 999;
              const pB = b.priority ?? 999;
              if (pA !== pB) return pA - pB;
              return (b.id || b._id) > (a.id || a._id) ? 1 : -1;
            });

          if (allCategoryProducts.length === 0) return null;

          const isExpanded = !!expandedCategories[category];
          const visibleProducts = isExpanded ? allCategoryProducts : allCategoryProducts.slice(0, 3);
          const hasMore = allCategoryProducts.length > 3;

          return (
            <div key={category} style={{ marginBottom: '64px' }}>
              <div className="section-header">
                <div>
                  <span className="font-bold uppercase tracking-widest" style={{ fontSize: '0.875rem', marginBottom: '8px', display: 'block', color: 'var(--accent)' }}>Collections</span>
                  <h2 style={{ fontSize: '2rem', color: 'white' }}>{category}</h2>
                </div>
                {hasMore && (
                  <button
                    onClick={() => onCategoryClick && onCategoryClick(category)}
                    className="view-all-btn"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'transparent', border: '2px solid #ff003c',
                      color: '#ff003c', borderRadius: '8px', padding: '8px 18px',
                      fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#ff003c'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ff003c'; }}
                  >
                    View All ({allCategoryProducts.length}) <ArrowRight size={16} />
                  </button>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '24px'
              }}>
                {visibleProducts.map((product, index) => (
                  <ProductCard key={product.id || index} product={product} index={index} onClick={onProductClick} onLikeClick={onLikeClick} onCartClick={onCartClick} />
                ))}

                {!isExpanded && hasMore && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: 'white',
                      borderRadius: '16px',
                      border: '2px dashed #ff003c',
                      padding: '24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      minHeight: '380px'
                    }}
                    whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(255, 0, 60,0.15)' }}
                    onClick={() => onCategoryClick && onCategoryClick(category)}
                  >
                    <div style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                      color: '#d60032'
                    }}>
                      <ArrowRight size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                      +{allCategoryProducts.length - 3} More Products
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '20px' }}>
                      Explore our full {category} range
                    </p>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#ff003c',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '0.875rem'
                    }}>
                      View More Products <ArrowRight size={16} />
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const WishlistPage = ({ products, currentUser, loading, onProductClick, onBack, onLikeClick, onCartClick }) => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const likedProducts = products.filter(p => {
    const pid = (p.id || p._id || '').toString();
    return currentUser?.likedProducts?.some(liked => {
      const likedId = (typeof liked === 'string' ? liked : (liked?._id || liked?.id || liked))?.toString();
      return likedId === pid;
    });
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '160px 0 40px' }}>
        <div className="container">
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 16px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', marginBottom: '24px' }}>
            <ChevronLeft size={18} /> Back to Home
          </button>
          <span style={{ color: '#ef4444', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Your Collection</span>
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Wishlist</h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>{loading ? 'Loading...' : `${likedProducts.length} items you love`}</p>
        </div>
      </div>
      <div className="container" style={{ padding: '48px 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>Loading your wishlist...</div>
        ) : likedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ marginBottom: '24px', color: '#cbd5e1' }}><Heart size={64} /></div>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '12px' }}>Your wishlist is empty</h2>
            <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '24px' }}>Start adding items you love to find them here easily!</p>
            <button onClick={onBack} style={{ padding: '12px 24px', background: '#ff003c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Explore Products</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
            {likedProducts.map((product, index) => {
              const image = product.images?.[0] || product.image || '';
              return (
                <div key={product.id || index} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' }}>
                  <div onClick={() => onProductClick(product)} style={{ aspectRatio: '4/3', overflow: 'hidden', cursor: 'pointer', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {image && <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />}
                  </div>
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <p style={{ fontSize: '0.73rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>{product.category}</p>
                      <h3 onClick={() => onProductClick(product)} style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', cursor: 'pointer', margin: 0 }}>{product.name}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ff003c' }}>₹{product.price}</span>
                      {product.comparePrice > product.price && <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{product.comparePrice}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <button onClick={() => onCartClick(product)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#ff003c', color: 'white', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <ShoppingCart size={15} /> Add to Cart
                      </button>
                      <button onClick={() => onLikeClick(product)} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fff5f5', color: '#ef4444', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} title="Remove from wishlist">
                        <Heart size={15} fill="#ef4444" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const CartPage = ({ products, currentUser, loading, onProductClick, onBack, onRemoveCartItem, onUpdateCartQty, onCheckout }) => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const cartItems = (currentUser?.cart || []).map(item => {
    const pid = (item.productId?._id || item.productId)?.toString();
    const product = products.find(p => (p.id || p._id)?.toString() === pid);
    return { ...item, product, pid };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const deliveryFee = subtotal >= 999 ? 0 : 99;
  const total = subtotal + deliveryFee;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '160px 0 40px' }}>
        <div className="container">
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 16px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', marginBottom: '24px' }}>
            <ChevronLeft size={18} /> Back to Home
          </button>
          <span style={{ color: '#ff003c', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Your Order</span>
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Shopping Cart</h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>{loading ? 'Loading...' : `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in your cart`}</p>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>Loading your cart...</div>
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ marginBottom: '24px', color: '#cbd5e1' }}><ShoppingCart size={64} /></div>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '12px' }}>Your cart is empty</h2>
            <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '24px' }}>Discover our premium gift collections and start adding items!</p>
            <button onClick={onBack} style={{ padding: '12px 24px', background: '#ff003c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Shop Now</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: '32px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map(item => {
                const p = item.product;
                const image = p.images?.[0] || p.image || '';
                return (
                  <div key={item.pid} style={{ background: 'white', borderRadius: '16px', padding: '20px', display: 'flex', gap: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', alignItems: 'center' }}>
                    <div onClick={() => onProductClick(p)} style={{ width: '88px', height: '88px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', cursor: 'pointer', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {image && <img src={image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '3px' }}>{p.category}</p>
                      <h3 onClick={() => onProductClick(p)} style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h3>
                      <p style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ff003c', margin: 0 }}>₹{(p.price * item.quantity).toLocaleString()} <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '400' }}>( ₹{p.price} × {item.quantity} )</span></p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <button onClick={() => onUpdateCartQty(item.pid, item.quantity - 1)} style={{ width: '34px', height: '34px', background: '#f8fafc', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#64748b', fontWeight: '700' }}>−</button>
                        <span style={{ width: '38px', textAlign: 'center', fontWeight: '700', fontSize: '0.9rem', color: '#0f172a', lineHeight: '34px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>{item.quantity}</span>
                        <button onClick={() => onUpdateCartQty(item.pid, item.quantity + 1)} style={{ width: '34px', height: '34px', background: '#f8fafc', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#64748b', fontWeight: '700' }}>+</button>
                      </div>
                      <button onClick={() => onRemoveCartItem(item.pid)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fff5f5', color: '#ef4444', fontWeight: '600', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', position: 'sticky', top: '120px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b' }}>
                  <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>₹{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b' }}>
                  <span>Delivery</span>
                  <span style={{ color: deliveryFee === 0 ? '#16a34a' : '#0f172a', fontWeight: '600' }}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                  <span>Total</span>
                  <span style={{ color: '#ff003c' }}>₹{total.toLocaleString()}</span>
                </div>
              </div>
              {subtotal < 999 && <p style={{ fontSize: '0.78rem', color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px 12px', marginBottom: '16px' }}>Add ₹{(999 - subtotal).toLocaleString()} more for FREE delivery!</p>}
              <button onClick={() => onCheckout(cartItems)} style={{ width: '100%', padding: '14px', background: '#ff003c', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', marginBottom: '10px' }}>Proceed to Checkout →</button>
              <button onClick={onBack} style={{ width: '100%', padding: '11px', background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>Continue Shopping</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryPage = ({ category, products, loading, onProductClick, onBack, onLikeClick, onCartClick }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category]);

  const knownCategoryNames = Object.keys(categoryStructure);
  const categoryProducts = products
    .filter(product => {
      const mainCat = (product.mainCategory || getMainCategoryForSub(product.category) || 'Others').toLowerCase().trim();
      const sectionName = category.toLowerCase().trim();

      const isKnown = knownCategoryNames.some(kc => kc.toLowerCase().trim() === mainCat);

      if (sectionName === 'others') {
        return !isKnown || mainCat === 'others';
      }
      return mainCat === sectionName;
    })
    .sort((a, b) => {
      const pA = a.priority ?? 999;
      const pB = b.priority ?? 999;
      if (pA !== pB) return pA - pB;
      return b.id > a.id ? 1 : -1;
    });

  return (
    <div className="collection-bg" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255, 0, 60,0.15)', padding: '160px 0 40px' }}>
        <div className="container">
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px', padding: '8px 16px', fontWeight: '600',
              fontSize: '0.875rem', cursor: 'pointer', marginBottom: '24px'
            }}
          >
            <ChevronLeft size={18} /> Back to Home
          </button>
          <span style={{ color: '#ff003c', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Collections</span>
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>{category}</h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
            {loading ? 'Loading...' : `${categoryProducts.length} products found`}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container" style={{ padding: '48px 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b', fontSize: '1.125rem' }}>Loading products...</div>
        ) : categoryProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#64748b', fontSize: '1.125rem' }}>No products found in this category yet.</p>
            <button onClick={onBack} style={{ marginTop: '16px', padding: '12px 24px', background: '#ff003c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Back to Home</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '28px' }}>
            {categoryProducts.map((product, index) => (
              <ProductCard key={product.id || index} product={product} index={index} onClick={onProductClick} onLikeClick={onLikeClick} onCartClick={onCartClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AboutPage = ({ onBack }) => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const stats = [
    { label: 'Quality Standards', icon: <ShieldCheck size={32} /> },
    { label: 'Timely Delivery', icon: <Clock size={32} /> },
    { label: 'Bulk Manufacturing', icon: <Package size={32} /> },
    { label: 'Custom Branding', icon: <PenTool size={32} /> },
  ];

  const productCategories = [
    { title: "Bags", items: ["Laptop Bags", "Sling Bags", "Travel Bags", "Office Bags", "Jute Bags", "Cotton Bags", "Shopping Bags"] },
    { title: "Accessories", items: ["Umbrellas", "Notebook & Diary Sets", "Office Gift Combos", "Promotional Products", "Wedding Thamboolam Bags"] }
  ];

  const whyChooseUs = [
    { title: "Premium Quality", desc: "Finest fabrics and meticulous stitching.", icon: <Shield size={24} />, grid: "span-2" },
    { title: "Custom Branding", desc: "Expert logo printing and packaging.", icon: <Edit size={24} />, grid: "span-1" },
    { title: "Eco-Friendly", desc: "Sustainable Jute and Cotton options.", icon: <Sparkles size={24} />, grid: "span-1" },
    { title: "Bulk Support", desc: "Scalable manufacturing for any size.", icon: <Box size={24} />, grid: "span-2" },
    { title: "Wholesale Pricing", desc: "Competitive rates for maximum value.", icon: <TrendingUp size={24} />, grid: "span-1" },
    { title: "Timely Delivery", desc: "Strict adherence to your timelines.", icon: <Clock size={24} />, grid: "span-1" },
  ];

  return (
    <div className="about-page-wrapper">
      {/* Immersive Hero */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-hero-overlay" />

        <div className="container about-hero-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <span className="about-hero-tagline">Since 2010</span>
            <h1 className="about-hero-title">
              REDEFINING <br />
              <span className="text-accent">GIFTING.</span>
            </h1>
            <div className="about-hero-desc-wrapper">
              <div className="about-hero-line" />
              <p className="about-hero-desc">
                At Sri Sai Gifts, we craft products that don't just carry items—they carry your brand's reputation.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Floating Background Text */}
        <div className="about-hero-floating-text">
          QUALITY CRAFT
        </div>
      </section>

      {/* Our Philosophy - Split Section */}
      <section className="about-section-padding philosophy-section">
        <div className="container">
          <div className="about-philosophy-grid">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="about-philosophy-media"
            >
              <div className="about-philosophy-img-wrapper">
                <img src="/images/about_gifting.png" alt="Corporate Gifting" />
              </div>
              <div className="about-philosophy-glow" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="about-philosophy-content"
            >
              <span className="about-philosophy-label">OUR PHILOSOPHY</span>
              <h2 className="about-philosophy-title">
                Every Brand Tells a <span className="text-accent">Story.</span> We Help You Tell It.
              </h2>
              <p className="about-philosophy-text">
                We believe that every corporate gift is a silent ambassador for your business. That's why we meticulously combine modern design with industrial durability, ensuring that every bag and accessory we produce leaves a lasting mark of professionalism.
              </p>

              <div className="about-stats-grid">
                {stats.map((s, i) => (
                  <div key={i} className="about-stats-item">
                    <div className="about-stats-icon-wrapper">
                      {React.cloneElement(s.icon, { size: 20 })}
                    </div>
                    <span className="about-stats-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid - Why Choose Us */}
      <section className="about-section-padding why-choose-section">
        <div className="container">
          <div className="about-section-header">
            <h2 className="about-section-title">The Sri Sai <span className="text-accent">Advantage</span></h2>
            <p className="about-section-subtitle">
              What sets us apart in the world of corporate manufacturing and bespoke gifting.
            </p>
          </div>

          <div className="about-why-choose-grid">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                className={`about-why-choose-card ${item.grid === "span-2" ? "span-2" : "span-1"}`}
              >
                <div className="about-choose-icon">{item.icon}</div>
                <h3 className="about-choose-title">{item.title}</h3>
                <p className="about-choose-desc">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Universe */}
      <section className="about-section-padding spectrum-section">
        <div className="container">
          <div className="about-section-header">
            <span className="about-spectrum-label">OUR UNIVERSE</span>
            <h2 className="about-spectrum-title">Product Spectrum</h2>
          </div>

          <div className="about-spectrum-grid">
            {productCategories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="about-spectrum-card"
              >
                <h3 className="about-spectrum-card-title">{cat.title}</h3>
                <div className="about-spectrum-tags">
                  {cat.items.map((item, j) => (
                    <span key={j} className="about-spectrum-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-box">
            <div className="about-cta-glow" />

            <h2 className="about-cta-title">Let's Create Something <br /> Extraordinary Together.</h2>
            <p className="about-cta-desc">
              From startups to global corporations, we provide products that represent your business with style, quality, and professionalism.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="about-cta-btn"
            >
              Start Your Project
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

const ContactPage = ({ onBack }) => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', fontFamily: "'Outfit', sans-serif" }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
        padding: '160px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow blobs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'rgba(255, 0, 60,0.08)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '250px', height: '250px', background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(80px)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '999px', padding: '8px 20px',
            marginBottom: '28px', color: '#e2e8f0', fontSize: '0.8rem',
            fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase'
          }}>
            <span style={{ fontSize: '1rem' }}>💬</span> We'd love to hear from you
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '900', color: 'white', lineHeight: 1.1, marginBottom: '20px' }}>
            Let's <span style={{ color: '#ff003c' }}>Connect</span>
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Have a question, a custom order, or just want to say hello? Our team is ready to help you create your dream home.
          </p>
        </motion.div>
      </div>

      {/* Info Cards */}
      <div className="contact-header-cards">
        {[
          {
            icon: (
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#fff9ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={24} color="#ff003c" />
              </div>
            ),
            label: 'VISIT SHOWROOM',
            title: '212, W Masi St, Periyar, Madurai Main',
            sub: 'Madurai, Tamil Nadu 625001'
          },
          {
            icon: (
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#f0fff4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={24} color="#22c55e" />
              </div>
            ),
            label: 'CALL US',
            title: '+91 88838 88907',
            sub: ''
          },
          {
            icon: (
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={24} color="#6366f1" />
              </div>
            ),
            label: 'EMAIL US',
            title: 'srisaibags.digital',
            sub: '@gmail.com'
          },
          {
            icon: (
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={24} color="#ef4444" />
              </div>
            ),
            label: 'WORKING HOURS',
            title: 'Mon – Sat',
            sub: '9:00 AM – 7:00 PM'
          }
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '28px 24px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}
          >
            {card.icon}
            <p style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1.5px', marginTop: '16px', marginBottom: '8px', textTransform: 'uppercase' }}>{card.label}</p>
            <p style={{ color: '#0f172a', fontSize: '1.15rem', fontWeight: '700', marginBottom: '4px', lineHeight: 1.3 }}>{card.title}</p>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Form + Map Section */}
      <div className="contact-container" style={{ background: '#f8fafc' }}>
        <div className="contact-grid">
          {/* LEFT – Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p style={{ color: '#ff003c', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>SEND A MESSAGE</p>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginBottom: '10px', lineHeight: 1.2 }}>We'll Reply Within 24 Hours</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '28px', lineHeight: 1.7 }}>
              Fill in the form below and our team will get back to you as soon as possible.
            </p>

            <form
              onSubmit={e => {
                e.preventDefault();
                alert("Message sent! We'll get back to you within 24 hours.");
                e.target.reset();
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              {/* Row 1: Full Name + Email */}
              <div className="form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Rajan Kumar"
                    required
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '8px', boxSizing: 'border-box',
                      border: '1.5px solid #e2e8f0', fontSize: '0.9rem', color: '#0f172a',
                      outline: 'none', background: 'white', fontFamily: 'inherit'
                    }}
                    onFocus={e => e.target.style.borderColor = '#ff003c'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '8px', boxSizing: 'border-box',
                      border: '1.5px solid #e2e8f0', fontSize: '0.9rem', color: '#0f172a',
                      outline: 'none', background: 'white', fontFamily: 'inherit'
                    }}
                    onFocus={e => e.target.style.borderColor = '#ff003c'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              {/* Row 2: Phone + Subject */}
              <div className="form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 88838 88907"
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '8px', boxSizing: 'border-box',
                      border: '1.5px solid #e2e8f0', fontSize: '0.9rem', color: '#0f172a',
                      outline: 'none', background: 'white', fontFamily: 'inherit'
                    }}
                    onFocus={e => e.target.style.borderColor = '#ff003c'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Subject</label>
                  <select
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '8px', boxSizing: 'border-box',
                      border: '1.5px solid #e2e8f0', fontSize: '0.9rem', color: '#64748b',
                      outline: 'none', background: 'white', cursor: 'pointer', fontFamily: 'inherit'
                    }}
                    onFocus={e => e.target.style.borderColor = '#ff003c'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Select a topic...</option>
                    <option>General Inquiry</option>
                    <option>Custom Order</option>
                    <option>Bulk / Corporate Order</option>
                    <option>Product Information</option>
                    <option>Delivery & Shipping</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Message <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  placeholder="Tell us about your requirements or questions..."
                  required
                  rows={5}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: '8px', boxSizing: 'border-box',
                    border: '1.5px solid #e2e8f0', fontSize: '0.9rem', color: '#0f172a',
                    outline: 'none', background: 'white', resize: 'vertical',
                    lineHeight: 1.6, fontFamily: 'inherit'
                  }}
                  onFocus={e => e.target.style.borderColor = '#ff003c'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%', padding: '15px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ff003c 0%, #ff3366 100%)',
                  color: 'white', border: 'none', fontSize: '1rem',
                  fontWeight: '700', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: '0 6px 20px rgba(255, 0, 60,0.35)', fontFamily: 'inherit'
                }}
              >
                ➤ Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* RIGHT – Map + Business Card + Social */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Google Map Embed */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <iframe
                title="SRI SAI Gifts Showroom – Madurai Main, Madurai"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3930.213234492701!2d78.1131705750301!3d9.91619109018498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOcKwNTQnNTguMyJOIDc4wrAwNic1Ni43IkU!5e0!3m2!1sen!2sin!4v1779106304746!5m2!1sen!2sin"
                width="100%"
                height="290"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Dark Business Info Card */}
            <div className="info-card">
              <div style={{
                width: 48, height: 48, borderRadius: '16px',
                background: 'rgba(255, 0, 60,0.15)', border: '1px solid rgba(255, 0, 60,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <MapPin size={24} color="#ff003c" />
              </div>
              <div>
                <h3 style={{ color: 'white', fontWeight: '800', fontSize: '1.15rem', marginBottom: '8px' }}>SRI SAI Gifts Showroom</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '4px' }}>212, W Masi St, Periyar, Madurai Main</p>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Madurai, Tamil Nadu 625001</p>
              </div>
            </div>

            {/* Follow Us */}
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Follow Us</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Instagram', icon: <Instagram size={15} />, color: '#e1306c', bg: '#fff0f5', border: '#fbc8d9' },
                  { label: 'Facebook', icon: <Facebook size={15} />, color: '#1877f2', bg: '#f0f5ff', border: '#c3d6ff' },
                  { label: 'Twitter', icon: <Twitter size={15} />, color: '#1da1f2', bg: '#f0faff', border: '#b3e4ff' },
                ].map(s => (
                  <motion.a
                    key={s.label}
                    href="#"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '9px 16px', borderRadius: '999px',
                      background: s.bg, border: `1.5px solid ${s.border}`,
                      color: s.color, fontWeight: '600', fontSize: '0.82rem',
                      textDecoration: 'none'
                    }}
                  >
                    {s.icon} {s.label}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Back button */}
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 32px', borderRadius: '999px',
            background: '#0f172a', color: 'white', border: 'none',
            fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.background = '#1e293b'}
          onMouseOut={e => e.currentTarget.style.background = '#0f172a'}
        >
          <ChevronLeft size={18} /> Back to Home
        </button>
      </div>
    </div>
  );
};

const CataloguePage = ({ onBack }) => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const catalogs = [
    {
      title: "Executive Gift Sets",
      description: "Explore our collection of corporate gift sets and executive hampers. Ideal for corporate branding, executive appreciation, and festive corporate events. Features combinations of executive planners, premium writing sets, cardholders, and digital power products.",
      icon: <Gift size={28} color="#ff003c" />,
      iconBg: "rgba(255, 0, 60, 0.08)",
      fileSize: "42.9 MB",
      fileName: "gift_set_catalogue.pdf",
      downloadUrl: "/catalogs/gift_set_catalogue.pdf"
    },
    {
      title: "Sri Sai Keychains",
      description: "Discover a wide spectrum of corporate keychains, custom keyring holders, metal charms, and executive leather keyrings. Fully customizable with high-resolution logo engraving or custom screen printing for promotional events.",
      icon: <Key size={28} color="#22c55e" />,
      iconBg: "rgba(34, 197, 94, 0.08)",
      fileSize: "48.5 MB",
      fileName: "keychain_catalogue.pdf",
      downloadUrl: "/catalogs/keychain_catalogue.pdf"
    },
    {
      title: "Premium Jute Bags",
      description: "Eco-friendly Jute Bags, laptop totes, custom messenger shopping bags, and tiffin boxes. Expertly crafted with double-stitched reinforced padding, water-resistant interior lining, and customizable side panels for premium brand exposure.",
      icon: <Package size={28} color="#6366f1" />,
      iconBg: "rgba(99, 102, 241, 0.08)",
      fileSize: "38.6 MB",
      fileName: "jute_bags_catalogue.pdf",
      downloadUrl: "/catalogs/jute_bags_catalogue.pdf"
    },
    {
      title: "Sri Sai Bags Collection",
      description: "Our complete and comprehensive catalogue featuring a diverse range of premium bags, executive gifts, and custom promotional items. A showcase of our finest collections designed to meet all your corporate gifting needs.",
      icon: <Briefcase size={28} color="#f59e0b" />,
      iconBg: "rgba(245, 158, 11, 0.08)",
      fileSize: "89.4 MB",
      fileName: "sri_sai_bags.pdf",
      downloadUrl: "/catalogs/sri_sai_bags.pdf"
    }
  ];

  return (
    <div className="catalogue-page-wrapper">
      {/* Hero Header */}
      <div className="catalogue-hero">
        <div className="catalogue-hero-glow" />
        <div className="catalogue-hero-glow-2" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div className="catalogue-badge">
            <span style={{ fontSize: '1rem' }}>📖</span> Product Catalogues
          </div>

          <h1 className="catalogue-title">
            Our Brand <span style={{ color: '#ff003c' }}>Collections</span>
          </h1>

          <p className="catalogue-subtitle">
            Download our latest corporate catalogues to explore bulk gifting options, custom branding details, and pricing specifications.
          </p>
        </motion.div>
      </div>

      {/* Grid Content */}
      <div className="catalogue-container">
        <div className="catalogue-grid">
          {catalogs.map((catalog, index) => (
            <motion.div
              key={index}
              className="catalogue-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <div className="catalogue-icon-box" style={{ backgroundColor: catalog.iconBg }}>
                {catalog.icon}
              </div>

              <h3 className="catalogue-card-title">{catalog.title}</h3>
              <p className="catalogue-card-desc">{catalog.description}</p>

              <div className="catalogue-meta">
                <span>FORMAT: <strong className="catalogue-meta-value">PDF</strong></span>
                <span>SIZE: <strong className="catalogue-meta-value">{catalog.fileSize}</strong></span>
              </div>

              <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '10px' }}>
                <a
                  href={catalog.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="catalogue-view-btn"
                  style={{ flex: 1, margin: 0 }}
                >
                  <BookOpen size={18} /> View
                </a>
                <a
                  href={catalog.downloadUrl}
                  download={catalog.fileName}
                  className="catalogue-download-btn"
                  style={{ flex: 1, margin: 0 }}
                >
                  <Download size={18} /> Download
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Info Section */}
      <section className="catalogue-features-section">
        <h2 className="catalogue-features-title">Why Explore Our Catalogs?</h2>
        <div className="catalogue-features-grid">
          <div className="catalogue-feature-card">
            <div className="catalogue-feature-num">01</div>
            <h4 className="catalogue-feature-name">Logo Branding</h4>
            <p className="catalogue-feature-desc">
              All catalogue items support brand integrations, screen-printing, metal engraving, and custom hot stamping.
            </p>
          </div>
          <div className="catalogue-feature-card">
            <div className="catalogue-feature-num">02</div>
            <h4 className="catalogue-feature-name">Bulk Discounts</h4>
            <p className="catalogue-feature-desc">
              Get corporate pricing and wholesale discounts for custom orders over 100 units.
            </p>
          </div>
          <div className="catalogue-feature-card">
            <div className="catalogue-feature-num">03</div>
            <h4 className="catalogue-feature-name">Vast Variety</h4>
            <p className="catalogue-feature-desc">
              Over 500+ distinct configurations, colors, and premium packaging designs are available.
            </p>
          </div>
        </div>

        <div className="catalogue-back-container">
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '999px',
              background: '#0f172a',
              color: 'white',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#1e293b'}
            onMouseOut={e => e.currentTarget.style.background = '#0f172a'}
          >
            <ChevronLeft size={18} /> Back to Home
          </button>
        </div>
      </section>
    </div>
  );
};

const Newsletter = () => {
  return (
    <section className="newsletter-section">
      <div className="container">
        <motion.div
          className="newsletter-box"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Dot grid pattern overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255, 0, 60,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none', zIndex: 0 }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255, 0, 60, 0.1)',
              border: '1px solid rgba(255, 0, 60, 0.25)',
              color: '#ff003c',
              padding: '6px 20px',
              borderRadius: '50px',
              fontSize: '0.8rem',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '24px',
              fontFamily: "'Outfit', sans-serif"
            }}>Exclusive Access</span>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '16px' }}>Join the Luxe Circle</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #ff003c)' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#ff003c', transform: 'rotate(45deg)' }} />
              <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #ff003c, transparent)' }} />
            </div>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px', maxWidth: '550px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <div className="newsletter-form" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                style={{ fontSize: '1rem' }}
              />
              <button className="btn" style={{ padding: '14px 36px', background: 'linear-gradient(135deg, #ff003c, #d60032)', color: 'white', borderRadius: '50px', fontWeight: '700', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Subscribe</button>
            </div>
          </div>
          {/* Animated glow orbs */}
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255, 0, 60, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', animation: 'float-slow 15s ease-in-out infinite' }}></div>
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255, 0, 60, 0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', animation: 'float-slow 12s ease-in-out infinite reverse' }}></div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = ({ onHomeClick, onProductsClick, onAboutClick, onContactClick, onCatalogueClick }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <img src="/images/logo.png" alt="Sri Sai Gifts Logo" style={{ height: '40px', width: 'auto' }} />
            </div>
            <p style={{ color: '#94a3b8', marginBottom: '32px' }}>
              Your boutique destination for luxury gifts and exquisite accessories. Crafted with passion, delivered with love.
            </p>
            <div className="social-links">
              <div className="social-icon"><Instagram size={20} /></div>
              <div className="social-icon"><Facebook size={20} /></div>
              <div className="social-icon"><Twitter size={20} /></div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '24px', color: '#ff003c', fontWeight: '700' }}>Quick Links</h4>
            <ul className="footer-links">
              <li className="footer-link-item"><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onHomeClick(); window.scrollTo(0, 0); }}>Home</a></li>
              <li className="footer-link-item"><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onProductsClick(); window.scrollTo(0, 0); }}>Products</a></li>
              <li className="footer-link-item"><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onAboutClick ? onAboutClick() : (window.location.hash = '#about'); window.scrollTo(0, 0); }}>About Us</a></li>
              <li className="footer-link-item"><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onCatalogueClick && onCatalogueClick(); window.scrollTo(0, 0); }}>Catalogue</a></li>
              <li className="footer-link-item"><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onContactClick(); window.scrollTo(0, 0); }}>Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '24px', color: '#ff003c', fontWeight: '700' }}>Support</h4>
            <ul className="footer-links">
              <li className="footer-link-item"><a href="#" className="footer-link">Shipping Policy</a></li>
              <li className="footer-link-item"><a href="#" className="footer-link">Track Order</a></li>
              <li className="footer-link-item"><a href="#" className="footer-link">FAQs</a></li>
              <li className="footer-link-item"><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onContactClick(); window.scrollTo(0, 0); }}>Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '24px', color: '#ff003c', fontWeight: '700' }}>Contact Us</h4>
            <ul className="footer-links" style={{ color: '#f8fafc' }}>
              <li className="footer-link-item" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <MapPin size={20} color="#ff003c" style={{ flexShrink: 0 }} />
                212, W Masi St, Periyar, Madurai Main, Madurai, Tamil Nadu 625001
              </li>
              <li className="footer-link-item" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <Phone size={20} color="#ff003c" style={{ flexShrink: 0 }} />
                +91 88838 88907
              </li>
              <li className="footer-link-item" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Mail size={20} color="#ff003c" style={{ flexShrink: 0 }} />
                srisaibags.digital@gmail.com
              </li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #334155', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', color: '#94a3b8', fontSize: '0.875rem' }}>
          <p>© 2024 SRI SAI Gifts. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const AdminDashboard = ({ onLogout, products, setProducts }) => {
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'inStock', 'outOfStock'
  const [activeTab, setActiveTab] = useState('Inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageFileUpload = async (file) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setEditingProduct(prev => ({ ...prev, image: data.imageUrl }));
      }
    } catch (err) {
      alert('Upload failed. Please check your server and Cloudinary credentials.');
      console.error(err);
    } finally {
      setImageUploading(false);
    }
  };

  const handleInsideImageUpload = async (file) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setEditingProduct(prev => ({
          ...prev,
          insideImages: [...(prev.insideImages || []), data.imageUrl]
        }));
      }
    } catch (err) {
      alert('Upload failed. Please check your server and Cloudinary credentials.');
      console.error(err);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveInsideImage = (index) => {
    const newImages = [...(editingProduct.insideImages || [])];
    newImages.splice(index, 1);
    setEditingProduct({ ...editingProduct, insideImages: newImages });
  };

  const handleSaveProduct = async () => {
    try {
      if (!editingProduct) return;
      const { id, _id, ...rest } = editingProduct;

      // Strict data cleaning
      const normalizedBody = {
        ...rest,
        price: Number(String(editingProduct.price || 0).replace(/[^0-9.]/g, '')) || 0,
        comparePrice: Number(String(editingProduct.comparePrice || 0).replace(/[^0-9.]/g, '')) || 0,
        stock: parseInt(String(editingProduct.stock ?? 50).replace(/[^0-9]/g, '')) || 0,
        ratings: parseFloat(String(editingProduct.ratings || 4.8).replace(/[^0-9.]/g, '')) || 4.8,
        width: Number(String(editingProduct.width || 0).replace(/[^0-9.]/g, '')) || 0,
        height: Number(String(editingProduct.height || 0).replace(/[^0-9.]/g, '')) || 0,
        depth: Number(String(editingProduct.depth || 0).replace(/[^0-9.]/g, '')) || 0,
        priority: (function () {
          const val = parseInt(String(editingProduct.priority).replace(/[^0-9]/g, ''));
          return isNaN(val) ? 999 : val;
        })(),
        insideImages: Array.isArray(editingProduct.insideImages) ? editingProduct.insideImages : [],
        features: Array.isArray(editingProduct.features) ? editingProduct.features : []
      };

      if (!normalizedBody.name || !normalizedBody.mainCategory || !normalizedBody.category) {
        alert('Product name, Main Category, and Sub Category are all required fields.');
        return;
      }

      setImageUploading(true); // Reuse as a general "saving" indicator

      const res = await fetch(`/api/products/${editingProduct.id || ''}`, {
        method: editingProduct.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedBody)
      });

      const data = await res.json();
      if (data.success && data.product) {
        const updatedProduct = { ...data.product, id: data.product._id || data.product.id };
        if (editingProduct.id) {
          setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        } else {
          setProducts(prev => [updatedProduct, ...prev]);
        }
      } else {
        alert('Failed to save product: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product. Check your server connection.');
    } finally {
      setImageUploading(false);
      setEditingProduct(null);
    }
  };

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setEditingProduct({
        ...editingProduct,
        features: [...(editingProduct.features || []), newFeatureText.trim()]
      });
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...(editingProduct.features || [])];
    newFeatures.splice(index, 1);
    setEditingProduct({ ...editingProduct, features: newFeatures });
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  // Removed local useEffect as products are now passed from App

  const toggleStock = async (id, currentStock) => {
    const newStockValue = currentStock === 0 ? 50 : 0;
    setProducts(products.map(p => p.id === id ? { ...p, stock: newStockValue } : p));
    try {
      await fetch(`/api/products/${id}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: newStockValue > 0 })
      });
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery ||
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const isOutOfStock = (p.stock ?? 50) === 0;
    const matchesStock = stockFilter === 'all' || (stockFilter === 'outOfStock' ? isOutOfStock : !isOutOfStock);
    return matchesSearch && matchesStock;
  }).sort((a, b) => {
    // Priority (ASC) - 1 is top
    const pA = a.priority ?? 999;
    const pB = b.priority ?? 999;
    if (pA !== pB) return pA - pB;
    // Newest first
    return b.id > a.id ? 1 : -1;
  });

  const inventoryByGroup = {};

  // Initialize with standard structure from categoryStructure to ensure all categories show even if empty
  Object.entries(categoryStructure).forEach(([main, subs]) => {
    inventoryByGroup[main] = {};
    subs.forEach(sub => {
      inventoryByGroup[main][sub] = [];
    });
  });

  // Populate with actual filtered products
  filteredProducts.forEach(product => {
    const mainCat = product.mainCategory || getMainCategoryForSub(product.category) || 'Others';
    const subCat = product.category || 'Others';
    if (!inventoryByGroup[mainCat]) inventoryByGroup[mainCat] = {};
    if (!inventoryByGroup[mainCat][subCat]) inventoryByGroup[mainCat][subCat] = [];
    inventoryByGroup[mainCat][subCat].push(product);
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
      {/* Top Header */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 40px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Admin Dashboard</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.875rem' }}>Manage your store orders and inventory</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['WhatsApp Orders', 'Inventory', 'Products'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                background: activeTab === tab ? '#0f172a' : 'white',
                color: activeTab === tab ? 'white' : '#64748b',
                borderRadius: '8px',
                border: activeTab === tab ? 'none' : '1px solid #e2e8f0',
                fontWeight: activeTab === tab ? '600' : '500',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
          <div style={{ width: '1px', backgroundColor: '#e2e8f0', margin: '0 8px' }}></div>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'WhatsApp Orders' && (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Order Management</h2>
              <p style={{ color: '#64748b', margin: '8px 0 0 0', fontSize: '0.875rem' }}>Track and manage all customer orders with WhatsApp notifications</p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', borderLeft: '4px solid #ff3366', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500', margin: '0 0 8px 0' }}>Total Orders</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', margin: 0, fontFamily: "'Outfit', sans-serif" }}>0</h3>
              </div>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500', margin: '0 0 8px 0' }}>Pending</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6', margin: 0, fontFamily: "'Outfit', sans-serif" }}>0</h3>
              </div>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', borderLeft: '4px solid #22c55e', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500', margin: '0 0 8px 0' }}>Confirmed</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#22c55e', margin: 0, fontFamily: "'Outfit', sans-serif" }}>0</h3>
              </div>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', borderLeft: '4px solid #a855f7', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500', margin: '0 0 8px 0' }}>WhatsApp Sent</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#a855f7', margin: 0, fontFamily: "'Outfit', sans-serif" }}>0</h3>
              </div>
            </div>

            {/* Controls Container */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" placeholder="Search by Order ID, Name, or Phone..." style={{ width: '100%', padding: '10px 16px 10px 48px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <select style={{ padding: '10px 40px 10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', appearance: 'none', background: 'white', color: '#0f172a', fontSize: '0.875rem', cursor: 'pointer', outline: 'none' }}>
                    <option>All Status</option>
                  </select>
                  <ChevronDown size={16} color="#64748b" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#64748b', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                  <Download size={16} /> Export
                </button>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>Showing 0 of 0 orders</p>
            </div>

            {/* Empty State */}
            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '80px 20px', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>No orders found matching your criteria</p>
            </div>
          </>
        )}

        {activeTab === 'Inventory' && (
          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '32px' }}>
                <div
                  onClick={() => setStockFilter('all')}
                  style={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    backgroundColor: stockFilter === 'all' ? '#f1f5f9' : 'transparent',
                    border: stockFilter === 'all' ? '1px solid #e2e8f0' : '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Products</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>{products.length}</div>
                </div>
                <div
                  onClick={() => setStockFilter('inStock')}
                  style={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    backgroundColor: stockFilter === 'inStock' ? '#dcfce7' : 'transparent',
                    border: stockFilter === 'inStock' ? '1px solid #bbf7d0' : '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>In Stock</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#22c55e' }}>{products.filter(p => (p.stock ?? 50) > 0).length}</div>
                </div>
                <div
                  onClick={() => setStockFilter('outOfStock')}
                  style={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    backgroundColor: stockFilter === 'outOfStock' ? '#fee2e2' : 'transparent',
                    border: stockFilter === 'outOfStock' ? '1px solid #fecaca' : '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Out of Stock</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ef4444' }}>{products.filter(p => (p.stock ?? 50) === 0).length}</div>
                </div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Product</th>
                    <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Price</th>
                    <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Current Stock</th>
                    <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(inventoryByGroup).filter(mainCat =>
                    Object.values(inventoryByGroup[mainCat]).some(arr => arr.length > 0)
                  ).map(mainCat => (
                    <React.Fragment key={mainCat}>
                      {/* Main Category Header Row */}
                      <tr style={{ backgroundColor: '#f1f5f9' }}>
                        <td colSpan="5" style={{ padding: '12px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {mainCat}
                        </td>
                      </tr>
                      {Object.keys(inventoryByGroup[mainCat]).filter(subCat =>
                        inventoryByGroup[mainCat][subCat].length > 0
                      ).map(subCat => (
                        <React.Fragment key={subCat}>
                          {/* Sub Category Header Row */}
                          <tr style={{ backgroundColor: '#f8fafc' }}>
                            <td colSpan="5" style={{ padding: '8px 20px 8px 32px', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{subCat}</span>
                                <span style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '600' }}>
                                  {inventoryByGroup[mainCat][subCat].length} {inventoryByGroup[mainCat][subCat].length === 1 ? 'Product' : 'Products'}
                                </span>
                              </div>
                            </td>
                          </tr>
                          {inventoryByGroup[mainCat][subCat].map(product => {
                            const stockCount = product.stock !== undefined ? product.stock : 50;
                            return (
                              <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fdfcfb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <td style={{ padding: '12px 20px 12px 40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <img src={optimizeCloudinaryUrl(product.image, 100)} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                  <span style={{ fontWeight: '500', color: '#0f172a', fontSize: '0.875rem' }}>{product.name}</span>
                                </td>
                                <td style={{ padding: '12px 20px', color: '#64748b', fontSize: '0.875rem' }}>{product.category}</td>
                                <td style={{ padding: '12px 20px', color: '#0f172a', fontWeight: '600', fontSize: '0.875rem' }}>₹{product.price}</td>
                                <td style={{ padding: '12px 20px' }}>
                                  <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '999px',
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    backgroundColor: stockCount > 0 ? '#dcfce7' : '#fee2e2',
                                    color: stockCount > 0 ? '#166534' : '#991b1b',
                                    display: 'inline-block'
                                  }}>
                                    {stockCount > 0 ? `${stockCount} Units` : 'Out of stock'}
                                  </span>
                                </td>
                                <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button
                                      onClick={() => toggleStock(product.id, stockCount)}
                                      style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        backgroundColor: stockCount > 0 ? '#fee2e2' : '#dcfce7',
                                        color: stockCount > 0 ? '#ef4444' : '#22c55e',
                                        transition: 'all 0.2s'
                                      }}
                                      onMouseOver={(e) => e.currentTarget.style.opacity = 0.8}
                                      onMouseOut={(e) => e.currentTarget.style.opacity = 1}
                                    >
                                      {stockCount > 0 ? 'Out of Stock' : 'In Stock'}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingProduct(product);
                                        setActiveTab('Products');
                                      }}
                                      style={{
                                        padding: '6px 8px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        color: '#ff003c',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'all 0.2s'
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#fef3c7';
                                        e.currentTarget.style.borderColor = '#ff003c';
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                      }}
                                      title="Edit Product"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(product.id)}
                                      style={{
                                        padding: '6px 8px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'all 0.2s'
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#fee2e2';
                                        e.currentTarget.style.borderColor = '#ef4444';
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                      }}
                                      title="Delete Product"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                No products found.
              </div>
            )}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fcfcfc', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                Overall Website Inventory: <span style={{ color: '#0f172a', fontWeight: '700', marginLeft: '4px' }}>{products.length} Products</span>
              </span>
            </div>
          </div>
        )}

        {activeTab === 'Products' && (
          <div>
            {!editingProduct ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Manage Products</h2>
                    <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.875rem' }}>View, edit, and manage all product details and images</p>
                  </div>
                  <button onClick={() => setEditingProduct({ stock: 50, priority: 999, mainCategory: '', category: '', features: [], insideImages: [] })} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#ff003c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(255, 0, 60, 0.4)' }}>
                    <Plus size={18} /> Add Product
                  </button>
                </div>

                <div style={{ position: 'relative', width: '100%', maxWidth: '400px', marginBottom: '32px' }}>
                  <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box', background: 'white' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                  {filteredProducts.map(product => {
                    const stockCount = product.stock !== undefined ? product.stock : 50;

                    return (
                      <div key={product.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                          height: '220px',
                          width: '100%',
                          position: 'relative',
                          backgroundColor: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '12px'
                        }}>
                          <img
                            src={optimizeCloudinaryUrl(product.image, 400, 'auto:low')}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
                          <span style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.mainCategory || getMainCategoryForSub(product.category)}</span>
                          <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'block', marginBottom: '12px', fontWeight: '500' }}>{product.category}</span>

                          {(product.width > 0 || product.height > 0 || product.depth > 0 || product.material || product.style) && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#64748b', fontSize: '0.7rem', fontWeight: '700', marginBottom: '16px', background: '#f8fafc', padding: '10px', borderRadius: '8px', textTransform: 'uppercase' }}>
                              {product.material && <span style={{ gridColumn: 'span 2' }}>Material: {product.material}</span>}
                              {product.style && <span style={{ gridColumn: 'span 2' }}>Style: {product.style}</span>}
                              {product.height > 0 && <span>H: {product.height}"</span>}
                              {product.width > 0 && <span>W: {product.width}"</span>}
                              {product.depth > 0 && <span>D: {product.depth}"</span>}
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', marginTop: 'auto' }}>
                            <div>
                              <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>₹{product.price}</p>
                              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, textDecoration: 'line-through' }}>₹{(product.comparePrice && product.comparePrice > 0) ? product.comparePrice : (product.price * 1.2).toFixed(0)}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '999px',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                backgroundColor: stockCount > 0 ? '#dcfce7' : '#fee2e2',
                                color: stockCount > 0 ? '#166534' : '#991b1b',
                                textTransform: 'uppercase'
                              }}>
                                {stockCount > 0 ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                              onClick={() => setEditingProduct(product)}
                              style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px', background: '#ff003c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.2s' }}
                              onMouseOver={(e) => e.currentTarget.style.opacity = 0.9}
                              onMouseOut={(e) => e.currentTarget.style.opacity = 1}
                            >
                              <Edit size={16} /> Edit
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = 0.9} onMouseOut={(e) => e.currentTarget.style.opacity = 1}>
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredProducts.length === 0 && (
                  <div style={{ padding: '80px 20px', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '1rem', fontWeight: '500' }}>No products found matching your search.</p>
                  </div>
                )}
              </>
            ) : (
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Edit Product</h2>
                    <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.875rem' }}>Update product information and details</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setEditingProduct(null)} style={{ padding: '10px 20px', background: 'white', color: '#64748b', borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
                    <button onClick={handleSaveProduct} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  {/* Left Column - Basic Info */}
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', marginBottom: '24px', fontFamily: "'Outfit', sans-serif" }}>Basic Information</h3>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Product Name</label>
                      <input type="text" value={editingProduct.name || ''} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: (editingProduct.mainCategory || getMainCategoryForSub(editingProduct.category)) === 'Gift Sets' ? '1fr 1fr' : '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Main Category <span style={{ color: '#ef4444' }}>*</span></label>
                        <select
                          value={editingProduct.mainCategory || getMainCategoryForSub(editingProduct.category) || ''}
                          onChange={(e) => {
                            const main = e.target.value;
                            setEditingProduct({ ...editingProduct, mainCategory: main, category: '' });
                          }}
                          style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box', backgroundColor: 'white', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
                        >
                          <option value="">Select Category</option>
                          {Object.keys(categoryStructure).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Sub Category <span style={{ color: '#ef4444' }}>*</span></label>
                        <select
                          value={editingProduct.category || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          disabled={!(editingProduct.mainCategory || getMainCategoryForSub(editingProduct.category))}
                          style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box', backgroundColor: (editingProduct.mainCategory || getMainCategoryForSub(editingProduct.category)) ? 'white' : '#f8fafc', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
                        >
                          <option value="">Select Item</option>
                          {(() => {
                            const mainName = editingProduct.mainCategory || getMainCategoryForSub(editingProduct.category);
                            if (!mainName) return null;
                            const configured = categoryStructure[mainName] || [];
                            const normalizedMain = mainName.toLowerCase().trim();
                            const productsInCat = products.filter(p => {
                              const m = (p.mainCategory || '').toLowerCase().trim();
                              const c = p.category ? getMainCategoryForSub(p.category).toLowerCase().trim() : '';
                              return m === normalizedMain || c === normalizedMain;
                            });
                            const dynamic = productsInCat.map(p => p.category ? p.category.trim() : `Other ${mainName}`);
                            const allOptions = [...new Set([...configured, ...dynamic])].filter(Boolean);
                            return allOptions.map(item => <option key={item} value={item}>{item}</option>);
                          })()}
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            id="inStockCheckbox"
                            checked={(editingProduct.stock ?? 50) > 0}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.checked ? 50 : 0 })}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                          />
                          <label htmlFor="inStockCheckbox" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', cursor: 'pointer' }}>Available In Stock</label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            id="customizableCheckbox"
                            checked={!!editingProduct.customizable}
                            onChange={(e) => setEditingProduct({ ...editingProduct, customizable: e.target.checked })}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                          />
                          <label htmlFor="customizableCheckbox" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', cursor: 'pointer' }}>Customizable Product</label>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Price (₹)</label>
                        <input type="text" inputMode="decimal" placeholder="0" value={editingProduct.price ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Compare Price</label>
                        <input type="text" inputMode="decimal" placeholder="0" value={editingProduct.comparePrice ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, comparePrice: e.target.value })} style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Ratings</label>
                        <input type="text" inputMode="decimal" placeholder="4.8" value={editingProduct.ratings ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, ratings: e.target.value })} style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Description</label>
                      <textarea rows={4} value={editingProduct.description || ''} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box', resize: 'vertical' }} />
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', marginBottom: '24px', fontFamily: "'Outfit', sans-serif" }}>Details</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Material</label>
                        <input type="text" value={editingProduct.material || ''} onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })} placeholder="e.g., Genuine Leather" style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#64748b', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Style</label>
                        <input type="text" value={editingProduct.style || ''} onChange={(e) => setEditingProduct({ ...editingProduct, style: e.target.value })} placeholder="e.g., Classic" style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#64748b', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px', fontFamily: "'Outfit', sans-serif" }}>Dimensions (inches)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Height (inches)</label>
                        <input type="text" inputMode="decimal" placeholder="0.0" value={editingProduct.height ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, height: e.target.value })} style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Width (inches)</label>
                        <input type="text" inputMode="decimal" placeholder="0.0" value={editingProduct.width ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, width: e.target.value })} style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Bottom Patty (inches)</label>
                        <input type="text" inputMode="decimal" placeholder="0.0" value={editingProduct.depth ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, depth: e.target.value })} style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px', fontFamily: "'Outfit', sans-serif" }}>Product Images</h4>

                    {/* Current image preview */}
                    {editingProduct.image && (
                      <div style={{
                        marginBottom: '12px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        position: 'relative',
                        height: '180px',
                        backgroundColor: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px'
                      }}>
                        <img src={optimizeCloudinaryUrl(editingProduct.image)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        <button onClick={() => setEditingProduct({ ...editingProduct, image: '' })} style={{ position: 'absolute', top: '8px', right: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✕</button>
                      </div>
                    )}

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: editingProduct.image ? '80px' : '160px',
                        border: '2px dashed #e2e8f0',
                        borderRadius: '12px',
                        cursor: imageUploading ? 'not-allowed' : 'pointer',
                        background: '#f8fafc',
                        transition: 'all 0.2s'
                      }} onMouseOver={(e) => !imageUploading && (e.currentTarget.style.borderColor = '#ff003c')} onMouseOut={(e) => !imageUploading && (e.currentTarget.style.borderColor = '#e2e8f0')}>
                        <Upload size={24} color="#94a3b8" style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{imageUploading ? 'Uploading...' : 'Click to upload main image'}</span>
                        <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleImageFileUpload(e.target.files[0])} disabled={imageUploading} style={{ display: 'none' }} />
                      </label>
                    </div>

                    <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px', fontFamily: "'Outfit', sans-serif" }}>Inside Images (Gallery)</h4>

                    {/* Inside images preview grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                      {(editingProduct.insideImages || []).map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', height: '100px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                          <img src={optimizeCloudinaryUrl(img, 200)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button onClick={() => handleRemoveInsideImage(idx)} style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                        </div>
                      ))}
                      <label style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100px',
                        border: '2px dashed #e2e8f0',
                        borderRadius: '8px',
                        cursor: imageUploading ? 'not-allowed' : 'pointer',
                        background: '#f8fafc'
                      }}>
                        <Plus size={20} color="#94a3b8" />
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>Add Image</span>
                        <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleInsideImageUpload(e.target.files[0])} disabled={imageUploading} style={{ display: 'none' }} />
                      </label>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px', fontFamily: "'Outfit', sans-serif" }}>Features</h4>

                      {editingProduct.features && editingProduct.features.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                          {editingProduct.features.map((feature, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                              <span style={{ fontSize: '0.875rem', color: '#0f172a' }}>{feature}</span>
                              <button onClick={() => handleRemoveFeature(idx)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', padding: '4px' }}><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input type="text" value={newFeatureText} onChange={(e) => setNewFeatureText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()} placeholder="Add a feature..." style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#64748b', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                        <button onClick={handleAddFeature} style={{ padding: '0 24px', background: '#ff003c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={16} /> Add</button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <motion.button
        className="floating-action"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bell size={28} />
      </motion.button>
    </div>
  );
};

const ProductsPage = ({ products, currentUser, onProductClick, onCartClick, onLikeClick }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(10000);
  const [priceMax, setPriceMax] = useState(10000);
  const [sortBy, setSortBy] = useState("Featured");

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      const highestPrice = Math.max(...products.map(p => p.price || 0), 100);
      setAbsoluteMaxPrice(highestPrice);
      setPriceMax(prev => (prev === 10000 || prev > highestPrice) ? highestPrice : prev);
    }
  }, [products]);

  const categories = ["All", ...Object.keys(categoryStructure)];

  const filteredProducts = products.filter(p => {
    // category filter
    if (selectedCategory !== "All") {
      const normalizedSelected = selectedCategory.toLowerCase().trim();
      const matchMainCat = (p.mainCategory || '').toLowerCase().trim() === normalizedSelected;
      const computedMainCat = p.category ? getMainCategoryForSub(p.category) : '';
      const matchComputedMainCat = computedMainCat.toLowerCase().trim() === normalizedSelected;
      const effectiveSubCat = p.category ? p.category.trim() : `Other ${p.mainCategory ? p.mainCategory.trim() : computedMainCat.trim()}`;
      const matchSubCat = effectiveSubCat.toLowerCase().trim() === normalizedSelected;
      if (!matchMainCat && !matchComputedMainCat && !matchSubCat) return false;
    }
    // price filter
    if (p.price > priceMax) return false;

    return true;
  });

  const displayProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Newest") return String(b.id || b._id || '').localeCompare(String(a.id || a._id || ''));
    return 0; // "Featured"
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
      {/* Hero Header Section */}
      <div style={{
        background: '#0f172a',
        padding: '160px 0 80px 0',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '800', color: 'white', marginBottom: '12px' }}>
            Our Collection
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.15rem' }}>
            Discover premium gifts for every occasion
          </p>
        </div>
      </div>

      <div className="products-layout">

        {/* LEFT SIDEBAR */}
        <div className="products-sidebar">

          {/* Categories Filter Card */}
          <div className="products-filter-card">
            <h3 className="filter-title">
              <Filter size={18} /> Categories
            </h3>
            <div className="categories-container">
              {categories.map((cat, i) => {
                const isMainCat = cat !== "All";
                let subCats = [];
                if (isMainCat) {
                  const normalizedCat = cat.toLowerCase().trim();
                  const productsInThisMain = products.filter(p => {
                    const mCat = (p.mainCategory || '').toLowerCase().trim();
                    const cCat = p.category ? getMainCategoryForSub(p.category).toLowerCase().trim() : '';
                    return mCat === normalizedCat || cCat === normalizedCat;
                  });
                  const dynamicSubCats = productsInThisMain.map(p => p.category ? p.category.trim() : `Other ${cat}`);
                  const predefinedSubCats = categoryStructure[cat] || [];
                  subCats = [...new Set([...predefinedSubCats, ...dynamicSubCats])].filter(Boolean);
                }
                const isActiveMain = selectedCategory === cat || (subCats && subCats.includes(selectedCategory));

                return (
                  <div key={i} className="category-group">
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    >
                      <span>{cat}</span>
                      {subCats && subCats.length > 0 && (
                        <ChevronDown size={14} style={{ transform: isActiveMain ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                      )}
                    </button>
                    {isActiveMain && subCats && subCats.length > 0 && (
                      <div className="subcategories-container">
                        {subCats.map((sub, j) => (
                          <button
                            key={j}
                            onClick={() => setSelectedCategory(sub)}
                            className={`subcategory-filter-btn ${selectedCategory === sub ? 'active' : ''}`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


        </div>

        {/* RIGHT MAIN AREA */}
        <div className="products-main">

          {/* Header & Sort */}
          <div className="products-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Showing {displayProducts.length} products</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                outline: 'none', background: 'white', color: '#0f172a', fontSize: '0.9rem',
                cursor: 'pointer', appearance: 'auto', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <option value="Featured">Featured</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Newest">Newest Arrivals</option>
            </select>
          </div>

          {/* Products Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {(() => {
              const renderProductCard = (product, index) => (
                <ProductCard
                  key={product.id || product._id || index}
                  product={product}
                  index={index}
                  onClick={onProductClick}
                  onLikeClick={onLikeClick}
                  onCartClick={onCartClick}
                />
              );

              // Group products by subcategory if a main category is selected
              const isMainCategorySelected = Object.keys(categoryStructure).includes(selectedCategory);

              if (isMainCategorySelected && selectedCategory !== "All") {
                const groupedProducts = {};
                displayProducts.forEach(product => {
                  const sub = product.category ? product.category.trim() : `Other ${selectedCategory}`;
                  if (!groupedProducts[sub]) groupedProducts[sub] = [];
                  groupedProducts[sub].push(product);
                });

                return Object.entries(groupedProducts).map(([subCat, prods]) => (
                  <div key={subCat} style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px', display: 'inline-block' }}>
                      {subCat} <span style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: '600', marginLeft: '8px' }}>({prods.length})</span>
                    </h3>
                    <div className="products-grid">
                      {prods.map(renderProductCard)}
                    </div>
                  </div>
                ));
              } else {
                return (
                  <div className="products-grid">
                    {displayProducts.map(renderProductCard)}
                  </div>
                );
              }
            })()}
          </div>

        </div>
      </div>
    </div>
  );
};

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const cached = sessionStorage.getItem('elysian_current_user');
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });
  const [selectedProductView, setSelectedProductView] = useState(() => {
    try {
      const cached = sessionStorage.getItem('elysian_selected_product');
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return sessionStorage.getItem('elysian_selected_category') || null;
  });
  const [isWishlistPageActive, setIsWishlistPageActive] = useState(() => {
    return sessionStorage.getItem('elysian_wishlist_active') === 'true';
  });
  const [isCartPageActive, setIsCartPageActive] = useState(() => {
    return sessionStorage.getItem('elysian_cart_active') === 'true';
  });
  const [isContactPageActive, setIsContactPageActive] = useState(() => {
    return sessionStorage.getItem('elysian_contact_active') === 'true';
  });
  const [isAboutPageActive, setIsAboutPageActive] = useState(() => {
    return sessionStorage.getItem('elysian_about_active') === 'true';
  });
  const [isProductsPageActive, setIsProductsPageActive] = useState(() => {
    return sessionStorage.getItem('elysian_products_active') === 'true';
  });
  const [isCataloguePageActive, setIsCataloguePageActive] = useState(() => {
    return sessionStorage.getItem('elysian_catalogue_active') === 'true';
  });
  const [cartAnimation, setCartAnimation] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      if (path === '/about') {
        setIsAboutPageActive(true); setIsProductsPageActive(false); setIsContactPageActive(false); setIsCataloguePageActive(false);
      } else if (path === '/products') {
        setIsProductsPageActive(true); setIsAboutPageActive(false); setIsContactPageActive(false); setIsCataloguePageActive(false);
      } else if (path === '/contact') {
        setIsContactPageActive(true); setIsAboutPageActive(false); setIsProductsPageActive(false); setIsCataloguePageActive(false);
      } else if (path === '/catalogue') {
        setIsCataloguePageActive(true); setIsAboutPageActive(false); setIsProductsPageActive(false); setIsContactPageActive(false);
      } else if (path === '/') {
        setIsAboutPageActive(false); setIsProductsPageActive(false); setIsContactPageActive(false); setIsCataloguePageActive(false);
      }
    };
    
    if (window.location.pathname !== '/') {
      handleLocation();
    }
    
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  // Effect to persist view state
  useEffect(() => {
    if (selectedProductView) {
      sessionStorage.setItem('elysian_selected_product', JSON.stringify(selectedProductView));
    } else {
      sessionStorage.removeItem('elysian_selected_product');
    }
  }, [selectedProductView]);

  useEffect(() => {
    if (selectedCategory) {
      sessionStorage.setItem('elysian_selected_category', selectedCategory);
    } else {
      sessionStorage.removeItem('elysian_selected_category');
    }
  }, [selectedCategory]);

  useEffect(() => {
    sessionStorage.setItem('elysian_wishlist_active', isWishlistPageActive);
  }, [isWishlistPageActive]);

  useEffect(() => {
    sessionStorage.setItem('elysian_cart_active', isCartPageActive);
  }, [isCartPageActive]);

  useEffect(() => {
    sessionStorage.setItem('elysian_contact_active', isContactPageActive);
  }, [isContactPageActive]);

  useEffect(() => {
    sessionStorage.setItem('elysian_about_active', isAboutPageActive);
  }, [isAboutPageActive]);

  useEffect(() => {
    sessionStorage.setItem('elysian_products_active', isProductsPageActive);
  }, [isProductsPageActive]);

  useEffect(() => {
    sessionStorage.setItem('elysian_catalogue_active', isCataloguePageActive);
  }, [isCataloguePageActive]);

  const [products, setProducts] = useState(() => {
    const cached = sessionStorage.getItem('elysian_products_cache');
    return cached ? JSON.parse(cached) : [];
  });

  useEffect(() => {
    if (products.length > 0) {
      sessionStorage.setItem('elysian_products_cache', JSON.stringify(products));
      if (selectedProductView) {
        const matching = products.find(p => (p.id || p._id) === (selectedProductView.id || selectedProductView._id));
        if (matching && JSON.stringify(matching) !== JSON.stringify(selectedProductView)) {
          setSelectedProductView(matching);
        }
      }
    }
  }, [products, selectedProductView]);

  const [loading, setLoading] = useState(products.length === 0);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [pendingCheckoutItems, setPendingCheckoutItems] = useState([]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('elysian_current_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('elysian_current_user');
    }
  }, [currentUser]);

  const handleLikeClick = async (product) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/user/${currentUser.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id || product._id })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(prev => ({ ...prev, likedProducts: data.likedProducts }));
      }
    } catch (err) {
      console.error('Error liking product:', err);
    }
  };

  const handleCartClick = async (product, quantity = 1) => {
    if (!handleActionClick('Add to Cart', product)) return;

    try {
      const res = await fetch(`/api/user/${currentUser.id}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id || product._id, quantity })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(prev => ({ ...prev, cart: data.cart }));
        setCartAnimation(true);
        setShowToast(true);
        setTimeout(() => {
          setCartAnimation(false);
          setShowToast(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleCartRemove = async (productId) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/user/${currentUser.id}/cart/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(prev => ({ ...prev, cart: data.cart }));
      }
    } catch (err) {
      console.error('Error removing cart item:', err);
    }
  };

  const handleCartUpdateQty = async (productId, newQty) => {
    if (!currentUser) return;
    if (newQty <= 0) {
      return handleCartRemove(productId);
    }
    try {
      const res = await fetch(`/api/user/${currentUser.id}/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(prev => ({ ...prev, cart: data.cart }));
      }
    } catch (err) {
      console.error('Error updating cart qty:', err);
    }
  };

  const handleActionClick = (actionName, product) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

  const handleWhatsAppCheckout = (items) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (items.length === 0) return;

    setPendingCheckoutItems(items);
    setIsCheckoutModalOpen(true);
  };

  const confirmCheckout = (addressDetails) => {
    const whatsappNumber = "918883888907";
    let message = `*New Order from Sri Sai Gifts* 🛍️\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${currentUser.fullName}\n`;
    message += `Email: ${currentUser.email}\n`;
    message += `Phone: ${addressDetails.phone}\n\n`;

    message += `*Delivery Address:*\n`;
    message += `Plot/Door No: ${addressDetails.plotNo}\n`;
    message += `Street: ${addressDetails.street}\n`;
    message += `City: ${addressDetails.city}\n`;
    message += `State: ${addressDetails.state}\n`;
    message += `Pincode: ${addressDetails.pincode}\n\n`;

    message += `*Order Items:*\n`;

    let subtotal = 0;
    pendingCheckoutItems.forEach((item, index) => {
      const itemTotal = item.product.price * item.quantity;
      subtotal += itemTotal;
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   Qty: ${item.quantity} × ₹${item.product.price} = ₹${itemTotal.toLocaleString()}\n`;
      if (item.product.image) {
        message += `   📸 View Image: ${item.product.image}\n`;
      }
      message += `\n`;
    });

    const deliveryFee = subtotal >= 999 ? 0 : 99;
    const total = subtotal + deliveryFee;

    message += `*Order Summary:*\n`;
    message += `Subtotal: ₹${subtotal.toLocaleString()}\n`;
    message += `Delivery: ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}\n`;
    message += `*Total Amount: ₹${total.toLocaleString()}*\n\n`;
    message += `Hi! I would like to place this order. Please confirm and share payment details.`;

    setIsCheckoutModalOpen(false);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const goHome = () => {
    window.history.pushState({}, '', '/');
    setSelectedProductView(null);
    setSelectedCategory(null);
    setIsWishlistPageActive(false);
    setIsCartPageActive(false);
    setIsContactPageActive(false);
    setIsAboutPageActive(false);
    setIsProductsPageActive(false);
    setIsCataloguePageActive(false);
  };

  const goToProducts = () => {
    window.history.pushState({}, '', '/products');
    setSelectedProductView(null);
    setSelectedCategory(null);
    setIsWishlistPageActive(false);
    setIsCartPageActive(false);
    setIsContactPageActive(false);
    setIsAboutPageActive(false);
    setIsCataloguePageActive(false);
    setIsProductsPageActive(true);
  };

  const goToContact = () => {
    window.history.pushState({}, '', '/contact');
    setSelectedProductView(null);
    setSelectedCategory(null);
    setIsWishlistPageActive(false);
    setIsCartPageActive(false);
    setIsProductsPageActive(false);
    setIsAboutPageActive(false);
    setIsCataloguePageActive(false);
    setIsContactPageActive(true);
  };

  const goToAbout = () => {
    window.history.pushState({}, '', '/about');
    setSelectedProductView(null);
    setSelectedCategory(null);
    setIsWishlistPageActive(false);
    setIsCartPageActive(false);
    setIsProductsPageActive(false);
    setIsContactPageActive(false);
    setIsCataloguePageActive(false);
    setIsAboutPageActive(true);
  };

  const goToCatalogue = () => {
    window.history.pushState({}, '', '/catalogue');
    setSelectedProductView(null);
    setSelectedCategory(null);
    setIsWishlistPageActive(false);
    setIsCartPageActive(false);
    setIsProductsPageActive(false);
    setIsContactPageActive(false);
    setIsAboutPageActive(false);
    setIsCataloguePageActive(true);
  };

  // Sync user data on load if logged in
  useEffect(() => {
    const syncUser = async () => {
      if (currentUser && currentUser.id) {
        try {
          const res = await fetch(`/api/user/${currentUser.id}`);
          const data = await res.json();
          if (data.success) {
            setCurrentUser(prev => ({ ...prev, ...data.user }));
          }
        } catch (err) {
          console.error('Failed to sync user data:', err);
        }
      }
    };
    syncUser();
  }, [currentUser?.id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          const normalized = data.map(p => ({ ...p, id: p._id || p.id }));
          setProducts(normalized);
          sessionStorage.setItem('elysian_products_cache', JSON.stringify(normalized));
        } else {
          console.error('Expected array of products, but received:', data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isAdminLoggedIn) {
    return (
      <AdminDashboard
        products={products}
        setProducts={setProducts}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          sessionStorage.removeItem('elysian_admin_logged_in');
          // Also clear view state on logout if desired
          sessionStorage.removeItem('elysian_selected_product');
          sessionStorage.removeItem('elysian_selected_category');
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
      <Navbar
        currentUser={currentUser}
        cartAnimation={cartAnimation}
        onLogout={() => {
          setCurrentUser(null);
          sessionStorage.removeItem('elysian_current_user');
          goHome();
        }}
        onSignInClick={() => setIsAuthModalOpen(true)}
        onAccountClick={() => setIsAccountModalOpen(true)}
        onHomeClick={goHome}
        onProductsClick={goToProducts}
        onAboutClick={goToAbout}
        onCatalogueClick={goToCatalogue}
        onContactClick={goToContact}
        onWishlistClick={() => {
          if (!currentUser) { setIsAuthModalOpen(true); return; }
          window.history.pushState({}, '', '/wishlist');
          setSelectedProductView(null); setSelectedCategory(null);
          setIsCartPageActive(false); setIsContactPageActive(false);
          setIsProductsPageActive(false); setIsWishlistPageActive(true);
          setIsCataloguePageActive(false);
        }}
        onCartClick={() => {
          if (!currentUser) { setIsAuthModalOpen(true); return; }
          window.history.pushState({}, '', '/cart');
          setSelectedProductView(null); setSelectedCategory(null);
          setIsWishlistPageActive(false); setIsContactPageActive(false);
          setIsProductsPageActive(false); setIsCartPageActive(true);
          setIsCataloguePageActive(false);
        }}
      />

      {selectedProductView ? (
        <ProductDetails
          product={{
            ...selectedProductView,
            liked: currentUser?.likedProducts?.some(liked => {
              const likedId = (typeof liked === 'string' ? liked : (liked?._id || liked?.id || liked))?.toString();
              return likedId === (selectedProductView.id || selectedProductView._id)?.toString();
            })
          }}
          onBack={() => setSelectedProductView(null)}
          onLikeClick={handleLikeClick}
          onCartClick={handleCartClick}
          onBuyNowClick={(p, q) => handleWhatsAppCheckout([{ product: p, quantity: q }])}
        />
      ) : isAboutPageActive ? (
        <AboutPage onBack={goHome} />
      ) : isContactPageActive ? (
        <ContactPage onBack={goHome} />
      ) : isCataloguePageActive ? (
        <CataloguePage onBack={goHome} />
      ) : isCartPageActive ? (
        <CartPage
          products={products}
          currentUser={currentUser}
          loading={loading}
          onProductClick={(product) => { setIsCartPageActive(false); setSelectedProductView(product); }}
          onBack={goHome}
          onRemoveCartItem={handleCartRemove}
          onUpdateCartQty={handleCartUpdateQty}
          onCheckout={handleWhatsAppCheckout}
        />
      ) : isWishlistPageActive ? (
        <WishlistPage
          products={products.map(p => ({
            ...p,
            liked: currentUser?.likedProducts?.some(liked => {
              const likedId = (typeof liked === 'string' ? liked : (liked?._id || liked?.id || liked))?.toString();
              return likedId === (p.id || p._id)?.toString();
            })
          }))}
          currentUser={currentUser}
          loading={loading}
          onProductClick={(product) => setSelectedProductView(product)}
          onBack={() => setIsWishlistPageActive(false)}
          onLikeClick={handleLikeClick}
          onCartClick={handleCartClick}
        />
      ) : selectedCategory ? (
        <CategoryPage
          category={selectedCategory}
          products={products.map(p => ({
            ...p,
            liked: currentUser?.likedProducts?.some(liked => {
              const likedId = (typeof liked === 'string' ? liked : (liked?._id || liked?.id || liked))?.toString();
              return likedId === (p.id || p._id)?.toString();
            })
          }))}
          loading={loading}
          onProductClick={(product) => { setSelectedProductView(product); }}
          onBack={() => setSelectedCategory(null)}
          onLikeClick={handleLikeClick}
          onCartClick={handleCartClick}
        />
      ) : isProductsPageActive ? (
        <ProductsPage
          products={products.map(p => ({
            ...p,
            liked: currentUser?.likedProducts?.some(liked => {
              const likedId = (typeof liked === 'string' ? liked : (liked?._id || liked?.id || liked))?.toString();
              return likedId === (p.id || p._id)?.toString();
            })
          }))}
          currentUser={currentUser}
          loading={loading}
          onProductClick={(product) => Object.keys(product).length && setSelectedProductView(product)}
          onBack={goHome}
          onLikeClick={handleLikeClick}
          onCartClick={handleCartClick}
        />
      ) : (
        <>
          <Hero />
          <Categories onCategoryClick={setSelectedCategory} products={products} />
          <Features />
          <FeaturedProducts
            products={products.map(p => ({
              ...p,
              liked: currentUser?.likedProducts?.some(liked => {
                const likedId = (typeof liked === 'string' ? liked : (liked?._id || liked?.id || liked))?.toString();
                return likedId === (p.id || p._id)?.toString();
              })
            }))}
            loading={loading}
            onProductClick={setSelectedProductView}
            onCategoryClick={setSelectedCategory}
            onLikeClick={handleLikeClick}
            onCartClick={handleCartClick}
          />
          <Newsletter />
        </>
      )}

      <Footer
        onHomeClick={goHome}
        onProductsClick={goToProducts}
        onAboutClick={goToAbout}
        onCatalogueClick={goToCatalogue}
        onContactClick={goToContact}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAdminLogin={() => setIsAdminLoggedIn(true)}
        onUserLogin={(user) => setCurrentUser(user)}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        currentUser={currentUser}
        products={products}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={confirmCheckout}
        total={(() => {
          const sub = pendingCheckoutItems.reduce((s, i) => s + (i.product.price * i.quantity), 0);
          return sub + (sub >= 999 ? 0 : 99);
        })()}
      />

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            style={{
              position: 'fixed',
              bottom: '40px',
              left: '50%',
              zIndex: 9999,
              background: '#0f172a',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div style={{ background: '#22c55e', borderRadius: '50%', padding: '4px' }}>
              <ShieldCheck size={16} color="white" />
            </div>
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Added to cart successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="floating-action"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bell size={28} />
      </motion.button>
    </div>
  );
}

export default App;
