import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About'; // Import de la nouvelle page
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
        <Link to="/about">À Propos</Link>

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
          <div>
            <div className="app-container">
              <Header />
            </div>

            <main className="app-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>

            <footer style={{
              background: 'linear-gradient(180deg, var(--bg-tertiary) 0%, rgba(59, 130, 246, 0.05) 100%)',
              borderTop: '1px solid rgba(0,0,0,0.05)',
              padding: '80px 20px 40px',
              marginTop: '60px',
              color: 'var(--text-main)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '60px'
            }}>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', width: '100%', maxWidth: '1280px', padding: '0 24px' }}>

                {/* Colonne 1 : Marque et Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src="/images/Logo.png" alt="DIYAMGAZ Logo" style={{ height: '45px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                    <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>DIYAMGAZ</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px' }}>
                    Votre solution numéro un pour la livraison rapide et sécurisée de gaz, d'eau et de charbon directement chez vous.
                  </p>
                </div>

                {/* Colonne 2 : Contact */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600' }}>Contact</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                      <Phone size={18} color="var(--primary-color)" /> +221 71 142 54 92
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                      <Mail size={18} color="var(--primary-color)" /> contact@diyamgaz.sn
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                      <MapPin size={18} color="var(--primary-color)" /> Dakar, Sénégal
                    </li>
                  </ul>
                </div>

                {/* Colonne 3 : Liens Rapides */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600' }}>Liens Utiles</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <li><Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Boutique & Produits</Link></li>
                    <li><Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Espace Client</Link></li>
                    <li><Link to="/checkout" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Votre Panier</Link></li>
                  </ul>
                </div>

                {/* Colonne 4 : Réseaux Sociaux */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600' }}>Suivez-nous</h4>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary-color)', transition: 'all 0.3s' }}>
                      <Facebook size={20} />
                    </a>
                    <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', transition: 'all 0.3s' }}>
                      <Instagram size={20} />
                    </a>
                    <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 0, 0, 0.05)', color: 'var(--text-main)', transition: 'all 0.3s' }}>
                      <Twitter size={20} />
                    </a>
                  </div>
                </div>

              </div>

              <div style={{ width: '100%', maxWidth: '1280px', padding: '0 24px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>&copy; {new Date().getFullYear()} DIYAMGAZ. Tous droits réservés.</p>
                <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
                  <Link to="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Politique de confidentialité</Link>
                  <Link to="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Conditions d'utilisation</Link>
                </div>
              </div>

            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
