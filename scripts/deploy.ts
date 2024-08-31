import { ethers } from "hardhat";
import { ContractFactory, Contract } from 'ethers';
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the ContractFactory for EtherStaking
  const EtherStaking = await ethers.getContractFactory("EtherStaking");

  // Deploy the contract
  const etherStaking = await EtherStaking.deploy();

  // Ensure the contract is deployed
  await etherStaking.waitForDeployment();

  console.log("EtherStaking deployed to:", etherStaking.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
