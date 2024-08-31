import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Replace with the address of your ERC20 token contract
    const tokenAddress = "0xYourERC20TokenAddress";

    // Get the ContractFactory and deploy the contract
    const ERC20Staking = await ethers.getContractFactory("ERC20Staking");
    const erc20Staking = await ERC20Staking.deploy(tokenAddress);

    console.log("ERC20Staking deployed to:", erc20Staking.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
