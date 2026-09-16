import { CardA } from "@/components/valio/CardA";
import { getValioQrs } from "@/lib/valio-qr";

export default async function ValioCardPage() {
  const qrs = await getValioQrs();
  return <CardA qrs={qrs} />;
}
