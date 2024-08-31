import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the ContractFactory for EtherStaking
  const EtherStaking = await ethers.getContractFactory("EtherStaking");

  // Deploy the contract and cast it explicitly to Contract
  const etherStaking = (await EtherStaking.deploy()) as unknown as Contract;
  await etherStaking.deployed();

  console.log("EtherStaking deployed to:", etherStaking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
