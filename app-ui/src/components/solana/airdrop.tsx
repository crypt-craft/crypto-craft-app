import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import * as web3 from "@solana/web3.js";
import { Buffer } from "buffer";
import {api_uri} from "@/utils.ts"
import {useNetwork} from "@/components/navbar/networkContext.tsx";

// Airdrop Solana
export default function SolanaAirdrop() {
    const [mint_airdrop, setMint_mint_airdrop] = useState("");
    const [recipients, setRecipients] = useState("");
    const [airdrop_amount, setairdrop_amount] = useState("");
    const address = (typeof window !== 'undefined' && (window as any).solana?.publicKey) ? (window as any).solana.publicKey.toBase58() : ''
    const {network} = useNetwork();

    const handleAirdrop = async () => {
        try {
            if (!address) {
                toast.error("Connect wallet first");
                return;
            }
            const base = api_uri && api_uri !== '' ? api_uri : ''
            const response = await fetch(base + "/api/airdrops/claim-direct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt') || ''}`,
                },
                body: JSON.stringify({
                    mintAddress: mint_airdrop,
                    amount: airdrop_amount,
                    decimals: 9,
                })
            });
            const data = await response.json();
            if (!response.ok || !data.transaction) {
                toast.error(data?.error || "Failed to create airdrop transaction");
                return;
            }
            const tx = web3.Transaction.from(Buffer.from(data.transaction, "base64"));
            if (!(window as any).solana?.signAndSendTransaction) {
                toast.error("Connect Phantom first");
                return;
            }
            const { signature: sig } = await (window as any).solana.signAndSendTransaction(tx);
            toast.success("Airdrop claim submitted");
        } catch (e) {
            toast.error("Airdrop failed");
        }
    }
    // @ts-ignore
    const handleRecipientsUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            // @ts-ignore
            const content = event.target.result;
            // Parse recipients as an array, one per line
            // @ts-ignore
            const recipientsArray = content
                // @ts-ignore
                .split("\n")
                // @ts-ignore
                .map((line) => line.trim())
                // @ts-ignore
                .filter((line) => line); // Remove empty lines
            setRecipients(recipientsArray);
        };

        reader.readAsText(file);
    };
    return(
        <div className="space-y-1">
            <Input
                placeholder="Mint address"
                value={mint_airdrop}
                //@ts-ignore
                onChange={(e) => setMint_mint_airdrop(e.target.value)}
            />

            <label className="block">
                Upload Recipients (TXT file with one recipient per line):
                <input
                    type="file"
                    accept=".txt"
                    onChange={handleRecipientsUpload}
                    className="block mt-1"
                />
            </label>

            <Input
                placeholder="Airdrop amount (token units)"
                value={airdrop_amount}
                //@ts-ignore
                onChange={(e) => setairdrop_amount(e.target.value)}
            />

            <Button onClick={handleAirdrop}>Claim Airdrop (direct)</Button>
        </div>
    )
}
