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

/*   if (isValid) {
    accountAddresses = message.interactor.verified_accounts;
  }

  console.log("accountAddresses", accountAddresses); */

  let verifiedAddresses: string[] = [];
  
  // get the uid of the verified attestation
  let uid = zeroBytes32;
  try {
//    uid = await readAttestationUid(accountAddresses[i]);
    uid = "0xea40915a79a6c699658e225db836ce2cbe09f55aa22e0e4b0e64377bdd78b6ae";    // replaced with demo attesation uid
  } catch (err) {
    console.log(err);
  }

  if (uid != zeroBytes32) {
    let isVerified = false;
    // check that the attestation is valid
    try {
      isVerified = await isValidAttestation(uid as string);
    } catch (err) {
      console.log(err);
    }

    if (isVerified) {
//      verifiedAddresses.push(accountAddresses[i]);
      verifiedAddresses.push("0x596b8eeDe78d360c9484f715919038F3d27fc8Df"); // replaced with demo address
    }
  }
  

  // happy path: has at least 1 verified address
  if (verifiedAddresses.length > 0) {
    // convert verified addresses to ens names if an ens record exists

    let resolvedAddresses: string[] = await getAddressesWithEns(
      verifiedAddresses
    ).then((verifiedAddressesWithEns) => {
      return verifiedAddressesWithEns;
    });

    const fid = message?.interactor.fid;
    kv.set(`${fid}`, JSON.stringify(resolvedAddresses));

    const imageUrl = `${NEXT_PUBLIC_URL}/api/image?fid=${fid}`;

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Verified Addresses</title>
          <meta property="og:title" content="Verified Addresses">
          <meta property="og:image" content="${imageUrl}">
          <meta name="fc:frame" content="vNext">
          <meta name="fc:frame:image" content="${imageUrl}">
          <meta name="fc:frame:button:1" content="Congrats, you're verified! Verify more addresses 🚀">
          <meta name="fc:frame:button:1:action" content="post_redirect">
          <meta name="fc:frame:post_url" content="https://coinbase.com/onchain-verify">
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
          label: `Your connected addresses are not verified. Verify now 🚀`,
          action: "post_redirect",
        },
      ],
      image: `${NEXT_PUBLIC_URL}/attestation-circle-grey-white.png`,
      post_url: `https://coinbase.com/onchain-verify`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
