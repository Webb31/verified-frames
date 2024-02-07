import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export const rpcClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function getAddressesWithEns(
  addresses: string[]
): Promise<string[]> {
  const promises = addresses.map(async (address) => {
    let ensName: string | null = null;
    try {
      ensName = await rpcClient.getEnsName({
        address: address as `0x${string}`,
      });
    } catch (err) {
      console.log(err);
      return address; // Return the original address if there's an error
    }

    // If getEnsName() returns null (no ENS record), return the original address
    return ensName === null ? address : ensName;
  });

  // Use Promise.all to wait for all promises to resolve
  return Promise.all(promises);
}
