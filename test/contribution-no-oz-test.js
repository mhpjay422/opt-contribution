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

  describe("deposit", function () {
    it("allows a user to make a deposit", async function () {
      [owner] = await ethers.getSigners();
      contractAddress = this.contribution.address;
      await this.contribution.connect(owner).deposit({
        value: 10,
      });

      expect(await this.contribution.getContractBalance()).to.equal(10);
    });

    it("disallows a user to make a deposit when greater than the maximum allowed", async function () {
      [owner] = await ethers.getSigners();
      contractAddress = this.contribution.address;

      await expect(
        this.contribution.connect(owner).deposit({
          value: 11,
        })
      ).to.be.revertedWith("your balance is greater than the allowed amount");
    });

    it("disallows a user to make a deposit when greater than the maximum allowed after there is already a balance in the account", async function () {
      [owner] = await ethers.getSigners();
      contractAddress = this.contribution.address;
      await this.contribution.connect(owner).deposit({
        value: 10,
      });

      await expect(
        this.contribution.connect(owner).deposit({
          value: 1,
        })
      ).to.be.revertedWith("your balance is greater than the allowed amount");
    });

    it("disallows a user to make a deposit when canDeposit is set to false", async function () {
      [owner] = await ethers.getSigners();
      contractAddress = this.contribution.address;
      await this.contribution.connect(owner).deposit({
        value: 1,
      });
      await this.contribution
        .connect(owner)
        .closeContributionAndEnableWithdraw();

      await expect(
        this.contribution.connect(owner).deposit({
          value: 1,
        })
      ).to.be.revertedWith("Deposit has been disabled");
    });
  });

  describe("changeMaxContribution", function () {
    it("changes the max contribution", async function () {
      [owner] = await ethers.getSigners();
      contractAddress = this.contribution.address;
      await this.contribution.connect(owner).changeMaxContribution(2);
      maxContribution = await this.contribution.maxContribution();

      expect(maxContribution).to.equal(2);
    });
    it("errors when a non-owner tries to change the max contribution", async function () {
      [owner, user] = await ethers.getSigners();
      contractAddress = this.contribution.address;
      contribution = this.contribution;

      await expect(
        contribution.connect(user).changeMaxContribution(2)
      ).to.be.revertedWith("only the owner may change the max contribution");
    });
  });

  describe("getContractBalance", function () {
    it("gets the balance of the contract", async function () {
      getBalance = await this.contribution.getContractBalance();
      expect(getBalance).to.equal(0);
    });

    it("gets the balance of the contract when the balance has increased", async function () {
      [owner, user1] = await ethers.getSigners();
      contractAddress = this.contribution.address;
      await this.contribution.connect(user).deposit({
        value: 10,
      });
      getBalance = await this.contribution.getContractBalance();

      expect(getBalance).to.equal(10);
    });
  });
});
