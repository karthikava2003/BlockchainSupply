import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore"; 
import { ethers } from "ethers";
import { db } from "./firebaseConfig"; 
import contractABI from "./SupplyChain.json"; // Ensure ABI file is correct
import DistributorPage from "./Distributor";
import RetailerPage from "./Retailer";
import CustomerPage from "./Customer";
import React from 'react';
import './App.css';
import yourImage from './assets/image 1.png';
//import HomePage from "./Home";


const CONTRACT_ADDRESS = "0xCcafC19Ea3d7Fa4131E0Db25248610D020489692"; // Ensure this is correct

function Home() {
  return(
    <div className="home-container">
      {/*<h2>Welcome to Blockchain Supply Chain</h2>*/}
    </div>
  );
}

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [product, setProduct] = useState(null);
  const [itemId, setItemId] = useState("123"); // Default Item ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);

        // Load smart contract
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        setContract(contractInstance);
        console.log("✅ Contract Loaded:", contractInstance);
      } catch (err) {
        console.error(" Wallet connection failed:", err);
        setError("Failed to connect wallet.");
      }
    } else {
      setError(" MetaMask not detected. Please install MetaMask.");
    }
  }

  // Fetch temperature data from Firebase
  async function fetchFirebaseData(id) {
    try {
      setLoading(true);
      const docRef = doc(db, "temperatureData", `product_${id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Temperature Data:", data);
        setTemperature(data.sensedTemperature);
      } else {
        console.log("No temperature data found!");
        setTemperature(null);
      }
    } catch (error) {
      console.error(" Error fetching temperature data:", error);
      setError("Error fetching temperature data.");
    } finally {
      setLoading(false);
    }
  }

  // Fetch product data from blockchain
  async function fetchProductData(id) {
    if (!contract) {
      setError(" Contract not loaded. Try reconnecting the wallet.");
      return;
    }

    try {
      setLoading(true);

      // Debug: Check total items (if your contract has a totalItems variable)
      const totalItems = await contract.totalItems?.(); 
      console.log("Total Items in Contract:", totalItems?.toString());

      
      const productData = await contract.items(ethers.toBigInt(id)); // Ensure items function exists in contract
      console.log(" Product Data:", productData);

      setProduct({
        id: productData[0].toString(),
        name: productData[1],
        mfDate: productData[2].toString(),
        expDate: productData[3].toString(),
        totalQty: productData[4].toString(),
        distributorQty: productData[5].toString(),
        retailerQty: productData[6].toString(),
        customerQty: productData[7].toString(),
        currentOwner: productData[8],
        minTemp: productData[9].toString(),
        maxTemp: productData[10].toString()
      });
    } catch (error) {
      console.error("  Error fetching product data:", error);
      setError("Error fetching product data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Router>
      <div className="app-container">
        <img src={yourImage} alt="Header" className="header-image" />
        <h1>Blockchain Supply Chain</h1>
        {account ? <p> Connected Wallet: {account}</p> : <p> Not Connected</p>}
        
        <nav>
          <Link to="/">Home</Link> | <Link to="/distributor">Distributor</Link> | <Link to="/retailer">Retailer</Link> | <Link to="/customer">Customer</Link>
        </nav>

       <div>
          <h3>Fetch Product & Temperature Data</h3>
          <label>ITEM ID :</label>
          <input type="text" placeholder="Enter Item ID" value={itemId} onChange={(e) => setItemId(e.target.value)} />fr
          <button onClick={() => { fetchFirebaseData(itemId); fetchProductData(itemId); }}>
            {loading ? "Loading..." : "Fetch Data"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        {temperature !== null && <p>🌡 Temperature: {temperature}°C</p>}
        
        {product && (
          <div>
            <h3>Product Details</h3>
            <p><strong>ID:</strong> {product.id}</p>
            <p><strong>Name:</strong> {product.name}</p>
            <p><strong>Manufacturing Date:</strong> {product.mfDate}</p>
            <p><strong>Expiry Date:</strong> {product.expDate}</p>
            <p><strong>Total Quantity:</strong> {product.totalQty}</p>
            <p><strong>Distributor Quantity:</strong> {product.distributorQty}</p>
            <p><strong>Retailer Quantity:</strong> {product.retailerQty}</p>
            <p><strong>Customer Quantity:</strong> {product.customerQty}</p>
            <p><strong>Current Owner:</strong> {product.currentOwner}</p>
            <p><strong>Min Temperature:</strong> {product.minTemp}°C</p>
            <p><strong>Max Temperature:</strong> {product.maxTemp}°C</p>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/distributor" element={<DistributorPage />} />
          <Route path="/retailer" element={<RetailerPage />} />
          <Route path="/customer" element={<CustomerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
