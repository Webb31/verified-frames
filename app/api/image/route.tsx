import satori from "satori";
import sharp from 'sharp';
import * as fs from "fs";
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { NextApiRequest, NextApiResponse } from 'next';


const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
let fontData = fs.readFileSync(fontPath)

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log("taco", req.query['fid'])
  const svg = await satori(
    <div style={{ display: 'flex', color: "black" }}>Verified Addresses</div>,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          name: "Roboto",
          // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
          data: fontData,
          weight: 400,
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
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'max-age=10');
  res.send(pngBuffer);
}
