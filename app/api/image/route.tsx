import satori from "satori";
import sharp from 'sharp';
import * as fs from "fs";
import { join } from 'path';
import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { NEXT_PUBLIC_URL } from "@/app/config";


const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
let fontData = fs.readFileSync(fontPath)

export async function GET(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const fid = url.searchParams.get('fid');
  let verifiedAddresses: string[] | null = await kv.get(fid as string);

  if (verifiedAddresses === null || fid == null) {
    return new NextResponse();
  }

  const svg = await satori(
    <div style={{backgroundColor: 'white', display: 'flex'}}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <img src={`${NEXT_PUBLIC_URL}/attestation-circle.png`} alt="Attestation Circle" style={{ width: '220px', height: '220px', margin: '20px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}> {/* This container will hold the header and list */}
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Verified Addresses</h2>
          <ul style={{ listStyleType: 'none', padding: '0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {verifiedAddresses.map((a, index) => (
              <li key={index} style={{
                backgroundColor: 'transparent',
                padding: '10px',
                marginBottom: '1px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden', // Changed to 'hidden' to handle overflow text
                textOverflow: 'ellipsis', // Add ellipsis for overflow text
                textAlign: 'left',
                display: 'block', // Ensure block display
                maxWidth: '100%' // Ensure the width does not exceed the parent container
              }}>
                - {a.length === 42 ? `${a.slice(0, 6)}...${a.slice(-4)}` : a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    ,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          name: "Roboto",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );

  // Convert SVG to PNG using Sharp
  const pngBuffer = await sharp(Buffer.from(svg))
  .toFormat('png')
  .toBuffer();

  // Set the content type to PNG and send the response
  let res = new NextResponse(
    pngBuffer
  )
  return res;
}
