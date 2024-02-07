import satori from "satori";
import sharp from 'sharp';
import * as fs from "fs";
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";


const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
let fontData = fs.readFileSync(fontPath)

export async function GET(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const fid = url.searchParams.get('fid');
  const verifiedAddresses: string[] | null = await kv.get(fid as string);

  const svg = await satori(
    <div style={{ marginTop: '200px', display: 'flex', flexDirection: 'column', color: "white" }}>Verified Addresses:
      <p>{(verifiedAddresses as string[]).join(", ")}</p>
    </div>
    ,
    {
      width: 1000,
      height: 1000,
      fonts: [
        {
          name: "Roboto",
          // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const randId = uuidv4();
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
