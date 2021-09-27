const hre = require("hardhat");

async function main() {
  const Contribute = await hre.ethers.getContractFactory("ContributionNoOz");
  const contribute = await Contribute.deploy();
  await contribute.deployed();
  console.log("contribution deployed to:", contribute.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
