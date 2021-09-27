const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContributionNoOz", function () {
  before(async function () {
    this.Contribution = await ethers.getContractFactory("ContributionNoOz");
  });

  beforeEach(async function () {
    this.contribution = await this.Contribution.deploy();
    await this.contribution.deployed();
  });

  describe("getContractBalance", function () {
    it("gets the balance of the contract", async function () {
      getBalance = await this.contribution.getContractBalance();

      expect(getBalance).to.equal(0);
    });

    it("gets the balance of the contract when the balance has increased", async function () {
      [user] = await ethers.getSigners();
      contractAddress = this.contribution.address;
      depositValue = 10;

      await this.contribution.connect(user).deposit({
        value: depositValue,
      });
      getBalance = await this.contribution.getContractBalance();
      expect(getBalance).to.equal(10);
    });
  });
});
