import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

const EASContractAddress = "0x4200000000000000000000000000000000000021"; // base-mainnet predeploy

export function isEasVerified(address: string): Promise<boolean> {
  const easContract = new EAS(EASContractAddress);

  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const eas = easContract.connect(provider);

  return eas.getAttestation(address).then((attestation) => {
    if (
      attestation.revocationTime === BigInt(0) &&
      (attestation.expirationTime === BigInt(0) ||
        attestation.expirationTime > BigInt(Date.now() / 1000))
    ) {
      return true;
    }

    return false;
  });
}
