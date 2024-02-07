import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

export const baseRpcClient = createPublicClient({
  chain: base,
  transport: http(),
});
