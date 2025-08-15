import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Input } from "@/components/ui/input";
import {api_uri} from "@/utils.ts"
import {useNetwork} from "@/components/navbar/networkContext.tsx";

//TON airdop
export function TonAirdrop() {
    const [wallet] = useTonConnectUI();
    const [mint, setMint] = useState("");
    const [amount, setAmount] = useState("");
    const [recipients, setRecipients] = useState("");

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
            console.log(recipientsArray)
        };

        reader.readAsText(file);
    };


    const handleAirdrop = async () => {
        const { network } = useNetwork();
        try {
            await fetch(api_uri+"/api/airdrop", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    network_type: network,
                    type: "ton",
                    mint: mint,
                    payer: wallet.account?.address,
                    recipients: recipients,
                    lamports: amount,
                    send: 1
                }),
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleLoadTokens = async () => {
        if (wallet && recipients.length > 0 && mint && amount) {
            try {
                const response = await fetch(api_uri+"/api/airdrop", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "ton",
                        mint: mint,
                        payer: wallet.account?.address,
                        recipients: recipients,
                        lamports: amount
                    }),
                });

                if (!response.ok) {
                    console.error("Failed to fetch airdrop API", await response.text());
                    return;
                }

                const res = await response.json();
                console.log(res);


                const transactionRequests = [
                    {
                        validUntil: Math.floor(Date.now() / 1000) + 3600,
                        messages: [
                            {
                                address: res.address,
                                amount: res.amount,
                                payload: res.payload,
                            },
                        ],
                    }
                ];

                for (const transactionRequest of transactionRequests) {
                    await wallet.sendTransaction(transactionRequest);
                }

                console.log("Transactions sent successfully");
            } catch (error) {
                console.error("Error during liquidity handling:", error);
            }
        } else {
            console.error("Please ensure all fields are filled and recipients file is uploaded.");
        }
    };

    return (
        <div className="space-y-1">
            <Input
                placeholder="Mint address"
                value={mint}
                //@ts-ignore
                onChange={(e) => setMint(e.target.value)}
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
                placeholder="Airdrop amount"
                value={amount}
                //@ts-ignore
                onChange={(e) => setAmount(e.target.value)}
            />

            <Button onClick={handleLoadTokens}>Load Coins</Button>
            <Button onClick={handleAirdrop}>Create Airdrop</Button>
        </div>
    );
}
