import {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {WalletConnectAdapter} from '@tronweb3/tronwallet-adapter-walletconnect';
import {TronWeb} from "tronweb"

function TronMint() {
    const adapter = new WalletConnectAdapter({
        network: "Mainnet",
        options: {
            relayUrl: 'wss://relay.walletconnect.com',
            projectId: import.meta.env.VITE_CONNECTOR_PID,
            metadata: {
                name: 'Example App',
                description: 'Example App',
                url: 'https://yourdapp-url.com',
                icons: ['https://yourdapp-url.com/icon.png'],
            },
        },
        // @ts-ignore
        web3ModalConfig: {
            themeMode: 'dark',
            explorerRecommendedWalletIds: [],
        },
    });
    const [myDetails, setMyDetails] = useState({
        name: 'none',
        address: 'none',
        balance: 0,
        frozenBalance: 0,
        network: 'none',
        link: 'false',
    });
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenDescription, setTokenDescription] = useState("");
    const [tokenAmount, setTokenAmount] = useState("");


    const connector = async () => {
        if (!isConnected) {
            await adapter.connect();
            if (adapter.address) {
                // @ts-ignore
                setMyDetails({
                    address: adapter.address, network: "",
                    name: ''
                });
                setAddress(adapter.address);
                setIsConnected(true);
            }
        } else {
            await adapter.disconnect();
            console.log(adapter.address);
            // @ts-ignore
            setMyDetails({
                address: "", balance: 0,
                name: ''
            });
            setAddress("");
            setIsConnected(false);
        }
    }

    const signAndSendTransaction = async () => {
        if (isConnected) {
            const tronweb = new TronWeb({
                fullHost: 'https://api.trongrid.io',
                headers: {'TRON-PRO-API-KEY': import.meta.env.VITE_TRON_PRO_API_KEY},
            });
            try {
                console.log(address);
                const response = await fetch("http://127.0.0.1:3030/api/create_mint", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "tron",
                        tokenName: tokenName,
                        tokenSymbol: tokenSymbol,
                        tokenImage: "empty",  // Use uploaded image or URL
                        tokenDescription: tokenDescription,
                        numRecipients: "owner",
                        amount_per_account: tokenAmount,
                        publicKey: address,
                    })
                });

                const body = await response.json();

                console.log(body.tx)
                const signtx = await adapter.signTransaction(body.tx)
                // Broadcast the transaction
                const broadcast = await tronweb.trx.sendRawTransaction(signtx);

                if (broadcast.result) {
                    // @ts-ignore
                    alert('Transaction successful! TXID: ' + broadcast.txid);
                } else {
                    alert('Transaction failed.');
                }
            } catch (error) {
                console.error('Error signing/sending transaction:', error);
                // @ts-ignore
                alert('Error signing or sending transaction: ' + error.message);
            }
        } else {
            alert("Wallet not connected. Please connect your Tron wallet.");
        }
    };


    return (
        <div className="Stats">
            <Button onClick={connector}>{isConnected ? 'Disconnect' : 'Connect'}</Button>
            <h4>Account Name: {""} </h4>
            <h4>My Address: {myDetails.address}</h4>
            <h4>
                Balance: {myDetails.balance} TRX (Frozen: {myDetails.frozenBalance} TRX)
            </h4>
            <h4>Network Selected: {myDetails.network}</h4>
            <h4>Link Established: {myDetails.link}</h4>
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
                    placeholder="Token Amount"
                    value={tokenAmount}
                    //@ts-ignore
                    onChange={(e) => setTokenAmount(e.target.value)}
                />
                <br/>
            </div>
            <Button onClick={signAndSendTransaction}>Send contract</Button>
        </div>
    );
}

export default TronMint;