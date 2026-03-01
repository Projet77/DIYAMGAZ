import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const Header = () => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const count = getCartCount();

  return (
    <header className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <img src="/images/Logo.png" alt="DIYAMGAZ Logo" style={{ height: '55px', borderRadius: '12px', marginRight: '30px' }} />
          <h1 style={{ display: 'none' }}>DIYAMGAZ</h1>
        </Link>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/">Accueil</Link>

        {user ? (
          <>
            {user.role === 'ADMIN' && <Link to="/admin" style={{ color: 'var(--primary-color)' }}>Dashboard</Link>}
            <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '15px', fontWeight: '500' }}>Déconnexion</button>
          </>
        ) : (
          <Link to="/login">Connexion</Link>
        )}

        <Link to="/checkout" className="cart-link">
          Panier {count > 0 && <span className="cart-badge" style={{ background: 'var(--accent-color)', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', marginLeft: '6px' }}>{count}</span>}
        </Link>
      </nav>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <Header />

            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>

            <footer>
              <p>&copy; 2024 DIYAMGAZ. Votre gaz, eau ou charbon livré sans difficulté chez vous !</p>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
