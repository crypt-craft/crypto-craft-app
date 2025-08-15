import { createContext, useContext, useState, ReactNode } from "react";

type Network = "mainnet" | "devnet";

interface NetworkContextType {
    network: Network;
    setNetwork: (network: Network) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
    const isLocal = typeof window !== 'undefined' ? (window.location.hostname.endsWith('.local') || window.location.hostname === 'localhost') : process.env.NODE_ENV !== 'production'
    const [network, setNetwork] = useState<Network>(isLocal ? 'devnet' : 'mainnet');

    return (
        <NetworkContext.Provider value={{ network, setNetwork }}>
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetwork() {
    const context = useContext(NetworkContext);
    if (!context) {
        throw new Error("useNetwork must be used within a NetworkProvider");
    }
    return context;
}