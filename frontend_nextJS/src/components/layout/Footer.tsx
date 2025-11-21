export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Kapcsolat</h3>
          <p>
            <strong>Email:</strong>
            <br />
            <a href="mailto:info@szuloradar.hu">info@szuloradar.hu</a>
          </p>
          <p>
            <strong>Telefon:</strong>
            <br />
            <a href="tel:+36123456789">+36 1 234 5678</a>
          </p>
        </div>
        <div className="footer-section">
          <h3>Követés</h3>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              Facebook
            </a>
            <a href="#" aria-label="Instagram">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; 2024 <strong>SzülőRadar</strong>. Minden jog fenntartva.
        </p>
      </div>
    </footer>
  );
}

