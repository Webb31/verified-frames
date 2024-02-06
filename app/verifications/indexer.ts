import { VERIFICATION_INDEXER_ABI } from "./indexerAbi";
import { ethers } from "ethers";

const indexerAddress = "0x2c7eE1E5f416dfF40054c27A62f7B357C4E8619C";
const provider = new ethers.JsonRpcProvider("https://mainnet.base.org	");

// Create a indexer instance
const indexer = new ethers.Contract(
  indexerAddress,
  VERIFICATION_INDEXER_ABI,
  provider
);

const verifiiedAccountSchema =
  "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9";

export function readAttestationUid(address: string): Promise<string> {
  return indexer.getAttestationUid(address, verifiiedAccountSchema);
}
