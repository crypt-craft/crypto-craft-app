import {Button} from '@/components/ui/button';
import {useTonConnectUI} from '@tonconnect/ui-react';
import type { SendTransactionRequest } from '@tonconnect/sdk';
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {api_uri} from "@/utils.ts"
import {useNetwork} from "@/components/navbar/networkContext.tsx";

//TON liquidity
export function TonLiquidity() {
    const [wallet] = useTonConnectUI();
    const [mint, setMint] = useState("");
    const [base_amount, setBase] = useState("");
    const [quote_amount, setQuote] = useState("");
    const {network} = useNetwork();

    const handleLiquidity = async () => {
        const sleep = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));
        if (wallet) {
            const response = await fetch(api_uri + "/api/liquidity_add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    network_type: network,
                    network: "ton",
                    pub_key: wallet.account?.address,
                    token_mint: mint,
                    base_amount: base_amount,
                    quote_amount: quote_amount,
                })
            });
            console.log(response);
            const res = await response.json();
            const transactionRequest: SendTransactionRequest = {
                validUntil: Math.floor(Date.now() / 1000) + 3600,
                messages: [
                    {
                        address: res.to_1,
                        amount: res.value_1,
                        payload: res.body_1,
                    }
                ]
            };
            await wallet.sendTransaction(transactionRequest);
            await sleep(30000)
            const transactionRequest2: SendTransactionRequest = {
                validUntil: Math.floor(Date.now() / 1000) + 3600,
                messages: [
                    {
                        address: res.to_2,
                        amount: res.value_2,
                        payload: res.body_2,
                    }
                ]
            };
            await wallet.sendTransaction(transactionRequest2);
        }
    };

    return (
        //@ts-ignore
        <div>
            <div className="space-y-2">
                <Input
                    placeholder="Minter address"
                    value={mint}
                    //@ts-ignore
                    onChange={(e) => setMint(e.target.value)}
                />
                <Input
                    placeholder="Ton amount"
                    value={base_amount}
                    //@ts-ignore
                    onChange={(e) => setBase(e.target.value)}
                />
                <Input
                    placeholder="Token amount"
                    value={quote_amount}
                    //@ts-ignore
                    onChange={(e) => setQuote(e.target.value)}
                />
            </div>
            <Button onClick={handleLiquidity} style={{marginTop: 16}}>
                Add liquidity
            </Button>
        </div>
    );
}