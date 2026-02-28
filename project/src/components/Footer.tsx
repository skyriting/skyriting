import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Youtube, Twitter } from 'lucide-react';
import logo from '../images/10Asset 3.svg';

export default function Footer() {
  return (
    <footer className="bg-luxury-black text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="Skyriting Logo" className="h-10 w-10" />
              <div>
                <span className="text-xl font-luxury font-light text-white tracking-luxury block">Skyriting</span>
                <span className="text-xs font-luxury tracking-widest text-luxury-red">ELEVATE YOUR JOURNEY</span>
              </div>
            </div>
            <p className="text-sm mb-6 leading-relaxed font-luxury tracking-wide text-white/70">
              Premium private aviation platform offering luxury charter services,
              packages, and specialized travel solutions.
            </p>
            <div className="space-y-3 mb-6">
              <a href="tel:+911234567890" className="flex items-center space-x-2 text-sm hover:text-luxury-red transition font-luxury tracking-wide">
                <Phone className="h-4 w-4" />
                <span>+91 123 456 7890</span>
              </a>
              <a href="mailto:info@skyriting.com" className="flex items-center space-x-2 text-sm hover:text-luxury-red transition font-luxury tracking-wide">
                <Mail className="h-4 w-4" />
                <span>info@skyriting.com</span>
              </a>
              <div className="flex items-center space-x-2 text-sm font-luxury tracking-wide">
                <MapPin className="h-4 w-4" />
                <span>Bangalore, India</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://instagram.com/skyriting" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-luxury-red transition"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com/@skyriting" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-luxury-red transition"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/skyriting" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-luxury-red transition"
                aria-label="Twitter/X"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-luxury font-light mb-4 tracking-luxury uppercase text-sm">Packages</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/packages" className="hover:text-luxury-red transition font-luxury tracking-wide">All Packages</Link></li>
              <li><Link to="/packages/skyriting-yatra" className="hover:text-luxury-red transition font-luxury tracking-wide">Skyriting Yatra</Link></li>
              <li><Link to="/packages/skyriting-wed" className="hover:text-luxury-red transition font-luxury tracking-wide">Skyriting Wed</Link></li>
              <li><Link to="/packages/skyriting-heli" className="hover:text-luxury-red transition font-luxury tracking-wide">Skyriting Heli</Link></li>
              <li><Link to="/packages/skyriting-rescue" className="hover:text-luxury-red transition font-luxury tracking-wide">Skyriting Rescue</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-luxury font-light mb-4 tracking-luxury uppercase text-sm">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services" className="hover:text-luxury-red transition font-luxury tracking-wide">All Services</Link></li>
              <li><Link to="/services/charter" className="hover:text-luxury-red transition font-luxury tracking-wide">Charter Services</Link></li>
              <li><Link to="/services/aircraft-management" className="hover:text-luxury-red transition font-luxury tracking-wide">Aircraft Management</Link></li>
              <li><Link to="/services/sourcing" className="hover:text-luxury-red transition font-luxury tracking-wide">Sourcing & Sales</Link></li>
              <li><Link to="/services/advanced-air-mobility" className="hover:text-luxury-red transition font-luxury tracking-wide">Advanced Air Mobility</Link></li>
              <li><Link to="/services/mro" className="hover:text-luxury-red transition font-luxury tracking-wide">MRO Services</Link></li>
              <li><Link to="/services/consultancy" className="hover:text-luxury-red transition font-luxury tracking-wide">Aviation Consultancy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-luxury font-light mb-4 tracking-luxury uppercase text-sm">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/fleet" className="hover:text-luxury-red transition font-luxury tracking-wide">Our Fleet</Link></li>
              <li><Link to="/mobility-thread" className="hover:text-luxury-red transition font-luxury tracking-wide">Mobility Thread</Link></li>
              <li><Link to="/articles" className="hover:text-luxury-red transition font-luxury tracking-wide">News & Media</Link></li>
              <li><Link to="/about" className="hover:text-luxury-red transition font-luxury tracking-wide">About Us</Link></li>
              <li><Link to="/career" className="hover:text-luxury-red transition font-luxury tracking-wide">Career</Link></li>
              <li><Link to="/contact" className="hover:text-luxury-red transition font-luxury tracking-wide">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-luxury-red transition font-luxury tracking-wide">Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-sm text-center">
          <p className="font-luxury tracking-wide text-white/60">&copy; {new Date().getFullYear()} Skyriting. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
