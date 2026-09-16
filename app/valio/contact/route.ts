import { VALIO, valioLink } from "@/lib/valio-data";

export const dynamic = "force-static";

/* vCard 3.0 requires CRLF line endings; item-grouped X-ABLabel gives iOS readable URL labels */
export function GET() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Perez;Mike;;;",
    `FN:${VALIO.name}`,
    "TITLE:Product Designer",
    "ORG:Apple",
    `EMAIL;TYPE=INTERNET:${VALIO.email}`,
    `item1.URL:${valioLink("linkedin").url}`,
    "item1.X-ABLabel:LinkedIn",
    `item2.URL:${valioLink("frequent-flyer").url}`,
    "item2.X-ABLabel:Frequent Flyer",
    "ADR;TYPE=WORK:;;;Los Angeles;CA;;USA",
    "NOTE:Met at ValioCon 2026. Ask me about Frequent Flyer.",
    "END:VCARD",
  ];

  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'inline; filename="mike-perez.vcf"',
    },
  });
}
