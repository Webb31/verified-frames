import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
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
    neynarApiKey: "NEYNAR_ONCHAIN_KIT",
  });

  if (isValid) {
    accountAddresses = message.interactor.verified_accounts;
  }

  let verifiedAddresses: string[] = [];
  for (let i = 0; i < accountAddresses.length; i++) {
    // get the uid of the verified attestation associated with each address
    let uid = zeroBytes32;
    try {
      uid = await readAttestationUid(accountAddresses[i]);
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
        verifiedAddresses.push(accountAddresses[i]);
      }
    }
  }

  // happy path: has at least 1 verified address
  if (verifiedAddresses.length > 0) {
    // convert verified addresses to ens names if an ens record exists
    getAddressesWithEns(verifiedAddresses).then((verifiedAddressesWithEns) => {
      verifiedAddresses = verifiedAddressesWithEns;
    });

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Congrats! Your addresses are verified: ${verifiedAddresses.join(
              ", "
            )}`,
          },
        ],
        image: `${NEXT_PUBLIC_URL}/attestation-circle.png`,
      })
    );
  }

  // not verified
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `You are not verified. Click here to verify now!`,
          action: "post_redirect",
        },
      ],
      image: `${NEXT_PUBLIC_URL}/attestation-circle.png`,
      post_url: `https://coinbase.com/onchain-verify`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
