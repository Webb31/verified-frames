import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { NEXT_PUBLIC_URL } from "../../config";
import { isValidAttestation } from "../../eas/eas";
import { readAttestationUid } from "../../verifications/indexer";

const zeroBytes32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddresses: string[] | undefined = [];
  let text: string | undefined = "";

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: "NEYNAR_ONCHAIN_KIT",
  });

  if (isValid) {
    accountAddresses = message.interactor.verified_accounts;
  }

  let attestationUids = [];
  for (let i = 0; i < accountAddresses.length; i++) {
    let uid;
    try {
      uid = await readAttestationUid(accountAddresses[i]);
    } catch (err) {
      console.log(err);
    }

    if (uid != zeroBytes32) {
      attestationUids.push(uid);
    }
  }

  let isVerified = false;
  if (attestationUids.length >= 0) {
    for (let i = 0; i < attestationUids.length; i++) {
      try {
        isVerified = await isValidAttestation(attestationUids[i] as string);
      } catch (err) {
        console.log(err);
      }

      if (isVerified) {
        break;
      }
    }
  }

  // happy path
  if (isVerified) {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `You are eligible! Claim your NFT now!`,
          },
        ],
        image:
          "https://static-assets.coinbase.com/attestations/attestation-circle.png",
        // TODO: implement minting or some other gated experience
        post_url: `${NEXT_PUBLIC_URL}/api/mint`,
      })
    );
  }

  // not verified
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `You are not eligible. Click to verify now!`,
          action: "post_redirect",
        },
      ],
      image:
        "https://static-assets.coinbase.com/attestations/attestation-circle.png",
      post_url: `https://coinbase.com/onchain-verify`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
