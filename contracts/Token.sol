// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Token {
    mapping(address => uint256) private _balances;
    uint256 private _totalSupply;
    address private _owner;

    constructor() {
        _owner = msg.sender;
        uint256 initialSupply = 1000 * 10**18;
        _balances[_owner] = initialSupply;
        _totalSupply = _totalSupply + initialSupply;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount)
        external
        returns (bool)
    {
        require(_balances[msg.sender] >= amount);
        require(msg.sender != address(0));
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function mint() external returns (bool) {
        _transfer(address(0), msg.sender, 10 ether);

        return true;
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal {
        require(recipient != address(0));

        unchecked {
            _balances[sender] = _balances[sender] - amount;
        }
        _balances[recipient] = _balances[recipient] + amount;
        emit Transfer(sender, recipient, amount);
    }

    event Transfer(address owner, address recipient, uint256 amount);
    event Mint(address recipient, uint256 amount);
}
