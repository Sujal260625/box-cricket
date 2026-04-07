import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FooterProps {
    email?: string;
    phone?: string;
    brandName?: string;
}

const Footer = (props: FooterProps) => {
    const {
        email = "hello@turfflow.com",
        phone = "+123445566789",
        brandName = "TURFFLOW"
    } = props;

    return (
        <footer className="footer-container">
            <div className="footer-content">
                {/* Top Section */}
                <div className="footer-grid">
                    {/* Newsletter Section */}
                    <div className="newsletter-section">
                        <h2 className="section-title">Get Exclusive Updates Offers</h2>
                        <p className="section-description">
                            Be the first to know about upcoming training sessions, special events,
                        </p>
                        <div className="newsletter-input-container">
                            <input
                                type="email"
                                placeholder="Enter your email Address..."
                                className="newsletter-input"
                            />
                            <button className="newsletter-button">
                                <ArrowRight className="button-icon" />
                            </button>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="contact-info-section">
                        <div className="contact-item">
                            <p className="contact-label">Have a question or feedback?</p>
                            <a href={`mailto:${email}`} className="contact-link">{email}</a>
                        </div>
                        <div className="contact-item">
                            <p className="contact-label">Give us a call</p>
                            <a href={`tel:${phone}`} className="contact-link">{phone}</a>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="links-section">
                        <h3 className="links-title">Facilities</h3>
                        <ul className="links-list">
                            <li className="link-item">Tennis Courts</li>
                            <li className="link-item">Basketball Courts</li>
                            <li className="link-item">Swimming Pool</li>
                            <li className="link-item">Gym & Fitness Center</li>
                        </ul>
                    </div>

                    <div className="links-section">
                        <h3 className="links-title">Support</h3>
                        <ul className="links-list">
                            <li className="link-item">FAQ's</li>
                            <li className="link-item">Contact Us</li>
                            <li className="link-item">Help Center</li>
                            <li className="link-item">Live Chart Support</li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="footer-divider">
                    <p>Riverside Turfhub@ 2024 All right reserved</p>
                    <div className="policy-links">
                        <span className="policy-link">Privacy & Policy</span>
                        <span className="policy-link">Terms & Conditions</span>
                    </div>
                </div>

                {/* Large Background Text */}
                <div className="background-text-container">
                    <h1 className="background-text">
                        {brandName}
                    </h1>
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        
        .footer-container {
          background-color: #1a5d2c;
          color: white;
          font-family: 'Inter', sans-serif;
          padding: 2rem;
          border-top-left-radius: 40px;
          border-top-right-radius: 40px;
          position: relative;
          overflow: hidden;
          margin-top: 3rem;
        }

        @media (min-width: 768px) {
          .footer-container {
            padding: 4rem;
          }
        }

        .footer-content {
          max-width: 80rem;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(12, minmax(0, 1fr));
          }
          .newsletter-section { grid-column: span 5; }
          .contact-info-section { grid-column: span 3; }
          .links-section { grid-column: span 2; }
        }

        .section-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .section-title { font-size: 2.25rem; }
        }

        .section-description {
          color: #d1d5db;
          font-size: 0.875rem;
          margin-bottom: 2rem;
        }

        .newsletter-input-container {
          position: relative;
          max-width: 28rem;
        }

        .newsletter-input {
          width: 100%;
          background-color: #a3e635;
          color: #1a5d2c;
          padding: 1rem 1.5rem;
          border-radius: 9999px;
          border: none;
          outline: none;
          font-weight: 500;
        }

        .newsletter-input::placeholder {
          color: rgba(26, 93, 44, 0.7);
        }

        .newsletter-button {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background-color: #1a5d2c;
          padding: 0.5rem;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .newsletter-button:hover {
          opacity: 0.9;
        }

        .button-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #a3e635;
        }

        .contact-item {
          margin-bottom: 2rem;
        }

        .contact-label {
          color: #d1d5db;
          font-size: 0.75rem;
          margin-bottom: 0.25rem;
        }

        .contact-link {
          font-size: 1.125rem;
          font-weight: 600;
          text-decoration: none;
          color: white;
        }

        .contact-link:hover {
          text-decoration: underline;
        }

        .links-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .links-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .link-item {
          color: #d1d5db;
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: color 0.2s;
        }

        .link-item:hover {
          color: white;
        }

        .footer-divider {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #d1d5db;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .footer-divider {
            flex-direction: row;
          }
        }

        .policy-links {
          display: flex;
          gap: 1.5rem;
        }

        .policy-link {
          cursor: pointer;
        }

        .policy-link:hover {
          color: white;
        }

        .background-text-container {
          margin-top: 3rem;
          user-select: none;
          pointer-events: none;
        }

        .background-text {
          font-size: 15vw;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.05em;
          text-align: center;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-transform: uppercase;
        }
      `}</style>
        </footer>
    );
};

export default Footer;
