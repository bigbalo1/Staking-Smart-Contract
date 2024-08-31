import { expect } from "chai";
import { ethers } from "hardhat";

describe("EtherStaking", function () {
    async function deployEtherStaking() {
        const [deployer, user1, user2] = await ethers.getSigners();

        // Deploy the EtherStaking contract
        const EtherStakingFactory = await ethers.getContractFactory("EtherStaking");
        const etherStaking = await EtherStakingFactory.deploy();
        // Wait until the contract is deployed
        await etherStaking.deployed();

        return { etherStaking, deployer, user1, user2 };
    }

    describe("Deployment", function () {
        it("Should deploy the contract successfully", async function () {
            const { etherStaking } = await deployEtherStaking();
            expect(etherStaking.address).to.be.properAddress;
        });
    });

    describe("Staking", function () {
        const stakingDuration = 60 * 60 * 24 * 7; // 1 week in seconds
        const initialStakeAmount = ethers.parseUnits("1", "ether"); // 1 Ether in wei

        it("Should allow users to stake Ether", async function () {
            const { etherStaking, user1 } = await deployEtherStaking();

            await etherStaking.connect(user1).stake(stakingDuration, { value: initialStakeAmount });

            const stake = await etherStaking.stakes(user1.address);
            expect(stake.amount).to.be.closeTo(initialStakeAmount, ethers.parseUnits("0.01", "ether")); // Allow slight reward variance
            expect(stake.stakingDuration).to.equal(stakingDuration);
        });

        it("Should not allow staking 0 Ether", async function () {
            const { etherStaking, user1 } = await deployEtherStaking();

            await expect(etherStaking.connect(user1).stake(stakingDuration, { value: 0 }))
                .to.be.revertedWith("Cannot stake 0 Ether");
        });

        it("Should not allow staking with 0 duration", async function () {
            const { etherStaking, user1 } = await deployEtherStaking();

            await expect(etherStaking.connect(user1).stake(0, { value: initialStakeAmount }))
                .to.be.revertedWith("Staking duration must be greater than 0");
        });

        it("Should allow withdrawal after staking period ends", async function () {
            const { etherStaking, user1 } = await deployEtherStaking();

            await etherStaking.connect(user1).stake(stakingDuration, { value: initialStakeAmount });

            // Move time forward by 1 week
            await ethers.provider.send("evm_increaseTime", [stakingDuration + 1]);
            await ethers.provider.send("evm_mine", []);

            const initialBalance = await ethers.provider.getBalance(user1.address);
            await etherStaking.connect(user1).withdraw();

            const finalBalance = await ethers.provider.getBalance(user1.address);
            const stake = await etherStaking.stakes(user1.address);

            expect(stake.amount).to.equal(0);
            expect(finalBalance).to.be.gt(initialBalance); // Ensure the balance increased
        });

        it("Should not allow early withdrawal", async function () {
            const { etherStaking, user1 } = await deployEtherStaking();

            await etherStaking.connect(user1).stake(stakingDuration, { value: initialStakeAmount });

            await expect(etherStaking.connect(user1).withdraw())
                .to.be.revertedWith("Staking period has not ended yet");
        });

        it("Should correctly calculate rewards", async function () {
            const { etherStaking, user1 } = await deployEtherStaking();

            await etherStaking.connect(user1).stake(stakingDuration, { value: initialStakeAmount });

            // Simulate time passing (half the staking duration)
            await ethers.provider.send("evm_increaseTime", [stakingDuration / 2]);
            await ethers.provider.send("evm_mine", []);

            const rewards = await etherStaking.calculateRewards(user1.address);
            expect(rewards).to.be.above(0);
        });

        it("Should report the correct contract balance", async function () {
            const { etherStaking, user1 } = await deployEtherStaking();

            await etherStaking.connect(user1).stake(stakingDuration, { value: initialStakeAmount });

            const contractBalance = await etherStaking.getContractBalance();
            expect(contractBalance).to.equal(initialStakeAmount);
        });
    });
});
