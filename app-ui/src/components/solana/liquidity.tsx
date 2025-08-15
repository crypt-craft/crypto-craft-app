import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import * as web3 from "@solana/web3.js";
import { Buffer } from "buffer";
import {api_uri} from "@/utils.ts"
import {useNetwork} from "@/components/navbar/networkContext.tsx";

// Liquidity Solana
export default function SolanaAirdrop() {
    const [mint, setMint] = useState("");
    const address = (typeof window !== 'undefined' && (window as any).solana?.publicKey) ? (window as any).solana.publicKey.toBase58() : ''
    const {network} = useNetwork();
    const [marketType, setMarketType] = useState("AMM"); // Market type: AMM or SLM
    const [rangeStart, setRangeStart] = useState("");
    const [rangeEnd, setRangeEnd] = useState("");
    const [baseAmount, setBaseAmount] = useState("");
    const [quoteAmount, setQuoteAmount] = useState("");
    const [marketId2, setMarketId2] = useState("");
    const addLiquidityHandler = async () => {
        const response = await fetch(api_uri + "/api/liquidity_add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                network: "solana",
                network_type: network,
                type: "clmm",
                pub_key: address,
                token_mint: mint,
                base_amount: baseAmount,
                market_id: marketId2 ? marketId2 : "",
                quote_amount: quoteAmount,
                config: 0,
                initPrice: 1,
                start_price: rangeStart,
                end_price: rangeEnd,
            }),
        });
        if (!marketId2) {
            const {poolId, pooltx} = await response.json();
            setMarketId2(poolId);

            const firstTx = web3.Transaction.from(Buffer.from(pooltx, "base64"));

            if (!(window as any).solana?.signAndSendTransaction) { toast.error('Connect Phantom first'); return; }
            await (window as any).solana.signAndSendTransaction(firstTx);

        } else {
            const {posTX} = await response.json();
            const tx = web3.Transaction.from(Buffer.from(posTX, "base64"));
            await walletProvider.signAndSendTransaction(tx);
            toast.success("Pool added");
        }
    };

    const addAmmLiquidity = async () => {
        const sleep = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));
        const response = await fetch(api_uri + "/api/liquidity_add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                network: "solana",
                network_type: "devnet",
                type: "amm",
                pub_key: address,
                token_mint: mint,
                base_amount: baseAmount,
                market_id: marketId2 ? marketId2 : "",
                quote_amount: quoteAmount,
                config: 0,
                initPrice: 1,
                start_price: 0.01,
                end_price: 100,
            }),
        });
        if (!marketId2) {
            const {marketId, marketTX} = await response.json();
            setMarketId2(marketId);

            const firstTx = web3.Transaction.from(Buffer.from(marketTX[0], "base64"));

            // Send the first transaction and wait for confirmation
            await walletProvider.signAndSendTransaction(firstTx);
            await sleep(3000)
            // Deserialize and send the second transaction
            if (marketTX[1]) {
                const secondTx = web3.Transaction.from(Buffer.from(marketTX[1], "base64"));

                // Send the second transaction and wait for confirmation
                await (window as any).solana.signAndSendTransaction(secondTx);
            }

        } else {
            const {poolTX} = await response.json();
            const tx = web3.Transaction.from(Buffer.from(poolTX, "base64"));
            if (!(window as any).solana?.signAndSendTransaction) { toast.error('Connect Phantom first'); return; }
            await (window as any).solana.signAndSendTransaction(tx);
            toast.success("Pool added");
        }
    };
    return (
        <div className="space-y-2">
            <label className="block">
                Market Type:
                <select
                    value={marketType}
                    //@ts-ignore
                    onChange={(e) => setMarketType(e.target.value)}
                    className="block mt-1"
                >
                    <option value="AMM">AMM</option>
                    <option value="СLMM">CLMM</option>
                </select>
            </label>

            {marketType === "AMM" && (
                <div className="space-y-1">
                    <p>Creating AMM need extra 1 SOL fee for wraping WSOL</p>
                    <Input
                        placeholder="Mint Address"
                        value={mint}
                        onChange={(e) => setMint(e.target.value)}
                    />
                    <Input
                        placeholder="Market Id"
                        value={marketId2}
                        //@ts-ignore
                        onChange={(e) => setMarketId2(e.target.value)}
                    />
                    <Input
                        placeholder="Base amount"
                        value={baseAmount}
                        //@ts-ignore
                        onChange={(e) => setBaseAmount(e.target.value)}
                    />
                    <Input
                        placeholder="Quote amount"
                        value={quoteAmount}
                        //@ts-ignore
                        onChange={(e) => setQuoteAmount(e.target.value)}
                    />

                    <Button onClick={addAmmLiquidity}>
                        Add Liquidity for AMM
                    </Button>
                </div>
            )}

            {marketType === "СLMM" && (
                <div className="space-y-1">
                    <Input
                        placeholder="Mint Address"
                        value={mint}
                        onChange={(e) => setMint(e.target.value)}
                    />
                    <Input
                        placeholder="Market Id"
                        value={marketId2}
                        //@ts-ignore
                        onChange={(e) => setMarketId2(e.target.value)}
                    />
                    <Input
                        placeholder="Base amount"
                        value={baseAmount}
                        //@ts-ignore
                        onChange={(e) => setBaseAmount(e.target.value)}
                    />
                    <Input
                        placeholder="Quote amount"
                        value={quoteAmount}
                        //@ts-ignore
                        onChange={(e) => setQuoteAmount(e.target.value)}
                    />
                    <Input
                        placeholder="Range Start"
                        value={rangeStart}
                        //@ts-ignore
                        onChange={(e) => setRangeStart(e.target.value)}
                    />
                    <Input
                        placeholder="Range End"
                        value={rangeEnd}
                        //@ts-ignore
                        onChange={(e) => setRangeEnd(e.target.value)}
                    />
                    <Button onClick={addLiquidityHandler}>Add Liquidity</Button>
                </div>
            )}
        </div>
    )
}