import React from 'react';
import { Container } from '../components/ui/Section';

export function SecurityRules() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Development Banner - Same as Training */}
          <div className="border-2 border-green-500 rounded-2xl p-8 md:p-10 hover:border-gold transition-all duration-300 bg-white shadow-sm hover:shadow-md">
            <div className="text-center">
              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-army font-display mb-2">
                Coming Soon
              </h2>
              
              {/* Subtitle */}
              <p className="text-gray-500 text-sm md:text-base mb-6">
                This page is currently under development.
              </p>

              {/* Divider */}
              <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>

              {/* Developing By with Clickable Link - Violet/Purple Color */}
              <p className="text-gray-400 text-sm">
                Developing by{' '}
                <a 
                  href="https://zeroinfinitytechnologies.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 font-semibold transition-colors duration-300 hover:underline"
                >
                  Zero Infinity Technology
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SecurityRules;
