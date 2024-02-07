import satori from "satori";
import sharp from 'sharp';
import * as fs from "fs";
import { join } from 'path';
import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";


const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
let fontData = fs.readFileSync(fontPath)

export async function GET(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const fid = url.searchParams.get('fid');
  const verifiedAddresses: string[] | null = await kv.get(fid as string);

  if (verifiedAddresses === null || fid == null) {
    return new NextResponse();
  }

  // zero out fid in case user disconnects addresses
  kv.del(fid)

  const svg = await satori(
      <div style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        padding: 50,
        lineHeight: 1.2,
        fontSize: 24
      }}
      >
      <div style={{ display: 'flex' }}>
        <h2 style={{ textAlign: 'center', color: 'lightgray' }}>Verified Addresses</h2>
        {verifiedAddresses.map((address, index) => (
          <div style={{ fontSize: 15 }} key={index}>
            {address}
          </div>
        ))}
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
