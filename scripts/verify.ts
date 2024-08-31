import { run } from "hardhat";

async function main() {
  const contractAddress = "0x8a7a54aC67402df3c9661feD5E010EB2370D4679"; // Replace with your contract address
  const constructorArguments: any[] = []; // Add constructor arguments if any

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArguments,
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
