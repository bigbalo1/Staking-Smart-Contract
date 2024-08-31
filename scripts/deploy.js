"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
async function main() {
    const [deployer] = await hardhat_1.ethers.getSigners();
    const etherStaking = await hardhat_1.ethers.getContractAt("EtherStaking", "your_contract_address_here");
    // Example of staking 1 ETH for 3600 seconds
    await etherStaking.stake(3600, { value: hardhat_1.ethers.utils.parseEther("1") });
    // Check balance
    const balance = await etherStaking.getContractBalance();
    console.log("Contract balance:", hardhat_1.ethers.utils.formatEther(balance));
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
