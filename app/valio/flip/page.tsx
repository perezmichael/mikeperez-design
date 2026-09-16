import { FlipB } from "@/components/valio/FlipB";
import { getValioQrs } from "@/lib/valio-qr";

export default async function ValioFlipPage() {
  const qrs = await getValioQrs();
  return <FlipB qrs={qrs} />;
}
