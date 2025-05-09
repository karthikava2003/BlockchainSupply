require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.0",
    networks: {
        holesky: {
            url: process.env.HOLKESKY_RPC_URL,
            accounts: [process.env.PRIVATE_KEY]
        }
    }
};
