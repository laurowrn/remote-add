import React, { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import contract from "./hardhat/deployments/rinkeby/Token.json";
import { formatEther } from "ethers/lib/utils";
import { parseEther } from "ethers/lib/utils";
declare var window: any;

const contractAddress = contract.address;
const abi = contract.abi;

function App() {
  const [balance, setBalance] = useState("");
  const [amountFormContent, setAmountFormContent] = useState("");
  const [addressFormContent, setAddressFormContent] = useState("");

  function handleAmountChange(event: any) {
    setAmountFormContent(event.target.value);
  }
  function handleAddressChange(event: any) {
    setAddressFormContent(event.target.value);
  }
  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const data = formatEther(await contract.balanceOf(provider.getSigner().getAddress()));
      setBalance(data.toString());
    }
  }
  async function getTokens() {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.mint();
      await tx.wait();
    }
  }
  async function transferTokens() {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.transfer(addressFormContent, parseEther(amountFormContent));
      await tx.wait();
    }
  }

  return (
    <div className="App">
      <div className="form-divider">
        <button
          className="app-buttons"
          onClick={async () => {
            await getTokens();
          }}
        >
          Get some tokens!
        </button>
      </div>
      <div className="form-divider">
        <button
          className="app-buttons"
          onClick={async () => {
            await getBalance();
          }}
        >
          Get your balance
        </button>
        <div className="balance-container">{balance}</div>
      </div>
      <div className="form-divider">
        <label>Transfer </label>
        <input type="text" placeholder="enter amount of tokens" onChange={handleAmountChange} />
        <label>tokens to</label>
        <input type="text" placeholder="enter the address" onChange={handleAddressChange} />
        <button
          className="app-buttons"
          onClick={async () => {
            await transferTokens();
          }}
        >
          Transfer
        </button>
      </div>
    </div>
  );
}

export default App;
