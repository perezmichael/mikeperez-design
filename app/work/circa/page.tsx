import { CaseStudyLayout, CSSection, CSSectionLabel, CSScreen, CSScreenGrid, CSPullQuote, CSInsightGrid, CSInsight } from "@/components/work/CaseStudyLayout";
import {
  CircaDashboard,
  CircaProjectsTable,
  CircaProjectDetail,
  CircaPersonnelDetail,
  CircaDeviceManagement,
  CircaPersonnelManagement,
} from "@/components/work/screens/CircaScreens";
import { AIInstruction } from "@/components/ui/AIInstruction";

export const metadata = {
  title: "Circa — Apple · Mike Perez",
  description: "End-to-end redesign of Apple TV+'s credential management system for production security.",
};

const meta = {
  company:     "Apple",
  title:       "Circa — Security Credentials",
  role:        "Product Designer, IS&T (Contractor)",
  year:        "2025",
  tags:        ["IoT", "Enterprise", "NFC", "Claude Code", "4-Week Sprint"],
  oneLiner:    "End-to-end redesign of Apple TV+'s credential management system — IoT badge readers, personnel tracking, and emergency location detection — shipped from concept to developer handoff in 4 weeks using Claude Code.",
  isNDA:       true,
  accentColor: "rgba(80,180,80,0.9)",
};

