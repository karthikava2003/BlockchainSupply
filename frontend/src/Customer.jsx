import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { db } from "./firebaseConfig"; // Ensure Firebase is correctly configured
import { doc, getDoc } from "firebase/firestore";
import contractABI from "./SupplyChain.json";
import './Customer.css';


const CONTRACT_ADDRESS = "0xCcafC19Ea3d7Fa4131E0Db25248610D020489692";

export default function CustomerPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sensedTemperature, setSensedTemperature] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (!window.ethereum) {
      setStatusMessage("MetaMask not detected. Please install MetaMask.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setWalletAddress(userAddress);
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      setContract(contractInstance);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setStatusMessage("Wallet connection failed. Please try again.");
    }
  }

  // Fetch sensed temperature from Firebase using the item ID.
  async function fetchSensedTemperature(itemId) {
    try {
      // Construct the document ID as "product_{itemId}"
      const docId = `product_${itemId}`.trim();
      console.log("Fetching Firestore document:", docId);
      const docRef = doc(db, "temperatureData", docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.sensedTemperature;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching temperature data:", error);
      return null;
    }
  }

  // Claim item by fetching the item ID from the contract, then getting the sensed temperature from Firebase,
  // and finally calling claimOwnershipByName on the contract.
  async function claimItem() {
    if (!itemName || !quantity) {
      alert("Please enter item name and quantity.");
      return;
    }
    if (!contract) {
      alert("Contract not loaded. Please connect your wallet.");
      return;
    }

    try {
      // Get the item ID using the contract function getItemIdByName.
      let itemId = await contract.getItemIdByName(itemName);
      itemId = itemId.toString();
      console.log("Retrieved item ID:", itemId);
      
      // Fetch sensed temperature from Firebase using the item ID.
      const temp = await fetchSensedTemperature(itemId);
      if (temp === null) {
        alert("Sensed temperature data not available for this item.");
        return;
      }
      setSensedTemperature(temp);
      console.log("Fetched sensed temperature:", temp);

      // Validate quantity.
      const qty = parseInt(quantity);
      if (isNaN(qty) || qty <= 0) {
        alert("Invalid quantity. Enter a positive number.");
        return;
      }

      // Call claimOwnershipByName on the contract.
      // Note: The contract function is defined as claimOwnershipByName(string _itemName, uint _qty, int sensedTemperature)
      const tx = await contract.claimOwnershipByName(itemName, qty, parseInt(temp));
      setStatusMessage("Transaction sent! Waiting for confirmation...");
      await tx.wait();
      setStatusMessage("✅ Item claimed successfully!");
    } catch (error) {
      console.error("Error claiming item:", error);
      setStatusMessage("Failed to claim item. Check console for details.");
    }
  }

  return (
    <div className="customer-container">
      <h2>Customer Panel</h2>
      <p>Connected Wallet: {walletAddress || "Not connected"}</p>
      <label for="itemName">ITEM NAME : </label>
      <input
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <br></br>
      <label for="quantity">QUANTITY : </label>
      <input
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <br></br>
      {sensedTemperature !== null && (
        <p>Detected Temperature: {sensedTemperature}°C</p>
      )}
      <br></br>
      <button onClick={claimItem}>Claim Item</button>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
}
