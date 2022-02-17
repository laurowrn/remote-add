import {expect} from './chai-setup';
import {ethers, deployments, getNamedAccounts} from 'hardhat';
import { parseEther, formatEther } from "ethers/lib/utils";
import { Contract} from 'ethers';
import {node_url, accounts} from '../utils/network';

describe('Token', async ()=>{
    let Token: Contract, TokenAsOwner: Contract, TokenAsAccount1: Contract, TokenAsAccount2: Contract, owner: string, account1: string, account2: string;
    beforeEach(async ()=>{
        await deployments.fixture(['Token']);
        const signers = await ethers.getSigners();
        owner = await signers[0].getAddress();
        account1 = await signers[1].getAddress();
        account2 = await signers[2].getAddress();
        Token = await ethers.getContract('Token');
        TokenAsOwner = await ethers.getContract('Token', owner);
        TokenAsAccount1 = await ethers.getContract('Token', account1);
        TokenAsAccount2 = await ethers.getContract('Token', account2);
    })
    it("Should initialize the contract with the total balance in the owner account", async()=>{
        const ownerBalance = formatEther(await Token.balanceOf(owner));
        const supply = formatEther(await Token.totalSupply());
        console.log(accounts('rinkeby'));
        expect(ownerBalance).to.equal(supply);
        expect(ownerBalance).to.equal('1000.0');
    })
    it("Should transfer tokens", async()=>{
        
        const tx1 = await TokenAsOwner.transfer(account1, parseEther('50'));
        const tx2 = await TokenAsAccount1.transfer(account2, parseEther('10'));

        const ownerBalance = formatEther(await TokenAsOwner.balanceOf(owner));
        const account1Balance = formatEther(await TokenAsAccount1.balanceOf(account1));
        const account2Balance = formatEther(await TokenAsAccount2.balanceOf(account2));

        expect(ownerBalance).to.equal('950.0');
        expect(account1Balance).to.equal('40.0');
        expect(account2Balance).to.equal('10.0');
        
    })
    it("Should mint new tokens", async()=>{
        const tx = await TokenAsAccount1.mint();
        const account1Balance = formatEther(await TokenAsAccount1.balanceOf(account1));
        expect(account1Balance).to.equal('10.0');
    })
});