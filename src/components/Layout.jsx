import Navbar from './NavBar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} StartupFest. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;