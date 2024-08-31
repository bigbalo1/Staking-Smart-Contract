// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EtherStaking {
    struct Stake {
        uint256 amount;
        uint256 depositTime;
        uint256 stakingDuration;
    }

    mapping(address => Stake) public stakes;

    uint256 public rewardRate = 5; // 5% annual reward rate
    uint256 public constant SECONDS_IN_A_YEAR = 365 * 24 * 60 * 60;

    event Staked(address indexed user, uint256 amount, uint256 duration);
    event Withdrawn(address indexed user, uint256 amount, uint256 rewards);

    function stake(uint256 durationInSeconds) external payable {
        require(msg.value > 0, "Cannot stake 0 Ether");
        require(durationInSeconds > 0, "Staking duration must be greater than 0");

        Stake storage userStake = stakes[msg.sender];
        
        uint256 rewards = calculateRewards(msg.sender);
        userStake.amount += rewards;

        userStake.amount += msg.value;
        userStake.depositTime = block.timestamp;
        userStake.stakingDuration = durationInSeconds;

        emit Staked(msg.sender, msg.value, durationInSeconds);
    }

    function withdraw() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No stake to withdraw");

        uint256 stakingEndTime = userStake.depositTime + userStake.stakingDuration;
        require(block.timestamp >= stakingEndTime, "Staking period has not ended yet");

        uint256 rewards = calculateRewards(msg.sender);
        userStake.amount += rewards;

        uint256 amountToWithdraw = userStake.amount;
        userStake.amount = 0;

        payable(msg.sender).transfer(amountToWithdraw);

        emit Withdrawn(msg.sender, amountToWithdraw, rewards);
    }

    function calculateRewards(address user) public view returns (uint256) {
        Stake memory userStake = stakes[user];
        if (userStake.amount == 0 || block.timestamp < userStake.depositTime) {
            return 0;
        }
        
        uint256 stakingDuration = block.timestamp - userStake.depositTime;
        uint256 reward = (userStake.amount * rewardRate * stakingDuration) / (SECONDS_IN_A_YEAR * 100);
        return reward;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
