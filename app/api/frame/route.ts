import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { NEXT_PUBLIC_URL } from "../../config";
import { isValidAttestation } from "../../eas/eas";
import { readAttestationUid } from "../../verifications/indexer";
import { getAddressesWithEns } from "../../ens/ens";

const zeroBytes32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddresses: string[] | undefined = [];
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY as string,
  });
  
  // get the uid of the verified attestation
  let uid = "0xea40915a79a6c699658e225db836ce2cbe09f55aa22e0e4b0e64377bdd78b6ae";    // replaced with demo attesation uid

  // happy path: has at least 1 verified address
  if (await isValidAttestation(uid as string)) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attested Content</title>
          <meta property="og:title" content="Attested Content">
          <meta property="og:image" content="https://zd56xv.csb.app/Base_Warpcast_files/CryptoMakesMoneyFasterWhyCryptowithBrianArmstrong.gif">
          <meta name="fc:frame" content="vNext">
          <meta name="fc:frame:image" content="https://zd56xv.csb.app/Base_Warpcast_files/CryptoMakesMoneyFasterWhyCryptowithBrianArmstrong.gif">
          <meta name="fc:frame:button:1" content="Open Link to Attested Content">
          <meta name="fc:frame:button:1:action" content="post_redirect">
          <meta name="fc:frame:post_url" content="https://youtu.be/LRVJRXMAp2g?si=yAzlPNlZzghNlQlw">
        </head>
      </html>
        `
    );
  }

  // not verified
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Your content is not attested.`,
          action: "post_redirect",
        },
      ],
      image: `${NEXT_PUBLIC_URL}/attestation-circle-grey-white.png`,
      post_url: `https://base-sepolia.easscan.org/schema/view/0x67f4ef704a08dfb74df8d9191b059ac9515fb5f8ffe83529a342958397fa732c`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
