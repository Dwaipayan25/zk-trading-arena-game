// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Verifier.sol";

contract DeployVerifier is Script {
    function run() external {
        vm.startBroadcast();
        new Verifier();
        vm.stopBroadcast();
    }
}
