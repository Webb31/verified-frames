import { Attestation } from "@ethereum-attestation-service/eas-sdk";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { EAS_ATTESTATION_ABI } from "./easAbi";

const EASContractAddress = "0x4200000000000000000000000000000000000021"; // base-mainnet predeploy

export function isValidAttestation(uid: string): Promise<boolean> {
  const client = createPublicClient({
    chain: base,
    transport: http(),
  });

  return client
    .readContract({
      address: EASContractAddress,
      abi: EAS_ATTESTATION_ABI,
      functionName: "getAttestation",
      args: [uid],
    })
    .then((data) => {
      const attestation = data as Attestation;
      // only checking revocation time since CB verifications do not expire
      if (attestation.revocationTime === BigInt(0)) {
        return true;
      }

      return false;
    });
}
