import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from "./config";

const frameMetadata = getFrameMetadata({
  buttons: [{
    label: 'Verify',
    post_url: `${NEXT_PUBLIC_URL}/api/frame`,
  },
  {
    action: 'post_redirect',
    label: 'Open Link',
    post_url: `https://youtu.be/LRVJRXMAp2g?si=yAzlPNlZzghNlQlw`,
  }],
  image: `https://zd56xv.csb.app/Base_Warpcast_files/CryptoMakesMoneyFasterWhyCryptowithBrianArmstrong.gif`,
});

export const metadata: Metadata = {
  title: 'Test Attested Content',
  description: 'LFG',
  openGraph: {
    title: 'Test Attested Content',
    description: 'LFG',
    images: [`https://zd56xv.csb.app/Base_Warpcast_files/CryptoMakesMoneyFasterWhyCryptowithBrianArmstrong.gif`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>https://verified-frames-nine.vercel.app/</h1>
    </>
  );
}
