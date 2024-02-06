import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from "./config";

const frameMetadata = getFrameMetadata({
  buttons: [{label: 'Check if I am verified by Coinbase'}],
  image: "https://static-assets.coinbase.com/attestations/attestation-circle.png",
  post_url: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: 'Test Verified Frame',
  description: 'LFG',
  openGraph: {
    title: 'Test Verified Frame',
    description: 'LFG',
    images: ["https://static-assets.coinbase.com/attestations/attestation-circle.png"],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>https://verified-frames-git-main-david-roth-cbs-projects.vercel.app/</h1>
    </>
  );
}
