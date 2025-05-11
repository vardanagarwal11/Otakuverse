
const Footer = () => {
  return (
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
              <li><a href="#" className="text-white/70 hover:text-otaku-purple">Browse Anime</a></li>
              <li><a href="#" className="text-white/70 hover:text-otaku-purple">Creator Studio</a></li>
              <li><a href="#" className="text-white/70 hover:text-otaku-purple">Marketplace</a></li>
              <li><a href="#" className="text-white/70 hover:text-otaku-purple">Services</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-otaku-purple">Discord</a></li>
              <li><a href="#" className="text-white/70 hover:text-otaku-purple">Twitter</a></li>
              <li><a href="#" className="text-white/70 hover:text-otaku-purple">Reddit</a></li>
              <li><a href="#" className="text-white/70 hover:text-otaku-purple">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-otaku-purple">FAQ</a></li>
              <li><a href="#" className="text-white/70 hover:text-otaku-purple">Whitepaper</a></li>
              <li><a href="#" className="text-white/70 hover:text-otaku-purple">Tokenomics</a></li>
              <li><a href="#" className="text-white/70 hover:text-otaku-purple">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © 2025 Otakuverse. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-white/50 hover:text-white">Terms</a>
            <a href="#" className="text-white/50 hover:text-white">Privacy</a>
            <a href="#" className="text-white/50 hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
