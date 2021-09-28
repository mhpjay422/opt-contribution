const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContributionNoOz", function () {
  before(async function () {
    this.Contribution = await ethers.getContractFactory("ContributionNoOz");
  });

  beforeEach(async function () {
    this.contribution = await this.Contribution.deploy();
    await this.contribution.deployed();
  });

  describe("closeContributionAndEnableWithdraw", function () {
    it("Does not allow a user to enable withdraw if not the owner", async function () {
      [owner, user, user2] = await ethers.getSigners();
      await this.contribution.connect(owner).deposit({
        value: 1,
      });

      await expect(
        this.contribution.connect(user).closeContributionAndEnableWithdraw()
      ).to.be.revertedWith("only the owner may change the ability to withdraw");
    });

    it("allows a user to enable withdraw the owner", async function () {
      [owner, user, user2] = await ethers.getSigners();
      await this.contribution.connect(owner).deposit({
        value: 1,
      });
      await this.contribution
        .connect(owner)
        .closeContributionAndEnableWithdraw();
      canWithdraw = await this.contribution.canWithdraw();
      canDeposit = await this.contribution.canDeposit();
      assert.isOk(canWithdraw);
      assert.isNotOk(canDeposit);
    });

    it("assigns a shareValue when called", async function () {
      [owner, user, user2] = await ethers.getSigners();
      await this.contribution.connect(owner).deposit({
        value: 1,
      });

      originialShareValue = await this.contribution.shareValue();

      await this.contribution
        .connect(owner)
        .closeContributionAndEnableWithdraw();

      newShareValue = await this.contribution.shareValue();
      assert.isOk(newShareValue > originialShareValue);
    });
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

  describe("withdraw", function () {
    it("disallows a user to withdraw when withdraw has not been enabled", async function () {
      [owner, user, user2] = await ethers.getSigners();
      await this.contribution.connect(owner).deposit({
        value: 1,
      });
      await this.contribution.connect(user).deposit({
        value: 1,
      });
      await this.contribution.connect(user2).deposit({
        value: 10,
      });

      await expect(
        this.contribution.connect(owner).withdraw()
      ).to.be.revertedWith("withdraw is not enabled");
    });

    it("allows a user to withdraw after withdraw has been enabled", async function () {
      [owner, user, user2] = await ethers.getSigners();
      await this.contribution.connect(owner).deposit({
        value: 1,
      });
      await this.contribution.connect(user).deposit({
        value: 1,
      });
      await this.contribution.connect(user2).deposit({
        value: 10,
      });
      await this.contribution
        .connect(owner)
        .closeContributionAndEnableWithdraw();
      await this.contribution.connect(owner).withdraw();
      newBalance = (await this.contribution.getContractBalance()).toNumber();
      expect(newBalance).to.eq(8);
    });

    it("disallows a user to withdraw when the users account has no balance", async function () {
      [owner, user] = await ethers.getSigners();
      await this.contribution.connect(owner).deposit({
        value: 10,
      });
      await this.contribution
        .connect(owner)
        .closeContributionAndEnableWithdraw();
      await expect(
        this.contribution.connect(user).withdraw()
      ).to.be.revertedWith("You are not eligible to withdraw");
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

  describe("transferOwnership", function () {
    it("allows the owner to transfer ownership", async function () {
      [owner, user, user2] = await ethers.getSigners();
      await this.contribution.connect(owner).transferOwnership(user.address);
      owner = await this.contribution.owner();

      expect(owner).to.eq(user.address);
    });

    it("does not allow the a non-owner to transfer ownership", async function () {
      [owner, user, user2] = await ethers.getSigners();

      await expect(
        this.contribution.connect(user).transferOwnership(user.address)
      ).to.be.revertedWith("only the owner may use this function");
    });
  });
});
