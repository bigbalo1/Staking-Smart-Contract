"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function main() {
    const hre = require("hardhat");
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    // Compile contracts
    const Staking = await hre.ethers.getContractFactory("Staking");
    const staking = await Staking.deploy();
    console.log("Staking contract deployed to:", staking.address);
    // Example interaction
    const stakeAmount = hre.ethers.utils.parseEther("1");
    await staking.stake(3600, { value: stakeAmount });
    // Check balance
    const balance = await hre.ethers.provider.getBalance(staking.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
