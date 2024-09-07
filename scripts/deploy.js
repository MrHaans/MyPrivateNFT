const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const TestPrivateNFT = await ethers.getContractFactory("TestPrivateNFT");
  const initialOwner = deployer.address; // Or another address if needed
  const nft = await TestPrivateNFT.deploy(initialOwner);

  console.log(`TestPrivateNFT deployed to: ${await nft.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
