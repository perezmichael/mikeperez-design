import QRCode from "qrcode";
import { VALIO } from "./valio-data";

export type QrMap = Record<string, string>;

/* Server-only: renders each link as an SVG whose modules use currentColor,
   so plates can set ink color in CSS. Keeps the QR library out of the client bundle. */
export async function getValioQrs(): Promise<QrMap> {
  const entries = await Promise.all(
    VALIO.links.map(async (link) => {
      const svg = await QRCode.toString(link.url, {
        type: "svg",
        margin: 0,
        errorCorrectionLevel: "M",
        color: { dark: "#000000", light: "#00000000" },
      });
      return [link.id, svg.replace(/#000000/g, "currentColor")] as const;
    })
  );
  return Object.fromEntries(entries);
}
