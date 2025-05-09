// Import necessary libraries
const { ethers } = require("hardhat");
const firebase = require("firebase/app");
require("firebase/database");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKeXKrEIpcqId7pDaOnQrRmlKf9uoRkOs",
  authDomain: "supplychain-62e61.firebaseapp.com",
  databaseURL: "https://supplychain-62e61-default-rtdb.firebaseio.com",
  projectId: "supplychain-62e61",
  storageBucket: "supplychain-62e61.firebasestorage.app",
  messagingSenderId: "1035873399491",
  appId: "1:1035873399491:web:ad954710023d17b0366876"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to your Firebase Realtime Database
const database = firebase.database();

// Address of the deployed contract
const contractAddress = "0xCcafC19Ea3d7Fa4131E0Db25248610D020489692";

// ABI of the deployed contract
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "itemId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "itemName",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "totalQty",
            "type": "uint256"
          }
        ],
        "name": "ItemAdded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "itemId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "reason",
            "type": "string"
          }
        ],
        "name": "ItemBlocked",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "itemId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_itemId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_qty",
            "type": "uint256"
          },
          {
            "internalType": "int256",
            "name": "sensedTemperature",
            "type": "int256"
          }
        ],
        "name": "accessItem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_itemId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_itemName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_mfDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_expDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_totalQty",
            "type": "uint256"
          },
          {
            "internalType": "int256",
            "name": "_minTemp",
            "type": "int256"
          },
          {
            "internalType": "int256",
            "name": "_maxTemp",
            "type": "int256"
          }
        ],
        "name": "addItem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_itemName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_qty",
            "type": "uint256"
          },
          {
            "internalType": "int256",
            "name": "sensedTemperature",
            "type": "int256"
          }
        ],
        "name": "claimOwnershipByName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "distributor",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_itemId",
            "type": "uint256"
          }
        ],
        "name": "getItemDetails",
        "outputs": [
          {
            "internalType": "string",
            "name": "itemName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "manufacturingDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "expiryDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalQuantity",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "distributorStock",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "retailerStock",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "customerStock",
            "type": "uint256"
          },
          {
            "internalType": "int256",
            "name": "minTemperature",
            "type": "int256"
          },
          {
            "internalType": "int256",
            "name": "maxTemperature",
            "type": "int256"
          },
          {
            "internalType": "bool",
            "name": "isItemBlocked",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_itemName",
            "type": "string"
          }
        ],
        "name": "getItemIdByName",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "items",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "itemId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "itemName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "itemMfD",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "itemExpD",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalQty",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "distributorQty",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "retailerQty",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "customerQty",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "currentOwner",
            "type": "address"
          },
          {
            "internalType": "int256",
            "name": "minTemp",
            "type": "int256"
          },
          {
            "internalType": "int256",
            "name": "maxTemp",
            "type": "int256"
          },
          {
            "internalType": "bool",
            "name": "isBlocked",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "retailer",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_distributor",
            "type": "address"
          }
        ],
        "name": "setDistributor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_retailer",
            "type": "address"
          }
        ],
        "name": "setRetailer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
];

async function main() {
  // Fetch temperature data from Firebase
  const tempRef = database.ref('path/to/temperature');
  tempRef.on('value', async (snapshot) => {
    const temperature = snapshot.val();
    console.log(`Fetched temperature: ${temperature}`);

    // Interact with the deployed contract
    const [signer] = await ethers.getSigners();
    const supplyChainContract = new ethers.Contract(contractAddress, contractABI, signer);

    // Example function call to update temperature in the contract
    // Ensure your contract has a function to handle this update
    const tx = await supplyChainContract.updateTemperature(temperature);
    await tx.wait();
    console.log('Temperature updated on the blockchain.');
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
