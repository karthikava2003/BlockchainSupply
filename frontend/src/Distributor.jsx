import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "./SupplyChain.json"; // Ensure correct ABI file
import './Distributor.css';

const CONTRACT_ADDRESS = "0xCcafC19Ea3d7Fa4131E0Db25248610D020489692"; // Your deployed contract

export default function DistributorPage() {
    const [walletAddress, setWalletAddress] = useState("");
    const [distributor, setDistributor] = useState("");
    const [contract, setContract] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [newDistributor, setNewDistributor] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form Inputs
    const [itemId, setItemId] = useState("");
    const [itemName, setItemName] = useState("");
    const [mfDate, setMfDate] = useState("");
    const [expDate, setExpDate] = useState("");
    const [totalQty, setTotalQty] = useState("");
    const [minTemp, setMinTemp] = useState("");
    const [maxTemp, setMaxTemp] = useState("");

    useEffect(() => {
        connectWallet();
    }, []);

    async function connectWallet() {
        if (window.ethereum) {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();
            setWalletAddress(userAddress);
    
            const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
            setContract(contractInstance);
    
            // Call distributor() as a function
            const distAddr = await contractInstance.distributor();
            setDistributor(distAddr);
          } catch (error) {
            console.error("Wallet connection failed:", error);
            setStatusMessage("Wallet connection failed. Please try again.");
          }
        } else {
          setStatusMessage("MetaMask not detected. Please install MetaMask.");
        }
      }

    async function setDistributorAddress() {
        if (!contract) {
          setStatusMessage("Contract not loaded. Try reconnecting the wallet.");
          return;
        }
    
        if (!newDistributor || !ethers.isAddress(newDistributor)) {
          setStatusMessage("Please enter a valid Ethereum address for the new distributor.");
          return;
        }
    
        try {
          const tx = await contract.setDistributor(newDistributor);
          setStatusMessage("Transaction sent! Waiting for confirmation...");
          await tx.wait();
          setStatusMessage(`✅ Distributor set to ${newDistributor}`);
          setDistributor(newDistributor);
        } catch (error) {
          console.error("Error setting distributor:", error);
          setStatusMessage("Failed to set distributor. Check console for details.");
        }
      }
    async function addItem() {
        if (!contract) {
            setStatusMessage("Contract not loaded. Try reconnecting the wallet.");
            return;
        }

        if (walletAddress.toLowerCase() !== distributor.toLowerCase()) {
            setStatusMessage("Only the distributor can add items.");
            return;
        }

        try {
            const tx = await contract.addItem(
                ethers.toBigInt(itemId),
                itemName,
                ethers.toBigInt(mfDate),
                ethers.toBigInt(expDate),
                ethers.toBigInt(totalQty),
                ethers.toBigInt(minTemp),
                ethers.toBigInt(maxTemp)
            );

            setStatusMessage("Transaction sent! Waiting for confirmation...");
            await tx.wait();
            setStatusMessage(`✅ Item ${itemName} added successfully!`);
        } catch (error) {
            console.error("Error adding item:", error);
            setStatusMessage("Failed to add item. Check console for details.");
        }
    }

    async function viewItem() {
        if (!contract) {
            setStatusMessage("Contract not loaded. Try reconnecting the wallet.");
            return;
        }

        try {
            setLoading(true);
            const item = await contract.items(ethers.toBigInt(itemId));
            
            const formattedItem = {
                id: item[0].toString(),
                name: item[1],
                mfDate: item[2].toString(),
                expDate: item[3].toString(),
                totalQty: item[4].toString(),
                minTemp: item[9].toString(),
                maxTemp: item[10].toString()
            };

            setItems([formattedItem]);
            setStatusMessage(`✅ Item '${formattedItem.name}' fetched successfully!`);
        } catch (error) {
            console.error("Error fetching item:", error);
            setStatusMessage("❌ Failed to fetch item. Check console for details.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="distributor-container">
            <h2>Distributor Dashboard</h2>
            
            <h3>Set Distributor Address</h3>
            <input type="text" placeholder="New Distributor Address" value={newDistributor} onChange={(e) => setNewDistributor(e.target.value)} />
            <button onClick={setDistributorAddress}>Set Distributor</button>
            
            <h3>Add Item</h3>
            <label for="itemId">ITEM ID : </label>
            <input type="number" placeholder="Item ID" value={itemId} onChange={(e) => setItemId(e.target.value)} />
            <br></br>
            <label for="itemName">ITEM NAME  : </label>
            <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <br></br>
            <label for="manufacturing Date">MANUFACTURING DATE  : </label>
            <input type="number" placeholder="Manufacturing Date (YYYYMMDD)" value={mfDate} onChange={(e) => setMfDate(e.target.value)} />
            <br></br>
            <label for="expiryDate">EXPIRY DATE : </label>
            <input type="number" placeholder="Expiry Date (YYYYMMDD)" value={expDate} onChange={(e) => setExpDate(e.target.value)} />
            <br></br>
            <label for="totalQuantity">TOTAL QUANTITY : </label>
            <input type="number" placeholder="Total Quantity" value={totalQty} onChange={(e) => setTotalQty(e.target.value)} />
            <br></br>
            <label for="minTemp">MINIMUM TEMPERATURE : </label>
            <input type="number" placeholder="Min Temperature (°C)" value={minTemp} onChange={(e) => setMinTemp(e.target.value)} />
            <br></br>
            <label for="maxTemp"> MAXIMUM TEMPERATURE : </label>
            <input type="number" placeholder="Max Temperature (°C)" value={maxTemp} onChange={(e) => setMaxTemp(e.target.value)} />
            <br></br>
            <button onClick={addItem}>Add Item</button>

            <h3>View Item</h3>
            <input type="number" placeholder="Enter Item ID" value={itemId} onChange={(e) => setItemId(e.target.value)} />
            <button onClick={viewItem}>View Item</button>
            
            {statusMessage && <p className="status">{statusMessage}</p>}
        </div>
    );
}
