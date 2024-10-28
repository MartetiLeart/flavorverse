import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand">
          Flavorverse
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
          {user ? (
            <>
              <Link href="/recipes" className="nav-link">
                Recipes
              </Link>
              <button onClick={logout} className="btn btn-outline-light">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">
                Login
              </Link>
              <Link href="/register" className="btn btn-outline-light">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
