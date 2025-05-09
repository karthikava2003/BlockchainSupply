import { ethers } from "ethers";
import SupplyChainABI from "./SupplyChain.json"; // Export the ABI from Hardhat

const CONTRACT_ADDRESS = "0xCcafC19Ea3d7Fa4131E0Db25248610D020489692";
let provider, signer, contract;

export async function getCurrentAccount() {
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts.length > 0 ? accounts[0] : null; // Return the first account if available
}

export async function initializeProvider() {
  if (!window.ethereum) {
    console.error("MetaMask is not installed. Please install it to use this app.");
    return;
  }

  try {
    // Check if already connected
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) {
      // Request account access if not connected
      await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    // Initialize the provider
    provider = new ethers.BrowserProvider(window.ethereum);

    // Get the signer (the user's account)
    signer = await provider.getSigner();

    // Initialize the contract
    contract = new ethers.Contract(CONTRACT_ADDRESS, SupplyChainABI, signer);

    console.log("Provider, signer, and contract initialized successfully.");
  } catch (error) {
    if (error.code === -32002) {
      console.error("Already processing eth_requestAccounts. Please wait.");
    } else if (error.code === 4001) {
      console.error("User rejected the request.");
    } else {
      console.error("Error initializing provider:", error);
    }
  }
}

export async function getContract() {
  if (!contract) {
    await initializeProvider();
  }
  return contract;
}
