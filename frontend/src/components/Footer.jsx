<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Footer · Modern Curved Border</title>
  <!-- Tailwind via CDN + minimal custom style -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide icons (via CDN) -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- React + ReactDOM for demo (CDN) -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <!-- React Router dummy (just for Link) -->
  <script src="https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js"></script>
  <style>
    /* base reset & font */
    body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: #f9f8f4; }
    /* custom animation (letter scroll) */
    @keyframes letterScroll {
      0% { transform: translateY(100%); opacity: 0; }
      20% { transform: translateY(0); opacity: 1; }
      80% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(-100%); opacity: 0; }
    }
    .animate-letter-scroll {
      animation: letterScroll 3s ease-in-out infinite;
      display: inline-block;
    }
    /* curved top border (mini line) using pseudo + gradient */
    .footer-curve-top {
      position: relative;
      border-top: none;
    }
    .footer-curve-top::before {
      content: '';
      position: absolute;
      top: -2px;
      left: 0;
      width: 100%;
      height: 6px;
      background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24);
      border-radius: 0 0 50% 50% / 0 0 100% 100%;
      opacity: 0.7;
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
    }
    /* white bg for content, yellow accent only on curve */
    .footer-white-bg {
      background-color: #ffffff;
    }
    /* social icons hover */
    .social-icon {
      transition: all 0.2s ease;
    }
    .social-icon:hover {
      transform: scale(1.1);
      background-color: #1f3d2b;
      color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    /* text colors */
    .text-army { color: #1f3d2b; }
    .text-army\/70 { color: rgba(31, 61, 43, 0.7); }
    .text-army\/40 { color: rgba(31, 61, 43, 0.4); }
    .border-army\/20 { border-color: rgba(31, 61, 43, 0.2); }
    .bg-army\/10 { background-color: rgba(31, 61, 43, 0.08); }
    .bg-army { background-color: #1f3d2b; }
    .hover\:bg-army:hover { background-color: #1f3d2b; }
    .hover\:text-white:hover { color: white; }
    .hover\:shadow-lg:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
    .hover\:translate-x-1:hover { transform: translateX(4px); }
    .transition-colors { transition: color 0.2s, background 0.2s, transform 0.2s; }
  </style>
</head>
<body>
  <!-- dummy root for React -->
  <div id="root" class="max-w-5xl mx-auto px-4 py-6"></div>

  <script>
    (function() {
      // --- Dummy context & router for demo ---
      const { createContext, useContext, useState, useEffect } = React;

      // SiteContext mock
      const SiteContext = React.createContext({
        footerLogo: { logo: { url: 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Logo' } },
        contact: { address: 'Morang, Nepal', phone: '9824380897', email: 'nepalisena@gmail.com' }
      });
      const useSite = () => useContext(SiteContext);

      // Link mock (react-router)
      const Link = ({ to, children, className }) => {
        return React.createElement('a', { href: to, className: className || '' }, children);
      };

      // Container mock (Section)
      const Container = ({ children, className }) => {
        return React.createElement('div', { className: className || '' }, children);
      };

      // --- Footer Component (exactly as requested, with white bg + yellow curve) ---
      function Footer() {
        const { footerLogo, contact } = useSite();
        const currentYear = new Date().getFullYear();

        const companyName = "Zero Infinity Technology";
        const letters = companyName.split('');

        return React.createElement(
          'footer',
          { 
            className: 'footer-white-bg footer-curve-top relative mt-6 shadow-sm' // white bg + curve via pseudo
          },
          React.createElement(
            Container,
            { className: 'py-8 px-4 md:px-6' },
            // grid: 4 columns
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 md:grid-cols-4 gap-8' },
              // 1) Logo + about
              React.createElement(
                'div',
                null,
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-3' },
                  React.createElement('img', {
                    src: footerLogo?.logo?.url || 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Logo',
                    alt: 'Footer Logo',
                    className: 'h-16 w-16 rounded-full object-cover border-2 border-army/30 shadow-md'
                  }),
                  React.createElement(
                    'div',
                    null,
                    React.createElement('h3', { className: 'font-bold text-lg text-army' }, 'Nepal Army'),
                    React.createElement('p', { className: 'text-xs text-army/60' }, 'Ex-Army Association')
                  )
                ),
                React.createElement(
                  'p',
                  { className: 'mt-4 text-sm text-army/70 leading-relaxed' },
                  'Serving the nation through unity, honor, and commitment to social service.'
                )
              ),
              // 2) Quick Links
              React.createElement(
                'div',
                null,
                React.createElement('h4', { className: 'font-semibold text-army mb-4' }, 'Quick Links'),
                React.createElement(
                  'ul',
                  { className: 'space-y-2 text-sm' },
                  ['Home', 'About Us', 'Leadership', 'Gallery', 'Contact'].map((label, idx) => {
                    const path = '/' + (idx === 0 ? '' : label.toLowerCase().replace(' ', ''));
                    return React.createElement(
                      'li',
                      { key: idx },
                      React.createElement(
                        Link,
                        { 
                          to: path, 
                          className: 'text-army/70 hover:text-army transition-colors hover:translate-x-1 inline-block' 
                        },
                        label
                      )
                    );
                  })
                )
              ),
              // 3) Contact
              React.createElement(
                'div',
                null,
                React.createElement('h4', { className: 'font-semibold text-army mb-4' }, 'Contact'),
                React.createElement(
                  'ul',
                  { className: 'space-y-3 text-sm' },
                  React.createElement(
                    'li',
                    { className: 'flex items-start gap-3 text-army/70' },
                    React.createElement(MapPin, { className: 'h-4 w-4 text-army shrink-0 mt-0.5' }),
                    React.createElement('span', null, contact?.address || 'Kathmandu, Nepal')
                  ),
                  React.createElement(
                    'li',
                    { className: 'flex items-center gap-3 text-army/70' },
                    React.createElement(Phone, { className: 'h-4 w-4 text-army shrink-0' }),
                    React.createElement('span', null, contact?.phone || '+977-1-1234567')
                  ),
                  React.createElement(
                    'li',
                    { className: 'flex items-center gap-3 text-army/70' },
                    React.createElement(Mail, { className: 'h-4 w-4 text-army shrink-0' }),
                    React.createElement('span', null, contact?.email || 'info@nepalarmy.org')
                  )
                )
              ),
              // 4) Social
              React.createElement(
                'div',
                null,
                React.createElement('h4', { className: 'font-semibold text-army mb-4' }, 'Follow Us'),
                React.createElement(
                  'div',
                  { className: 'flex gap-3' },
                  ['Facebook', 'Twitter', 'Youtube'].map((label, idx) => {
                    const Icon = [Facebook, Twitter, Youtube][idx];
                    return React.createElement(
                      'a',
                      {
                        key: idx,
                        href: '#',
                        className: 'bg-army/10 hover:bg-army text-army hover:text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg social-icon',
                        'aria-label': label
                      },
                      React.createElement(Icon, { className: 'h-5 w-5' })
                    );
                  })
                )
              )
            ),
            // Bottom: border + copyright + powered by with scrolling letters
            React.createElement(
              'div',
              { className: 'border-t border-army/20 mt-8 pt-6' },
              React.createElement(
                'div',
                { className: 'text-center' },
                React.createElement(
                  'p',
                  { className: 'text-sm text-army/40' },
                  `© ${currentYear} Nepal National Ex-Army Association. All rights reserved.`
                ),
                // Powered by with scrolling letters
                React.createElement(
                  'div',
                  { className: 'mt-3 flex items-center justify-center gap-2 overflow-hidden' },
                  React.createElement('span', { className: 'text-sm text-army/40' }, 'Powered by'),
                  React.createElement(
                    'a',
                    {
                      href: 'https://zeroinfinitytechnologies.com/',
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      className: 'font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-300 hover:underline inline-flex'
                    },
                    React.createElement(
                      'span',
                      { className: 'inline-flex overflow-hidden' },
                      letters.map((letter, index) => 
                        React.createElement(
                          'span',
                          {
                            key: index,
                            className: 'inline-block animate-letter-scroll',
                            style: { animationDelay: `${index * 0.05}s` }
                          },
                          letter === ' ' ? '\u00A0' : letter
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        );
      }

      // Icons from lucide (we need to define them as components)
      const Facebook = (props) => React.createElement('svg', { 
        ...props, 
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
      }, React.createElement('path', { d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' }));
      const Twitter = (props) => React.createElement('svg', { 
        ...props, 
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
      }, React.createElement('path', { d: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' }));
      const Youtube = (props) => React.createElement('svg', { 
        ...props, 
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
      }, React.createElement('path', { d: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z' }), React.createElement('polygon', { points: '9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02' }));
      const Mail = (props) => React.createElement('svg', { 
        ...props, 
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
      }, React.createElement('path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }), React.createElement('polyline', { points: '22,6 12,13 2,6' }));
      const Phone = (props) => React.createElement('svg', { 
        ...props, 
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
      }, React.createElement('path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' }));
      const MapPin = (props) => React.createElement('svg', { 
        ...props, 
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
      }, React.createElement('path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }), React.createElement('circle', { cx: '12', cy: '10', r: '3' }));

      // Wrap with SiteContext.Provider
      const App = () => {
        return React.createElement(
          SiteContext.Provider,
          {
            value: {
              footerLogo: { logo: { url: 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Logo' } },
              contact: { address: 'Morang, Nepal', phone: '9824380897', email: 'nepalisena@gmail.com' }
            }
          },
          React.createElement(Footer)
        );
      };

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    })();
  </script>
</body>
</html>
