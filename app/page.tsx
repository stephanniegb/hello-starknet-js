"use client";
import { useEffect, useState } from "react";
import { connect, disconnect } from "starknetkit";
import { Contract, RpcProvider } from "starknet";
import contractABI from "./abis/abi.json";
const contractAddress =
  "0x077e0925380d1529772ee99caefa8cd7a7017a823ec3db7c003e56ad2e85e300";

export default function Home() {
  const [connection, setConnection] = useState();
  const [account, setAccount] = useState();
  const [address, setAddress] = useState<string | undefined>("");
  const [retrievedValue, setRetrievedValue] = useState("");

  const connectWallet = async () => {
    const connection = await connect({
      webWalletUrl: "https://web.argent.xyz",
    });

    if (connection && connection.wallet.isConnected) {
      setConnection(connection);
      const { wallet } = connection;
      if (wallet) {
        setAccount(wallet.account);
        setAddress(wallet.selectedAddress);
      }
    }
  };

  const disconnectWallet = async () => {
    await disconnect();
    setConnection(undefined);
    setAccount(undefined);
    setAddress("");
  };
  useEffect(() => {
    const connectStarknet = async () => {
      const connectObj = await connect({
        modalMode: "neverAsk",
        webWalletUrl: "https://web.argent.xyz",
      });
      if (connectObj && connectObj.wallet.isConnected) {
        setConnection(connection);
        const { wallet } = connectObj;
        if (wallet) {
          setAccount(wallet.account);
          setAddress(wallet.selectedAddress);
        }
      }
    };
    connectStarknet();
  }, []);

  const getCounter = async () => {
    const provider = new RpcProvider({
      nodeUrl:
        "https://starknet-mainnet.infura.io/v3/b19d3eeaef24491ea6536fd4a48fbd20",
    });
    const contract = new Contract(contractABI, contractAddress, provider);
    try {
      // instantiate the contract
      const counter = await contract.get_current_count();
      setRetrievedValue(counter.toString());
    } catch (err) {
      console.log(err);
    }
  };

  const increaseCounter = async () => {
    const contract = new Contract(contractABI, contractAddress, account);

    try {
      if (account) await contract.increment();
    } catch (err) {
      console.log(err);
    }
  };

  const decreaseCounter = async () => {
    const contract = new Contract(contractABI, contractAddress, account);
    try {
      account && (await contract.decrement());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main>
      <div>
        <p>Address: {address && address}</p> <br />
        {connection ? (
          <button onClick={disconnectWallet}>disconnect</button>
        ) : (
          <button onClick={connectWallet}>connect wallet</button>
        )}
      </div>
      <button onClick={getCounter}>Get count</button>
      <h2>Count: {retrievedValue} </h2>
      <div className="flex gap-6">
        <button onClick={increaseCounter}>Increase</button>
        <button onClick={decreaseCounter}>decrease</button>
      </div>
    </main>
  );
}
