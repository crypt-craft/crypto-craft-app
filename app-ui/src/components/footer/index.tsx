import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";


export default function Index() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <footer className="w-full py-4 border-t mt-12">
            <div className="w-full mx-auto max-w-3xl flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                    <Link to="/privacy-policy" className="text-gray-600 hover:underline">Privacy Policy</Link>
                    <Link to="/terms-of-service" className="text-gray-600 hover:underline">Terms of Service</Link>
                    <button onClick={() => setIsOpen(true)} className="text-gray-600 hover:underline">How it works?</button>
                </div>
                <p className="text-gray-600">© {new Date().getFullYear()} Crypto Craft.</p>
            </div>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-md w-full">
                        <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2">
                            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                        </button>
                        <h2 className="text-xl font-semibold mb-2">How it works?</h2>
                        <p className="text-gray-600">descriptions of working.</p>
                    </div>
                </motion.div>
            )}
        </footer>
    );
}
