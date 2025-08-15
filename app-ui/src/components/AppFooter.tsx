import { motion } from 'framer-motion';

export interface AppFooterProps {
  className?: string;
}

export function AppFooter({ className = '' }: AppFooterProps): JSX.Element {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className={`mt-auto py-6 px-4 border-t border-gray-800 backdrop-blur-sm bg-gray-900/60 ${className}`}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            <span>© {currentYear} CryptoCraft. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="https://github.com/bazzzaka/crypto-craft" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <a 
              href="#documentation" 
              className="text-gray-400 hover:text-primary transition-colors"
            >
              Docs
            </a>
            <a 
              href="#support" 
              className="text-gray-400 hover:text-primary transition-colors"
            >
              Support
            </a>
          </div>
          
          <div className="text-xs text-gray-500">
            <span>Powered by MIT License</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
