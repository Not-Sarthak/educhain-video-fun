// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/factory/TimeTokenFactory.sol";

contract DeployTimeToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        TimeTokenFactory factory = new TimeTokenFactory();
        
        factory.createTimeToken("MyTime", "TIME");

        vm.stopBroadcast();
    }
}