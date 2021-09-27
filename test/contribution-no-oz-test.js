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

  describe("changeMaxContribution", function () {
    it("changes the max contribution", async function () {
      [owner] = await ethers.getSigners();
      contractAddress = this.contribution.address;
      await this.contribution.connect(owner).changeMaxContribution(2);
      maxContribution = await this.contribution.maxContribution();

      expect(maxContribution).to.equal(2);
    });
  });

  describe("getContractBalance", function () {
    it("gets the balance of the contract", async function () {
      getBalance = await this.contribution.contractBalance();
      expect(getBalance).to.equal(0);
    });

    it("gets the balance of the contract when the balance has increased", async function () {
      [user] = await ethers.getSigners();
      contractAddress = this.contribution.address;
      await this.contribution.connect(user).deposit({
        value: 10,
      });
      getBalance = await this.contribution.contractBalance();

      expect(getBalance).to.equal(10);
    });
  });
});
