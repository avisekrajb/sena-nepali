import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './ui/Section';
import { useSite } from '../context/SiteContext';
import { 
  Facebook, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  Instagram,
  Linkedin,
  ArrowUp
} from 'lucide-react';

export function Footer() {
  const { footerLogo, contact } = useSite();
  const currentYear = new Date().getFullYear();

  // Company name with individual letters for the scroll animation
  const companyName = "Zero Infinity Technology";
  const letters = companyName.split('');

  // Handle contact click
  const handlePhoneClick = () => {
    window.location.href = `tel:${contact?.phone || '9824380897'}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${contact?.email || 'nepalisena@gmail.com'}`;
  };

  const handleAddressClick = () => {
    const address = contact?.address || 'Morang, Nepal';
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`, '_blank');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-white mt-16">
      {/* Single Curved Top Border - Only One */}
      <div className="absolute -top-8 left-0 right-0 overflow-hidden">
        <svg 
          className="w-full h-16" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          style={{ 
            filter: 'drop-shadow(0 -15px 40px rgba(34,197,94,0.2))',
          }}
        >
          <path 
            d="M0,40 C200,100 400,20 600,60 C800,100 1000,30 1200,50 L1200,120 L0,120 Z" 
            fill="white"
          />
          <path 
            d="M0,50 C200,110 400,30 600,70 C800,110 1000,40 1200,60 L1200,120 L0,120 Z" 
            fill="url(#topGradientNew)"
            opacity="0.15"
          />
        </svg>
      </div>

      {/* Floating Glow Effect Top */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-3/4 h-20 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 rounded-full blur-3xl opacity-25 animate-pulse-slow"></div>

      <Container className="py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and About - Slow Rotating Curve Border */}
          <div className="group relative bg-white rounded-2xl hover:shadow-[0_15px_60px_rgba(34,197,94,0.2)] hover:-translate-y-3 transition-all duration-500">
            <div className="absolute inset-0 rounded-2xl rotating-curve-border-slow"></div>
            <div className="relative p-8 bg-white rounded-2xl group-hover:bg-gradient-to-br group-hover:from-green-50 group-hover:to-yellow-50/50 transition-all duration-500">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 animate-spin-slow"></div>
                  <img 
                    src={footerLogo?.logo?.url || 'https://placehold.co/80x80/1F3D2B/FFFFFF?text=Logo'} 
                    alt="Footer Logo" 
                    className="h-20 w-20 rounded-full object-cover border-2 border-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.15)] group-hover:shadow-[0_0_40px_rgba(250,204,21,0.3)] transition-all duration-500 relative"
                  />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-gray-800 group-hover:text-green-700 transition-colors duration-500">Nepal Army</h3>
                  <p className="text-sm text-gray-500 group-hover:text-green-600 transition-colors duration-500">Ex-Army Association</p>
                </div>
              </div>
              <p className="mt-4 text-base text-gray-600 group-hover:text-gray-700 leading-relaxed transition-colors duration-500">
                Serving the nation through unity, honor, and commitment to social service.
              </p>
            </div>
          </div>

          {/* Quick Links - Slow Rotating Curve Border */}
          <div className="group relative bg-white rounded-2xl hover:shadow-[0_15px_60px_rgba(34,197,94,0.2)] hover:-translate-y-3 transition-all duration-500">
            <div className="absolute inset-0 rounded-2xl rotating-curve-border-slow"></div>
            <div className="relative p-8 bg-white rounded-2xl group-hover:bg-gradient-to-br group-hover:from-green-50 group-hover:to-yellow-50/50 transition-all duration-500">
              <h4 className="font-semibold text-xl text-gray-800 group-hover:text-green-700 transition-colors duration-500 mb-5">Quick Links</h4>
              <ul className="space-y-3 text-base">
                <li>
                  <Link to="/" className="text-gray-600 group-hover:text-green-600 transition-all duration-300 hover:translate-x-2 inline-block">Home</Link>
                </li>
                <li>
                  <Link to="/introduction" className="text-gray-600 group-hover:text-green-600 transition-all duration-300 hover:translate-x-2 inline-block">About Us</Link>
                </li>
                <li>
                  <Link to="/leadership" className="text-gray-600 group-hover:text-green-600 transition-all duration-300 hover:translate-x-2 inline-block">Leadership</Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-gray-600 group-hover:text-green-600 transition-all duration-300 hover:translate-x-2 inline-block">Gallery</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 group-hover:text-green-600 transition-all duration-300 hover:translate-x-2 inline-block">Contact</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact - Slow Rotating Curve Border */}
          <div className="group relative bg-white rounded-2xl hover:shadow-[0_15px_60px_rgba(34,197,94,0.2)] hover:-translate-y-3 transition-all duration-500">
            <div className="absolute inset-0 rounded-2xl rotating-curve-border-slow"></div>
            <div className="relative p-8 bg-white rounded-2xl group-hover:bg-gradient-to-br group-hover:from-green-50 group-hover:to-yellow-50/50 transition-all duration-500">
              <h4 className="font-semibold text-xl text-gray-800 group-hover:text-green-700 transition-colors duration-500 mb-5">Contact</h4>
              <ul className="space-y-4 text-base">
                <li 
                  className="flex items-start gap-3 text-gray-600 group-hover:text-green-700 transition-colors duration-500 cursor-pointer hover:text-green-600"
                  onClick={handleAddressClick}
                >
                  <MapPin className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5 group-hover:text-yellow-600 transition-colors duration-500" />
                  <span className="hover:underline">{contact?.address || 'Morang, Nepal'}</span>
                </li>
                <li 
                  className="flex items-center gap-3 text-gray-600 group-hover:text-green-700 transition-colors duration-500 cursor-pointer hover:text-green-600"
                  onClick={handlePhoneClick}
                >
                  <Phone className="h-5 w-5 text-green-500 shrink-0 group-hover:text-green-600 transition-colors duration-500" />
                  <span className="hover:underline">{contact?.phone || '9824380897'}</span>
                </li>
                <li 
                  className="flex items-center gap-3 text-gray-600 group-hover:text-green-700 transition-colors duration-500 cursor-pointer hover:text-green-600"
                  onClick={handleEmailClick}
                >
                  <Mail className="h-5 w-5 text-yellow-500 shrink-0 group-hover:text-yellow-600 transition-colors duration-500" />
                  <span className="hover:underline">{contact?.email || 'nepalisena@gmail.com'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social - Slow Rotating Curve Border */}
          <div className="group relative bg-white rounded-2xl hover:shadow-[0_15px_60px_rgba(34,197,94,0.2)] hover:-translate-y-3 transition-all duration-500">
            <div className="absolute inset-0 rounded-2xl rotating-curve-border-slow"></div>
            <div className="relative p-8 bg-white rounded-2xl group-hover:bg-gradient-to-br group-hover:from-green-50 group-hover:to-yellow-50/50 transition-all duration-500">
              <h4 className="font-semibold text-xl text-gray-800 group-hover:text-green-700 transition-colors duration-500 mb-5">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://facebook.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1877F2] hover:bg-[#1877F2]/80 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(24,119,242,0.4)]"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#000000] hover:bg-[#000000]/80 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-gray-200"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-tr from-[#833AB4] via-[#E1306C] to-[#F56040] hover:opacity-90 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(225,48,108,0.4)]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0A66C2] hover:bg-[#0A66C2]/80 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(10,102,194,0.4)]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 relative">
          {/* Removed straight border-t-2 */}
          <div className="text-center">
            <p className="text-base text-gray-500">
              &copy; {currentYear} Nepal National Ex-Army Association. All rights reserved.
            </p>

            {/* Powered By - Violet Gradient with Always Scroll */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-xs md:text-sm text-gray-400 font-medium tracking-wider uppercase">Powered by</span>
              <a
                href="https://zeroinfinitytechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600 bg-clip-text text-transparent hover:from-violet-600 hover:via-purple-600 hover:to-violet-700 transition-all duration-500 inline-flex items-center gap-1 group relative"
              >
                <span className="inline-flex overflow-hidden text-sm md:text-base lg:text-lg tracking-wider">
                  {letters.map((letter, index) => (
                    <span
                      key={index}
                      className="inline-block animate-letter-scroll-violet"
                      style={{
                        animationDelay: `${index * 0.04}s`,
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-violet-400 via-purple-500 to-violet-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Single Curved Bottom Border - Only One */}
      <div className="absolute -bottom-8 left-0 right-0 overflow-hidden transform rotate-180">
        <svg 
          className="w-full h-16" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          style={{ 
            filter: 'drop-shadow(0 15px 40px rgba(34,197,94,0.2))',
          }}
        >
          <path 
            d="M0,40 C200,100 400,20 600,60 C800,100 1000,30 1200,50 L1200,120 L0,120 Z" 
            fill="white"
          />
          <path 
            d="M0,50 C200,110 400,30 600,70 C800,110 1000,40 1200,60 L1200,120 L0,120 Z" 
            fill="url(#bottomGradientNew)"
            opacity="0.15"
          />
        </svg>
      </div>

      {/* Floating Glow Effect Bottom */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-3/4 h-20 bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 rounded-full blur-3xl opacity-25 animate-pulse-slow"></div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(250,204,21,0.5)] transition-all duration-300 hover:scale-110 group animate-bounce-slow"
      >
        <ArrowUp className="h-5 w-5 text-white group-hover:rotate-[-45deg] transition-transform duration-300" />
      </button>

      {/* CSS Animations */}
      <style>{`
        /* Slow Rotating Curve Border - Half Green Half Yellow */
        @keyframes rotateCurveBorderSlow {
          0%, 100% {
            border-top-color: #22c55e;
            border-right-color: #facc15;
            border-bottom-color: #22c55e;
            border-left-color: #facc15;
            border-radius: 16px 30px 16px 30px;
            box-shadow: 
              0 0 30px rgba(34, 197, 94, 0.15),
              0 0 60px rgba(250, 204, 21, 0.1),
              inset 0 0 30px rgba(34, 197, 94, 0.05);
          }
          25% {
            border-top-color: #facc15;
            border-right-color: #22c55e;
            border-bottom-color: #facc15;
            border-left-color: #22c55e;
            border-radius: 30px 16px 30px 16px;
            box-shadow: 
              0 0 30px rgba(250, 204, 21, 0.15),
              0 0 60px rgba(34, 197, 94, 0.1),
              inset 0 0 30px rgba(250, 204, 21, 0.05);
          }
          50% {
            border-top-color: #22c55e;
            border-right-color: #facc15;
            border-bottom-color: #22c55e;
            border-left-color: #facc15;
            border-radius: 16px 30px 16px 30px;
            box-shadow: 
              0 0 30px rgba(34, 197, 94, 0.15),
              0 0 60px rgba(250, 204, 21, 0.1),
              inset 0 0 30px rgba(34, 197, 94, 0.05);
          }
          75% {
            border-top-color: #facc15;
            border-right-color: #22c55e;
            border-bottom-color: #facc15;
            border-left-color: #22c55e;
            border-radius: 30px 16px 30px 16px;
            box-shadow: 
              0 0 30px rgba(250, 204, 21, 0.15),
              0 0 60px rgba(34, 197, 94, 0.1),
              inset 0 0 30px rgba(250, 204, 21, 0.05);
          }
        }

        .rotating-curve-border-slow {
          border: 3px solid;
          border-top-color: #22c55e;
          border-right-color: #facc15;
          border-bottom-color: #22c55e;
          border-left-color: #facc15;
          border-radius: 16px 30px 16px 30px;
          animation: rotateCurveBorderSlow 6s ease-in-out infinite;
          transition: all 0.3s ease;
          position: absolute;
          inset: -3px;
          pointer-events: none;
          background: transparent;
        }

        /* Hover effect - enhance glow and border with faster animation */
        .group:hover .rotating-curve-border-slow {
          animation-duration: 3s;
          border-width: 4px;
          filter: drop-shadow(0 0 40px rgba(34, 197, 94, 0.3));
          inset: -4px;
          border-radius: 20px 35px 20px 35px;
        }

        /* Inner content needs to be above border */
        .group > .relative {
          z-index: 1;
        }

        /* Pulse animation for glow */
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 0.2;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 0.35;
            transform: translateX(-50%) scale(1.1);
          }
        }

        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }

        /* Letter Scroll Animation - Violet */
        @keyframes letterScrollViolet {
          0% {
            transform: translateY(100%) scale(0.9);
            opacity: 0;
          }
          20% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          80% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%) scale(0.9);
            opacity: 0;
          }
        }

        .animate-letter-scroll-violet {
          animation: letterScrollViolet 3s ease-in-out infinite;
          display: inline-block;
          background: linear-gradient(to right, #8b5cf6, #a855f7, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Slow spin animation for logo glow */
        @keyframes spinSlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }

        /* Bounce animation for scroll button */
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }

        /* Smooth scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #22c55e, #facc15);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #facc15, #22c55e);
        }

        /* Smooth hover transitions */
        .group:hover {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .group:hover .text-gray-600 {
          color: #166534;
        }

        .group:hover .text-gray-800 {
          color: #14532d;
        }

        /* Floating curve SVG responsive */
        @media (max-width: 768px) {
          .absolute.-top-8 svg,
          .absolute.-bottom-8 svg {
            height: 40px !important;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
