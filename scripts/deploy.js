const hre = require("hardhat");

async function main() {
  const Auth = await hre.ethers.getContractFactory("ChallengeResponseAuth");
  const auth = await Auth.deploy();
  await auth.waitForDeployment();

  console.log("ChallengeResponseAuth deployed to:", await auth.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
