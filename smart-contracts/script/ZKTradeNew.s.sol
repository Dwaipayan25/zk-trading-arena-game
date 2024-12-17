//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {Zktrade} from "../src/ZKTradeNew.sol";

contract UltraVerifierScript is Script {
    Zktrade public zktrade;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        zktrade = new Zktrade(0x831184d9013a22363E3d536530c9f877289D1648);
        vm.stopBroadcast();
    }
}

// 0xf382d4C2948158E49B47C28f616Ad8D5390903ed

