import profileAsset from "@/assets/profile.asset.json";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

// Lazy load WebGISProject to avoid Leaflet requiring window at build time
const WebGISProject = lazy(() => import("@/components/WebGISProject").then(m => ({ default: m.WebGISProject })));


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prakriti Pathak — Geomatics Engineer & Geospatial Developer" },
      { name: "description", content: "Portfolio of Prakriti Pathak — Geomatics Engineering student specializing in GIS, Remote Sensing, ArcGIS Pro, GEE & OpenStreetMap." },
      { property: "og:title", content: "Prakriti Pathak — Geospatial Portfolio" },
      { property: "og:description", content: "GIS · Remote Sensing · Photogrammetry · ArcGIS Pro · Google Earth Engine" },
    ],
  }),
  component: Portfolio,
});

const EMAIL = "prakritipathak19@gmail.com";
const PHONE = "9867216105";
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;
const MAILTO = `mailto:${EMAIL}`;

function openEmail(e: React.MouseEvent) {
  e.preventDefault();
  const win = window.open(GMAIL_COMPOSE, "_blank", "noopener,noreferrer");
  // If popup/navigation is blocked (e.g. inside a sandboxed preview iframe),
  // fall back to the user's default mail client.
  if (!win || win.closed || typeof win.closed === "undefined") {
    window.location.href = MAILTO;
  }
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const target = e.target as HTMLElement;
            const delay = target.dataset.revealDelay || "0ms";
            target.style.animationDelay = delay;
            target.classList.add("animate-fade-up-soft");
            target.classList.remove("reveal-item");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => {
      el.classList.add("reveal-item");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

function Portfolio() {
  useReveal();
  const [certOpen, setCertOpen] = useState<null | { src: string; title: string }>(null);

  useEffect(() => {
    if (certOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [certOpen]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated background blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl animate-blob" style={{ animationDelay: "-5s" }} />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl animate-blob" style={{ animationDelay: "-9s" }} />
        <div className="absolute inset-0 grid-bg animate-grid opacity-40" />
      </div>

      <Nav />
      <Hero onOpenCert={(src, title) => setCertOpen({ src, title })} />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Certifications onOpen={(src, title) => setCertOpen({ src, title })} />
      <Contact />
      <Suspense fallback={<div className="h-64 bg-background" />}>
        <WebGISProject />
      </Suspense>
      <Footer />

      {certOpen && <CertModal {...certOpen} onClose={() => setCertOpen(null)} />}
    </div>
  );
}

function Nav() {
  const links = [
    ["About", "about"],
    ["Skills", "skills"],
    ["Experience", "experience"],
    ["Projects", "projects"],
    ["Certifications", "certs"],
    ["Contact", "contact"],
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border/50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-mono text-sm tracking-wider">
          <span className="text-gradient font-bold">{"<PP/>"}</span>
        </a>
        <ul className="hidden gap-7 text-sm text-muted-foreground md:flex">
          {links.map(([l, id]) => (
            <li key={id}>
              <a href={`#${id}`} className="transition hover:text-primary">{l}</a>
            </li>
          ))}
        </ul>
        <a href={GMAIL_COMPOSE} onClick={openEmail} target="_blank" rel="noreferrer"
           className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:scale-105 glow-primary">
          Hire Me
        </a>
      </nav>
    </header>
  );
}

function Hero({ onOpenCert }: { onOpenCert: (src: string, title: string) => void }) {
  const [typed, setTyped] = useState("");
  const roles = ["Geomatics Engineer", "GIS Developer", "Remote Sensing Analyst", "OSM Mapper"];
  const i = useRef(0);
  const j = useRef(0);
  const del = useRef(false);

  useEffect(() => {
    const tick = () => {
      const word = roles[i.current];
      if (!del.current) {
        j.current++;
        setTyped(word.slice(0, j.current));
        if (j.current === word.length) { del.current = true; setTimeout(tick, 1400); return; }
      } else {
        j.current--;
        setTyped(word.slice(0, j.current));
        if (j.current === 0) { del.current = false; i.current = (i.current + 1) % roles.length; }
      }
      setTimeout(tick, del.current ? 50 : 90);
    };
    const t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="top" className="relative mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-primary" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-primary">OPEN TO WORK</span>
            <span className="text-muted-foreground">· Internships · Research</span>
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-[1.05] md:text-7xl">
            Hi, I&apos;m <span className="text-gradient">Prakriti</span>
            <br />
            <span className="shimmer-text">Pathak.</span>
          </h1>

          <p className="mt-5 font-mono text-lg text-muted-foreground md:text-xl">
            <span className="text-primary">{">"}</span> {typed}
            <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-primary" />
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Final-year Geomatics Engineering student at Kathmandu University with interests in surveying, GIS, photogrammetry, remote sensing, and geospatial application development. Passionate about leveraging technology and spatial data to create innovative and practical solutions.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects"
               className="group relative overflow-hidden rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-primary transition hover:scale-105">
              View Projects →
            </a>
            <a href="#contact"
               className="rounded-full border border-border bg-card/40 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent">
              Get in touch
            </a>
          </div>

          <div className="mt-8 flex gap-6 text-xs font-mono text-muted-foreground">
            <Stat n="3+" label="Years studying geomatics" />
            <Stat n="6+" label="Certifications" />
          </div>
        </div>

        {/* Profile portrait with orbiting tech tags */}
        <div className="relative mx-auto h-[380px] w-[380px] md:h-[460px] md:w-[460px]">

          <div className="absolute inset-[14%] overflow-hidden rounded-full glow-primary animate-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 p-[3px]">
              <div className="h-full w-full overflow-hidden rounded-full bg-background">
                <img src={profileAsset.url} alt="Prakriti Pathak"
                     className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-gradient">{n}</div>
      <div className="mt-0.5">{label}</div>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20 md:py-28" data-reveal>
      <div className="mb-12">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</div>
        <h2 className="mt-2 text-4xl font-bold md:text-5xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="// about" title="Mapping the world, one pixel at a time">
      <div className="grid gap-8 text-lg leading-relaxed text-muted-foreground md:grid-cols-3">
        <p className="md:col-span-2">
          I&apos;m a final-year <span className="text-foreground font-semibold">Geomatics Engineering</span> student
          with a strong passion for geospatial technologies — <span className="text-primary">GIS, remote sensing,
          photogrammetry & surveying</span>. I&apos;ve built a solid foundation in spatial data analysis, mapping,
          and web-based geospatial applications, and I genuinely enjoy turning messy geographic data into clean,
          actionable insight. I&apos;m eager to keep learning, ship real projects and contribute to work that has
          real-world impact.
        </p>
        <div className="glass rounded-2xl p-6">
          <div className="font-mono text-xs text-primary">CURRENTLY</div>
          <div className="mt-2 font-semibold text-foreground">Member, ISPRS</div>
          <div className="text-sm">International Society for Photogrammetry & Remote Sensing — 2026</div>
          <div className="mt-4 font-mono text-xs text-accent">ORGANIZING</div>
          <div className="mt-2 font-semibold text-foreground">Survey Competition</div>
          <div className="text-sm">Organizer — NEPGeom &apos;26</div>
        </div>
      </div>
    </Section>
  );
}

function Skills() {
  const groups = [
    { title: "GIS & Mapping", icon: "🗺️", items: ["ArcGIS Pro", "ArcGIS", "QGIS", "OpenStreetMap (OSM)", "Map layout design"] },
    { title: "Remote Sensing & Cloud", icon: "🛰️", items: ["Google Earth Engine (GEE)", "Spatial data analysis", "Multi-temporal RS", "LULC classification"] },
    { title: "Photogrammetry & Survey", icon: "📐", items: ["Pix4D", "Traverse & detailing", "Autocad","Levelling", "Survey data processing"] },
    { title: "Programming", icon: "💻", items: ["Python (basics)", "C", "C++", "Java"] },
    { title: "Reporting", icon: "📊", items: ["Technical Report Writing", "Map layouts", "PowerPoint"] },
    { title: "Soft Skills", icon: "⚡", items: ["Team Leadership", "Event Organizing", "Cross-functional collab"] },
  ];
  return (
    <Section id="skills" eyebrow="// skills" title="Stack & tooling">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, index) => (
          <div key={g.title} data-reveal data-reveal-delay={`${index * 80}ms`}
               className="group relative overflow-hidden rounded-2xl glass p-6 transition hover:-translate-y-1 hover:glow-primary">
            <div className="mb-3 text-3xl">{g.icon}</div>
            <h3 className="font-semibold text-foreground">{g.title}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.items.map((i) => (
                <li key={i} className="rounded-full border border-border bg-background/50 px-3 py-1 font-mono text-[11px] text-muted-foreground transition group-hover:border-primary/40 group-hover:text-foreground">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  const items = [
    { role: "Survey Competition Organizer", org: "NEPGeom '26", desc: "Organizing the survey competition — logistics, judging coordination, and participant experience." },
    { role: "Individual Member", org: "ISPRS — 2026", desc: "International Society for Photogrammetry and Remote Sensing." },
    { role: "Co-Head", org: "GES / NEPGeom Alumni Meet 2025", desc: "Co-led planning, logistics & hosting; drove high alumni engagement and smooth execution." },
    { role: "Team Leader, Outgoing Exchanges", org: "AIESEC in KU", desc: "Led the OGX team — planning, performance tracking, training, and end-to-end exchange experience." },
    { role: "Core Committee", org: "AIESEC Global Village Event", desc: "Cross-functional coordination for a flagship cultural event." },
    { role: "Member", org: "KU Youth Mappers", desc: "OSM mapper for humanitarian & disaster-response mapathons; building footprint digitization." },
    { role: "Member", org: "Geomatics Engineering Society (GES)", desc: "Active in workshops, technical events & student engagement." },
  ];
  return (
    <Section id="experience" eyebrow="// experience" title="Where I&apos;ve shown up">
      <div className="relative">
        <div className="absolute left-3 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-primary via-accent to-transparent opacity-90 shadow-[0_0_18px_rgba(0,245,212,0.35)] md:left-1/2 md:-translate-x-1/2" />
        <ul className="space-y-6">
          {items.map((it, idx) => (
            <li
              key={idx}
              data-reveal
              data-reveal-delay={`${idx * 90}ms`}
              className={`relative md:grid md:grid-cols-2 md:gap-12 ${idx % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="relative pl-10 md:pl-0 md:pr-8 md:text-right">
                <span className="absolute left-0 top-2 grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground glow-primary md:left-auto md:right-[-12px] md:translate-x-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-foreground">{it.role}</h3>
                <div className="font-mono text-xs text-primary">{it.org}</div>
              </div>
              <p className="mt-2 pl-10 text-sm text-muted-foreground md:mt-0 md:pl-8">{it.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Projects() {
  return (
    <Section id="projects" eyebrow="// projects" title="Things I'm building">
      {/* Current project — featured */}
      <div data-reveal data-reveal-delay="0ms" className="relative overflow-hidden rounded-3xl glass p-8 md:p-10">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-primary">
              <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary align-middle" />
              CURRENTLY BUILDING
            </span>
            <span className="text-muted-foreground">Kaski District, Nepal · Final Year Project</span>
          </div>

          <h3 className="mt-5 max-w-4xl text-2xl font-bold leading-tight md:text-4xl">
            Spatio-Temporal Analysis of <span className="text-gradient">LULC Change</span> & Multi-Hazard
            Risk Assessment for Future <span className="text-gradient">Urban Expansion Planning</span>
          </h3>

          <p className="mt-5 max-w-3xl text-muted-foreground">
            Modeling decades of land-use / land-cover change across Kaski District using satellite time-series,
            assessing multi-hazard risk (landslide, flood, fire, seismic exposure) and projecting safe, resilient
            zones for future urban growth.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2 font-mono text-[11px]">
            {["Google Earth Engine", "ArcGIS Pro", "Remote Sensing", "Multi-Hazard Modeling", "LULC", "Python"].map((t) => (
              <li key={t} className="rounded-full border border-primary/30 bg-background/50 px-3 py-1 text-primary">{t}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Other projects */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <ProjectCard
          title="Forest Fire Mapping — Palpa District"
          desc="GIS-based spatial analysis & cartography of forest-fire extents across Palpa using ArcGIS — no remote sensing dependency. Delivered map layouts and a full technical report."
          tags={["ArcGIS", "Spatial Analysis", "Cartography", "Technical Report"]}
        />
        <ProjectCard
          title="Humanitarian OSM Mapping"
          desc="Building footprint digitization across priority areas with KU Youth Mappers for disaster-response & humanitarian campaigns."
          tags={["OpenStreetMap", "Building Footprints", "Mapathons"]}
        />
      </div>
    </Section>
  );
}

function ProjectCard({ title, desc, tags }: { title: string; desc: string; tags: string[] }) {
  return (
    <div data-reveal data-reveal-delay="40ms" className="group rounded-2xl glass p-6 transition hover:-translate-y-1 hover:glow-accent">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <ul className="mt-4 flex flex-wrap gap-2 font-mono text-[11px]">
        {tags.map((t) => (
          <li key={t} className="rounded-full border border-border bg-background/40 px-2.5 py-1 text-muted-foreground transition group-hover:border-accent/50 group-hover:text-accent">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Certifications({ onOpen }: { onOpen: (src: string, title: string) => void }) {
  const certs = [
    { title: "ISPRS Membership 2026", issuer: "Int'l Society for Photogrammetry & Remote Sensing", icon: "🏅" },
    { title: "Google Earth Engine (GEE)", issuer: "Cloud-based geospatial analysis", icon: "🌍" },
    { title: "ArcGIS Pro", issuer: "Esri — Professional GIS", icon: "🗺️" },
    { title: "Spatial Data Science: The New Frontier in Analytics", issuer: "Esri", icon: "📈" },
    { title: "Make an Impact with Modern Geo Apps", issuer: "Esri", icon: "📱" },
    { title: "Going Places with Spatial Analysis", issuer: "Esri", icon: "🧭" },
  ];
  return (
    <Section id="certs" eyebrow="// certifications" title="Receipts & recognition">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {certs.map((c) => {
          return (
            <div
              key={c.title}
              data-reveal
              data-reveal-delay={`${certs.indexOf(c) * 70}ms`}
              className="group relative overflow-hidden rounded-2xl glass p-6 text-left transition hover:-translate-y-1"
            >
              <div className="text-3xl">{c.icon}</div>
              <h3 className="mt-4 font-semibold text-foreground">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.issuer}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" eyebrow="// contact" title="Let's build something spatial">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl glass p-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-primary" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            AVAILABLE · OPEN TO WORK
          </div>
          <h3 className="mt-4 text-3xl font-bold leading-tight">
            I&apos;m open to <span className="text-gradient">internships, research roles</span> & collaborations.
          </h3>
          <p className="mt-4 text-muted-foreground">
            Reach out via email or phone — I usually reply within a day.
          </p>
        </div>

        <div className="space-y-4">
          <a href={GMAIL_COMPOSE} onClick={openEmail} target="_blank" rel="noreferrer"
             className="group flex items-center gap-5 rounded-2xl glass p-6 transition hover:-translate-y-1 hover:glow-primary">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/20 text-2xl">✉️</span>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-xs text-primary">EMAIL · OPENS IN GMAIL</div>
              <div className="truncate font-semibold">{EMAIL}</div>
            </div>
            <span className="text-primary transition group-hover:translate-x-1">→</span>
          </a>

          <a href={`tel:+977${PHONE}`}
             className="group flex items-center gap-5 rounded-2xl glass p-6 transition hover:-translate-y-1 hover:glow-accent">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/20 text-2xl">📞</span>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-xs text-accent">PHONE · STARTS CALL</div>
              <div className="truncate font-semibold">+977 {PHONE}</div>
            </div>
            <span className="text-accent transition group-hover:translate-x-1">→</span>
          </a>

          <div className="flex items-center gap-5 rounded-2xl glass p-6">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-2xl">📍</span>
            <div>
              <div className="font-mono text-xs text-muted-foreground">LOCATION</div>
              <div className="font-semibold">Tilottama-4, Rupandehi · Nepal</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground md:flex-row">
        <div className="font-mono">© 2026 Prakriti Pathak.</div>
        <div className="font-mono">Kathmandu University · Geomatics Engineering</div>
      </div>
    </footer>
  );
}

function CertModal({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-md animate-fade-up"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl glass glow-accent"
        style={{ animation: "fade-up 0.4s ease-out" }}
      >
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent">Certificate</div>
            <div className="font-semibold">{title}</div>
          </div>
          <button onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-full bg-background/60 text-lg transition hover:bg-destructive hover:text-destructive-foreground">
            ✕
          </button>
        </div>
        <div className="max-h-[80vh] overflow-auto bg-black/40 p-4">
          <img src={src} alt={title} className="mx-auto h-auto w-full max-w-3xl rounded-xl shadow-2xl" />
        </div>
      </div>
    </div>
  );
}
