import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

const EASContractAddress = "0x4200000000000000000000000000000000000021"; // base-mainnet predeploy

export function isValidAttestation(uid: string): Promise<boolean> {
  const easContract = new EAS(EASContractAddress);

  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const eas = easContract.connect(provider);

  return eas.getAttestation(uid).then((attestation) => {
    if (
      attestation.revocationTime === BigInt(0)
      // only checking revocations since CB verifications do not expire
      // && (attestation.expirationTime === BigInt(0) ||
      //   attestation.expirationTime > BigInt(Date.now() / 1000))
    ) {
      return true;
    }

    return false;
  });
}
