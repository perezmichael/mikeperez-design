import { LoopC } from "@/components/valio/LoopC";
import { getValioQrs } from "@/lib/valio-qr";

export default async function ValioLoopPage() {
  const qrs = await getValioQrs();
  return <LoopC qrs={qrs} />;
}
