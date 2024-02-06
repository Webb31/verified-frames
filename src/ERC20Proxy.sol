// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract ERC20Proxy {
    IERC20 public token;
    mapping(address => bool) public recipients;

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function sendToken(address to, uint256 amount) public {
        // Add the `to` address to the mapping
        recipients[to] = true;

        // Perform the token transfer
        require(token.transfer(to, amount), "Token transfer failed");
    }
}
