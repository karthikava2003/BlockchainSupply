export const contractAddress = "0xCcafC19Ea3d7Fa4131E0Db25248610D020489692";
export const contractABI = [
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
]; // Add your ABI here
