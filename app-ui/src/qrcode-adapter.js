/**
 * QR Code Adapter
 * 
 * This file provides a compatibility layer for the qrcode library used by
 * @solana-mobile/wallet-adapter-mobile to fix the export issue.
 */

// Import the actual QR code library
import * as QRCode from 'qrcode';

// Create a default export that matches what the mobile wallet adapter expects
const QRCodeAdapter = {
  toDataURL: QRCode.toDataURL,
  toCanvas: QRCode.toCanvas,
  toString: QRCode.toString,
  // Add any other methods that might be needed
};

// Export both the default and named exports
export default QRCodeAdapter;
export { QRCode }; 