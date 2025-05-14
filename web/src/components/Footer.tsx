
import React, { useState } from "react";
import ComingSoonModal from "./ComingSoonModal";

const Footer = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const handleCreatorStudioClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowComingSoon(true);
  };
  return (
    <>
      <footer className="bg-black/50 pt-16 pb-8">
        <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-cyber font-bold mb-4">
              <span className="text-otaku-purple">Otaku</span>
              <span className="text-otaku-blue">verse</span>
            </h2>
            <p className="text-white/70 mb-4">
              The first decentralized anime streaming platform where fans directly support creators.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="/anime" className="text-white/70 hover:text-otaku-purple">Browse Anime</a></li>
              <li><button onClick={handleCreatorStudioClick} className="text-white/70 hover:text-otaku-purple w-full text-left">Creator Studio</button></li>
              <li><a href="/marketplace" className="text-white/70 hover:text-otaku-purple">Marketplace</a></li>
              <li><a href="/services" className="text-white/70 hover:text-otaku-purple">Services</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com/otakuverse" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-otaku-purple flex items-center">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="mr-2"><path d="M22.46 5.924c-.793.352-1.646.59-2.54.697a4.48 4.48 0 0 0 1.964-2.475 8.94 8.94 0 0 1-2.83 1.082 4.47 4.47 0 0 0-7.617 4.073A12.68 12.68 0 0 1 3.112 4.86a4.47 4.47 0 0 0 1.382 5.965 4.44 4.44 0 0 1-2.025-.56v.057a4.47 4.47 0 0 0 3.584 4.382 4.47 4.47 0 0 1-2.02.077 4.47 4.47 0 0 0 4.175 3.106A8.96 8.96 0 0 1 2 19.542a12.66 12.66 0 0 0 6.86 2.013c8.233 0 12.75-6.822 12.75-12.75 0-.195-.004-.39-.013-.583a9.13 9.13 0 0 0 2.24-2.326z"></path></svg>
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © 2025 Otakuverse. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="/terms" className="text-white/50 hover:text-white">Terms</a>
            <a href="/privacy" className="text-white/50 hover:text-white">Privacy</a>
            <a href="/cookies" className="text-white/50 hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
    <ComingSoonModal open={showComingSoon} onClose={() => setShowComingSoon(false)} />
    </>
  );
};

export default Footer;
