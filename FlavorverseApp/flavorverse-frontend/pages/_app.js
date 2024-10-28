import { AuthProvider } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // Import the Footer component

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
      <Footer /> {/* Add the Footer component */}
    </AuthProvider>
  );
}

export default MyApp;
