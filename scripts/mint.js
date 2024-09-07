const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpcLink, data);

  // Construct and sign transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  // Replace with your actual deployed contract address
  const nftAddress = "0x5f62F9f728355D7848B54378e502D540D4EB4C12"; // Replace with your ERC-721 contract address

  // Get the signer (the account initiating the mint)
  const [signer] = await hre.ethers.getSigners();

  // Attach to the deployed ERC-721 contract
  const nftContract = await hre.ethers.getContractAt("TestPrivateNFT", nftAddress);

  // Define the mint function
  const functionName = "safeMint";
  const recipientAddress = "0xfE84358f3A41e17a4861876502689cdBDbb6cfAD"; // Replace with actual recipient

  console.log(`Minting NFT to: ${recipientAddress}`);

  try {
    // Prepare the transaction data by encoding the mint function and its arguments
    const transactionData = nftContract.interface.encodeFunctionData(functionName, [recipientAddress]);

    // Send the shielded transaction to mint the NFT
    const transaction = await sendShieldedTransaction(signer, nftAddress, transactionData, 0);

    console.log(`Transaction submitted! Transaction hash: ${transaction.hash}`);
    await transaction.wait();

    console.log("NFT minted successfully!");
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
