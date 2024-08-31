import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20Staking", function () {
    let ERC20Staking: any, erc20Staking: any, ERC20Token: any, erc20Token: any;
    let owner: any, addr1: any, addr2: any;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy ERC20 token contract
        const ERC20Token = await ethers.getContractFactory("ERC20Token");
        erc20Token = await ERC20Token.deploy("Test Token", "TT", 1000000);
        await erc20Token.deployed();

        // Deploy ERC20 staking contract
        const ERC20Staking = await ethers.getContractFactory("ERC20Staking");
        erc20Staking = await ERC20Staking.deploy(erc20Token.address);
        await erc20Staking.deployed();

        // Transfer tokens to addr1
        await erc20Token.transfer(addr1.address, 1000);
    });

    it("should stake tokens", async function () {
        await erc20Token.connect(addr1).approve(erc20Staking.address, 500);
        await erc20Staking.connect(addr1).stake(500);

        const stake = await erc20Staking.stakes(addr1.address);
        expect(stake.amount).to.equal(500);
    });

    // Add more tests for withdraw and reward calculation
});
