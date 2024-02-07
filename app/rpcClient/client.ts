import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

export const rpcClient = createPublicClient({
  chain: base,
  transport: http(),
});
