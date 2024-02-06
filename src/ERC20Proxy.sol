// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title ERC20Proxy
/// @notice A proxy contract that distributes frame claim rewards and tracks which farcaster users
/// have already claimed a frame reward.

contract ERC20Proxy {
    IERC20 public token;
    mapping(address => bool) public recipients;

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    error FidAlreadyClaimed();

    function sendToken(uint32 fid, address to, uint256 amount) public {
        if (recipients[fid] == true) {
            revert FidAlreadyClaimed();
        }
        // Add the farcaster id to the recipients mapping
        recipients[fid] = true;

        // Perform the token transfer
        require(token.transfer(to, amount), "Token transfer failed");
    }
}
