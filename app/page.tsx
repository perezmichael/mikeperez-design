import { Hero }        from "@/components/home/Hero";
import { WorkGrid }    from "@/components/home/WorkGrid";
import { LabPreview }  from "@/components/home/LabPreview";
import { AboutTeaser } from "@/components/home/AboutTeaser";

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkGrid />
      <LabPreview />
      <AboutTeaser />
    </main>
  );
}
