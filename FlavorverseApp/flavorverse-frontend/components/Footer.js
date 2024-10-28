export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Flavorverse. All rights reserved.
        </p>
        <p>
          Follow us on
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Twitter
          </a>
          ,
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Facebook
          </a>
          , and
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Instagram
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
