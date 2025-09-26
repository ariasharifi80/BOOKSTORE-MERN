// src/components/Footer.jsx
import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import { FaInstagram, FaTwitter, FaFacebookF, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const linkSections = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", path: "/" },
        { label: "Best Sellers", path: "/bestsellers" },
        { label: "Offers & Deals", path: "/offers" },
        { label: "Contact Us", path: "/contact" },
        { label: "FAQs", path: "/faq" },
      ],
    },
    {
      title: "Need Help?",
      links: [
        { label: "Delivery Information", path: "/delivery" },
        { label: "Return & Refund Policy", path: "/returns" },
        { label: "Payment Methods", path: "/payment" },
        { label: "Track Your Order", path: "/track" },
        { label: "Contact Us", path: "/contact" },
      ],
    },
    {
      title: "Follow Us",
      links: [
        { label: "Instagram", icon: <FaInstagram />, url: "#" },
        { label: "Twitter", icon: <FaTwitter />, url: "#" },
        { label: "Facebook", icon: <FaFacebookF />, url: "#" },
        { label: "Youtube", icon: <FaYoutube />, url: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img
                src={logoImg}
                alt="Aria Book"
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
              <span className="text-xl font-bold text-white">
                Aria Book <span className="text-secondary">a.</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-xs leading-relaxed">
              Discover your favorite books online. Curated collections, fast
              delivery, and a love for reading.
            </p>
            <div className="mt-6 flex space-x-4">
              {linkSections[2].links.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-300 hover:bg-secondary hover:text-white transition-all duration-300 hover:-translate-y-1"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5 pb-2 border-b border-gray-700/50">
              {linkSections[0].title}
            </h3>
            <ul className="space-y-3">
              {linkSections[0].links.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 hover:opacity-90"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Need Help */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5 pb-2 border-b border-gray-700/50">
              {linkSections[1].title}
            </h3>
            <ul className="space-y-3">
              {linkSections[1].links.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 hover:opacity-90"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter (Optional Enhancement) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5 pb-2 border-b border-gray-700/50">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for new arrivals and exclusive offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-secondary text-white font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Aria Book. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
