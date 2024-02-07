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

  const svg = await satori(
    <div style={{ marginLeft: '200px', marginTop: '200px', display: 'flex', flexDirection: 'column', color: "white" }}>Verified Addresses:
      <p>{(verifiedAddresses as string[]).join(", ")}</p>
    </div>
    ,
    {
      width: 700,
      height: 700,
      fonts: [
        {
          name: "Roboto",
          data: fontData,
          weight: 900,
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
