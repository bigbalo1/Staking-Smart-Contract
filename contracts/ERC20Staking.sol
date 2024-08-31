// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ERC20Staking {
    using SafeMath for uint256;

    IERC20 public stakingToken;
    uint256 public rewardRate = 1e18; // Example: 1 token reward per second per token staked

    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 reward);

    constructor(IERC20 _stakingToken) {
        stakingToken = _stakingToken;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        stakingToken.transferFrom(msg.sender, address(this), amount);

        Stake storage userStake = stakes[msg.sender];
        userStake.amount = userStake.amount.add(amount);
        userStake.timestamp = block.timestamp;

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient stake amount");

        uint256 reward = calculateReward(msg.sender);

        userStake.amount = userStake.amount.sub(amount);
        userStake.timestamp = block.timestamp;

        stakingToken.transfer(msg.sender, amount);
        stakingToken.transfer(msg.sender, reward);

        emit Withdrawn(msg.sender, amount, reward);
    }

    function calculateReward(address user) public view returns (uint256) {
        Stake storage userStake = stakes[user];
        uint256 stakingDuration = block.timestamp.sub(userStake.timestamp);
        uint256 reward = userStake.amount.mul(rewardRate).mul(stakingDuration).div(1e18);
        return reward;
    }
}
