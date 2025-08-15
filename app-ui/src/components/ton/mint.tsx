import {Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {useState} from "react";
import { useTonConnectUI } from '@tonconnect/ui-react';
import type { SendTransactionRequest } from '@tonconnect/sdk';
import {api_uri} from "@/utils.ts"
import {useNetwork} from "@/components/navbar/networkContext.tsx";

//Mint ton tokens
export function TonMint() {
    const sleep = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));
    const { network } = useNetwork();
    // State for input fields
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenDescription, setTokenDescription] = useState("");
    const [tokenImage, setTokenImage] = useState("");
    const [tokenAmount, setTokenAmount] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [tonConnectUI] = useTonConnectUI();

    // Handle file upload
    const handleImageUpload = (file: File) => {
        setImageFile(file);
        setTokenImage("");  // Clear the image URL if a file is uploaded
    };

    const handleMint = async () => {
        if(tonConnectUI) {
            let uploadedImageUrl = tokenImage; // Default to URL input
            if(imageFile) {
                // If image file is uploaded, send it to the backend for handling (e.g., save to IPFS or cloud)
                const formData = new FormData();
                formData.append("file", imageFile);

                const imageUploadResponse = await fetch(api_uri+"/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const uploadResult = await imageUploadResponse.json();
                uploadedImageUrl = uploadResult.imageUrl;  // Assume the backend returns the image URL
            }


            // Sending mint creation request
            const response = await fetch(api_uri+"/api/create_mint", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    network_type: network,
                    type: "ton",
                    tokenName: tokenName,
                    tokenSymbol: tokenSymbol,
                    tokenImage: uploadedImageUrl,  // Use uploaded image or URL
                    tokenDescription: tokenDescription,
                    numRecipients: "owner",
                    amount_per_account: tokenAmount,
                    publicKey: tonConnectUI.account?.address,
                })
            });

            const body = await response.json();
            console.log(body.stateInit);


            // Prepare and send the transaction requests
            const transactionRequest: SendTransactionRequest = {
                validUntil: Math.floor(Date.now() / 1000) + 3600,
                messages: [
                    {
                        address: body.address,
                        amount: body.amount,
                        stateInit: body.stateInit,
                    }
                ]
            };

            await tonConnectUI.sendTransaction(transactionRequest);
            await sleep(20000)

            // Additional transaction
            const transactionRequest2: SendTransactionRequest = {
                validUntil: Math.floor(Date.now() / 1000) + 3600,
                messages: [
                    {
                        address: body.address,
                        amount: (50000000).toString(),
                        payload: body.payload,
                    }
                ]
            };
            await tonConnectUI.sendTransaction(transactionRequest2);
        }
    };

    return (
        <div className="text-sm space-y-1">
            <div className="space-y-2">
                <Input
                    placeholder="Token Name"
                    value={tokenName}
                    //@ts-ignore
                    onChange={(e) => setTokenName(e.target.value)}
                />
                <Input
                    placeholder="Token Symbol"
                    value={tokenSymbol}
                    //@ts-ignore
                    onChange={(e) => setTokenSymbol(e.target.value)}
                />
                <Input
                    placeholder="Token Description"
                    value={tokenDescription}
                    //@ts-ignore
                    onChange={(e) => setTokenDescription(e.target.value)}
                />
                <Input
                    placeholder="Token amount"
                    value={tokenAmount}
                    //@ts-ignore
                    onChange={(e) => setTokenAmount(e.target.value)}
                />
                <Input
                    placeholder="Token Image URL"
                    value={tokenImage}
                    //@ts-ignore
                    onChange={(e) => setTokenImage(e.target.value)}
                    disabled={imageFile !== null}
                />
            </div>
            <input
                type="file"
                accept="image/*"
                //@ts-ignore
                onChange={(event) => {
                    // @ts-ignore
                    const file = event.target.files[0];
                    if (file) {
                        handleImageUpload(file);
                    }
                }}
                style={{ display: 'block', margin: '10px 0' }}
            />


            <Button onClick={handleMint} className="flex items-center gap-1 mb-2">
                <span>Create mint</span>
            </Button>
        </div>
    );
}
