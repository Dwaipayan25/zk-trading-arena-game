//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {UltraVerifier} from "../src/profitVerifier.sol";

contract UltraVerifierScript is Script {
    UltraVerifier public ultraVerifier;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        ultraVerifier = new UltraVerifier();
        vm.stopBroadcast();
    }
}

// 0x831184d9013a22363E3d536530c9f877289D1648