export default function CircaPage() {
  return (
    <CaseStudyLayout meta={meta}>

      <CSSection>
        <CSSectionLabel
          label="01 — Challenge"
          title="Physical security, digital system."
          description="Apple TV+ production crews operate globally across dozens of active sets. The existing credential system couldn't support the NFC badge readers being rolled out to detect personnel location for emergency response — fires, active threats, evacuations. A full redesign was needed in one sprint."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { title: "No IoT integration", body: "Existing system had no path to NFC readers. Emergency location detection was impossible without a ground-up rebuild.", icon: "📡" },
            { title: "Credential types were opaque", body: "Crew, Visitor, Contractor, Photo Privileges — each had different access levels with no visual distinction in the UI.", icon: "🆔" },
            { title: "No cross-project directory", body: "Personnel data lived in silos per production. No way to track a crew member across multiple shows.", icon: "📂" },
            { title: "Badge printing was manual", body: "Print requests were handled through email. No queue, no preview, no status — coordinators had no visibility.", icon: "🖨" },
          ].map((item) => (
            <div key={item.title} className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/20 transition-colors duration-300 group">
              <div className="flex items-start gap-3">
                <span className="text-base opacity-60 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[var(--color-fg)] mb-2">{item.title}</p>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CSSection>

      <CSSection>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          <div>
            <CSSectionLabel
              label="02 — Process"
              title="Four weeks, end-to-end, in code."
              description="No wireframe phase. Research was a week of shadowing security coordinators and reading incident reports. Then straight to high-fidelity prototypes in Claude Code, reviewed weekly with the security team leads."
            />
            <div className="space-y-6 mt-8">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-[22px] h-[22px] shrink-0 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  </div>
                  <div className="pb-2">
                    <span className="font-mono text-xs text-[var(--color-accent)]">Week 2 — Dashboard & Projects</span>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-0.5">Built the core dashboard architecture and production list. Stakeholders could immediately see the value of real-time detection events.</p>
                  </div>
                </div>
                <div className="ml-9">
                  <AIInstruction prompt="Build a dashboard component for a security credential system. Include three KPI cards at the top for Active Productions, Credentialed Staff, and Detection Events. Below that, implement a real-time activity feed showing badge issuances and NFC scans. Use a dark, industrial aesthetic." />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-[22px] h-[22px] shrink-0 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  </div>
                  <div className="pb-2">
                    <span className="font-mono text-xs text-[var(--color-accent)]">Week 3 — IoT Device Tracking</span>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-0.5">Integrated the NFC receiver management. This was the first time security leads saw their hardware footprint on a single map/table view.</p>
                  </div>
                </div>
                <div className="ml-9">
                  <AIInstruction prompt="Create a DeviceManagement table that tracks NFC receivers. Columns: ID, MAC Address, SIM ID, GPS Coordinates, Online/Offline status, and Assigned Production. Add a toggle to filter by online status. Ensure the GPS coordinates look authentic (e.g., 34.0522° N)." />
                </div>
              </div>
            </div>
            <CSPullQuote>
              The constraint was a feature — four weeks forced ruthless prioritization. Dashboard, projects, personnel, devices. In that order. Everything else was deferred.
            </CSPullQuote>
          </div>

          <div className="hidden lg:block pt-20">
            <div className="sticky top-24 p-6 rounded-2xl border border-[var(--color-border)] bg-black/20 backdrop-blur-sm">
              <p className="font-mono text-[10px] text-[var(--color-accent)] tracking-widest uppercase mb-4">Methodology</p>
              <h3 className="text-lg font-medium text-white mb-4">Rapid Prototyping</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                When shipping an enterprise tool in 4 weeks, there is no time for static handoffs. I used Claude Code to build the actual frontend patterns developers would use.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Weekly production-grade demos
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Parallel design and dev
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Hardware-software alignment
                </div>
              </div>
            </div>
          </div>
        </div>
      </CSSection>

      <CSSection>
        <CSSectionLabel
          label="03 — Key Screens"
          title="From dashboard to badge issuance."
          description="Six screens covering the full system — all interactive. Click the filter tabs in Projects, search in Personnel, and toggle credential types in the detail view."
        />
        <CSScreenGrid>
          <CSScreen
            title="Dashboard"
            description="Live KPI cards: active productions, credentialed staff, detection events. Recent activity feed shows badge issuances and NFC scan events in real time."
          >
            <CircaDashboard />
          </CSScreen>
          <CSScreen
            title="Projects Table"
            description="Filterable production list with status, type, personnel count, and date ranges. Click the filter tabs to narrow by Active, Wrap, or Pre-Production."
          >
            <CircaProjectsTable />
          </CSScreen>
        </CSScreenGrid>

        <CSScreenGrid>
          <CSScreen
            title="Project Detail"
            description="Production overview with color-coded credential type breakdown. Full personnel list with one-tap badge issuance per row."
          >
            <CircaProjectDetail />
          </CSScreen>
          <CSScreen
            title="Personnel Detail"
            description="Two-column layout: contact info and smart credential ID on the left, credential configuration on the right. Click the credential type pills to switch."
          >
            <CircaPersonnelDetail />
          </CSScreen>
        </CSScreenGrid>

        <CSScreenGrid>
          <CSScreen
            title="Device Management"
            description="NFC receiver table with MAC address, SIM ID, live GPS coordinates, online/offline status, and production assignment. The IoT backbone of the system."
          >
            <CircaDeviceManagement />
          </CSScreen>
          <CSScreen
            title="Personnel Directory"
            description="Cross-project personnel search. Type a name or role to filter in real time. Full history across all productions."
          >
            <CircaPersonnelManagement />
          </CSScreen>
        </CSScreenGrid>
      </CSSection>

      <CSSection>
        <CSSectionLabel
          label="04 — Impact"
          title="In development now."
        />
        <CSInsightGrid>
          <CSInsight
            number="4wk"
            label="Concept to handoff"
            description="Full end-to-end design delivered in a single sprint. Developers started building the week after."
          />
          <CSInsight
            number="100%"
            label="Claude Code prototyped"
            description="Every screen was built as a working prototype before any engineering resources were allocated."
          />
          <CSInsight
            number="6+"
            label="Credential types supported"
            description="Crew, Visitor, Contractor, Photo Privileges, Vendor — all with distinct visual identities and access rules."
          />
        </CSInsightGrid>
      </CSSection>

      <CSSection>
        <CSSectionLabel
          label="05 — Reflection"
          title="Speed as a design tool."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <p className="text-sm font-medium text-[var(--color-fg)] mb-3">The IoT constraint was clarifying</p>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Designing for NFC badge readers — physical hardware you can&apos;t change — forced extreme clarity about what the software could and couldn&apos;t own. The device management screen exists entirely because of constraints imposed by the hardware.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <p className="text-sm font-medium text-[var(--color-fg)] mb-3">Four weeks is enough, with the right tool</p>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              This project wouldn&apos;t have been possible without Claude Code. The ability to go from &ldquo;what if the table had live GPS coordinates&rdquo; to a working prototype in an hour is what made the four-week timeline real.
            </p>
          </div>
        </div>
      </CSSection>

    </CaseStudyLayout>
  );
}
