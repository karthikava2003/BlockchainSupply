import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { db } from "./firebaseConfig"; // Ensure Firebase is correctly configured
import { doc, getDoc } from "firebase/firestore";
import contractABI from "./SupplyChain.json"; 
import './Retailer.css';


const CONTRACT_ADDRESS = "0xCcafC19Ea3d7Fa4131E0Db25248610D020489692";

const Retailer = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [retailer, setRetailer] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sensedTemperature, setSensedTemperature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFirebaseData = async (id) => {
    try {
      setLoading(true);
      setError("");

      const docId = `product_${id}`.trim(); // Ensure correct string format
      console.log(`🔍 Fetching Firestore doc: ${docId}`);

      const docRef = doc(db, "temperatureData", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("✅ Temperature Data:", data);
        setSensedTemperature(data.sensedTemperature);
      } else {
        
        setSensedTemperature(null);
        setError("No temperature data found.");
      }
    } catch (error) {
      console.error("❌ Error fetching temperature data:", error);
      setError("Error fetching temperature data.");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
      if (itemId) {
        fetchFirebaseData(itemId);
      }
    }, [itemId]);

    

  const connectWallet = async () => {
    if (window.ethereum) {
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
      }
    } else {
      console.error("MetaMask not detected. Please install MetaMask.");
    }
  };

  const setRetailerAddress = async () => {
    if (!contract) return alert("Contract not initialized. Connect wallet first.");
    try {
      const tx = await contract.setRetailer(retailer);
      await tx.wait();
      alert("Retailer address set successfully!");
    } catch (error) {
      console.error("Error setting retailer address:", error);
    }
  };

  const accessItem = async () => {
    if (!contract) return alert("Contract not initialized. Connect wallet first.");


    if (!itemId || !quantity || sensedTemperature === null) {
      return alert("Please fill in all fields and ensure temperature data is available.");
    }

    console.log("🔍 Raw Input Values:", { itemId, quantity, sensedTemperature });

    const itemIdNum = parseInt(itemId);
    const quantityNum = parseInt(quantity);
    const temperatureNum = parseInt(sensedTemperature);

    console.log("🔢 Parsed Values:", { itemIdNum, quantityNum, temperatureNum });

    if (isNaN(itemIdNum) || isNaN(quantityNum) || isNaN(temperatureNum)) {
      return alert("Invalid input. Ensure all fields contain valid numbers.");
    }


    try {
      const tx = await contract.accessItem(itemIdNum, quantityNum, temperatureNum);
      await tx.wait();
      alert("Item accessed successfully!");
    } catch (error) {
      console.error("Error accessing item:", error);
    }
  };

  return (
    <div className="retailer-container">
      <h2>Retailer Panel</h2>
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>Connected Wallet: {walletAddress || "Not connected"}</p>
      
      <input placeholder="Set Retailer Address" onChange={(e) => setRetailer(e.target.value)} />
      <button onClick={setRetailerAddress} disabled={!contract}>Set Retailer</button>
      
      <h3>Access Item</h3>
      <label for="itemId">ITEM ID : </label>
      <input  placeholder="Item ID" onChange={(e) => setItemId(e.target.value)} />
      <br></br>
      <label for="Quantity">QUANTITY : </label>
      <input placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
      <br></br>
      <button onClick={accessItem} disabled={loading}>
        {loading ? "Fetching Temperature..." : "Access Item"}
      </button>

      {loading && <p>Loading temperature data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {sensedTemperature !== null && <p>Detected Temperature: {sensedTemperature}°C</p>}
    </div>
  );
};

export default Retailer;