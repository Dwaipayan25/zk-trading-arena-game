// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Verifier {
    event ProofValidated(address indexed user, uint256 profit);

    function verifyProof(
        uint256 initialBalance,
        uint256 finalBalance,
        uint256 threshold
    ) public returns (bool) {
        uint256 profit = ((finalBalance - initialBalance) * 100) / initialBalance;
        require(profit >= threshold, "Profit threshold not met");

        emit ProofValidated(msg.sender, profit);
        return true;
    }
}
