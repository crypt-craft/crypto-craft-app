    import { ThemeToggler } from "@/components/theme/theme-toggler";
    import { icons } from "@/components/icons";
    import { siteConfig } from "@/config/site.config";
    import { useNavigate } from "react-router-dom";
    import {useNetwork} from "@/components/navbar/networkContext.tsx";


    export default function Navbar() {
      const navigate = useNavigate();
        const { network, setNetwork } = useNetwork();

        const handleRedirect = (path: string) => {
            navigate(path);
        };
      return (
        <nav className="w-full py-2 px-3 border-b">
          <div className="w-full mx-auto max-w-3xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <icons.logo width={24} height={24} className="m-1" />
              <h1 className="text-lg font-bold">{siteConfig.name}</h1>
            </div>
              <div className="flex items-center gap-2">
                  <button
                      onClick={() => handleRedirect("/ton")}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                      TON
                  </button>
                  <button
                      onClick={() => handleRedirect("/tron")}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                      TRON
                  </button>
                  <button
                      onClick={() => handleRedirect("/")}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                  >
                      Solana
                  </button>

                  <select
                      value={network}
                      onChange={(e) => setNetwork(e.target.value as "mainnet" | "devnet")}
                      className="border rounded px-2 py-1 text-sm"
                  >
                      <option value="mainnet">Mainnet</option>
                      <option value="devnet">Devnet</option>
                  </select>
                  <ThemeToggler/>
              </div>
          </div>
        </nav>
      );
    }
