import { VERIFICATION_INDEXER_ABI } from "./indexerAbi";
import { baseRpcClient } from "../rpcClient/client";

const indexerAddress = "0x2c7eE1E5f416dfF40054c27A62f7B357C4E8619C";
const verifiiedAccountSchema =
  "0x67f4ef704a08dfb74df8d9191b059ac9515fb5f8ffe83529a342958397fa732c"; // updated to #193

export function readAttestationUid(address: string): Promise<string> {
  return baseRpcClient
    .readContract({
      address: indexerAddress,
      abi: VERIFICATION_INDEXER_ABI,
      functionName: "getAttestationUid",
      args: [address, verifiiedAccountSchema],
    })
    .then((uid) => {
      return uid as string;
    });
}
