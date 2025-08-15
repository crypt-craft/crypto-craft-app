// Type definition for bn.js that redirects to our polyfill
declare module 'bn.js' {
  import { BN } from '../bn-polyfill';
  export = BN;
  export default BN;
} 