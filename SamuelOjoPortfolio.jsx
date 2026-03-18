import { useState, useEffect, useRef } from "react";

/* ============================================================
   ✏️  EDIT YOUR CONTENT HERE
   All your projects, blog posts, skills and links live in
   this section. Scroll down past the data to find the UI.
   ============================================================ */

const ME = {
  name: "Samuel Ojo",
  role: "Security Engineer",
  availability: "Available for opportunities",
  tagline:
    "Security engineer specialising in cloud security, digital forensics, and security automation. Building resilient systems and finding the cracks before others do.",
  bio: [
    "I'm Samuel Ojo, a security engineer with a deep focus on cloud-native environments, forensic investigation, and automating security operations. I work at the intersection of offensive thinking and defensive architecture.",
    "With hands-on experience across AWS, Azure, and GCP security postures, I help organisations understand their attack surface and build hardened infrastructure that scales.",
    "When I'm not hunting threats, I'm writing about them — documenting research, incident response playbooks, and automation patterns for the community.",
  ],
  email: "samuel@example.com",
  linkedin: "https://linkedin.com/in/samuelojo",
  github: "https://github.com/samuelojo",
  twitter: "https://twitter.com/samuelojo",
};

/* ── Add / remove skills in each group ── */
const SKILLS = [
  {
    group: "Cloud & Infrastructure",
    tags: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "Docker"],
  },
  {
    group: "Forensics & IR",
    tags: ["Volatility", "Wireshark", "Splunk", "Elastic SIEM", "YARA", "MITRE ATT&CK"],
  },
  {
    group: "Automation & Dev",
    tags: ["Python", "Bash", "GitHub Actions", "Ansible", "Sigma"],
  },
];

/* ── Add a new project by copying one of these objects ──
   category options: "Cloud Security" | "Forensics" | "Automation" | "Research" | "Other"
   link is optional — set to "" to hide it                         */
const PROJECTS = [
  // {
  //   title: "My Project",
  //   category: "Cloud Security",
  //   desc: "What you built and why it matters.",
  //   stack: ["Python", "AWS"],
  //   link: "https://github.com/samuelojo/my-project",
  // },
];

/* ── Add a new blog post by copying one of these objects ──
   link is optional — set to "" to hide it                   */
const BLOG_POSTS = [
  // {
  //   date: "Mar 2025",
  //   tag: "Cloud Security",
  //   title: "Hunting for Credential Theft in AWS CloudTrail Logs",
  //   excerpt: "A walkthrough of the indicators and queries I use to spot stolen keys in the wild.",
  //   link: "https://yourblog.com/cloudtrail-hunting",
  // },
];

/* ============================================================
   UI — no need to edit below this line unless you want to
   change the layout or design of the site.
   ============================================================ */

const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@400;500&display=swap";
fontLink.rel = "stylesheet";
if (!document.querySelector(`link[href="${fontLink.href}"]`))
  document.head.appendChild(fontLink);

const globalStyle = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #f8f6f1; color: #0f0f0f; font-family: 'Instrument Sans', sans-serif; overflow-x: hidden; }
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 9999; opacity: 0.4;
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
  ::selection { background: #0f0f0f; color: #f8f6f1; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #f8f6f1; }
  ::-webkit-scrollbar-thumb { background: rgba(15,15,15,0.1); }
`;

if (!document.getElementById("sojo-global")) {
  const s = document.createElement("style");
  s.id = "sojo-global";
  s.textContent = globalStyle;
  document.head.appendChild(s);
}

const C = {
  ink: "#0f0f0f", ink2: "#3a3a3a", ink3: "#7a7a7a",
  paper: "#f8f6f1", paper2: "#f0ede6",
  rule: "rgba(15,15,15,0.10)",
  serif: "'DM Serif Display', Georgia, serif",
  mono: "'DM Mono', 'Courier New', monospace",
  sans: "'Instrument Sans', sans-serif",
};

const PAD = "clamp(1.5rem, 5vw, 4rem)";
const MAX_W = 1100;

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(16px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ eyebrow, title }) {
  return (
    <>
      <Reveal>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <span style={{ display: "block", width: 20, height: 1, background: C.ink3 }} />
          <span style={{ fontFamily: C.mono, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.ink3 }}>
            {eyebrow}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          style={{ fontFamily: C.serif, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "3rem", color: C.ink }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </Reveal>
    </>
  );
}

/* ── NAV ── */
function Nav({ active }) {
  const links = PROJECTS.length > 0 || BLOG_POSTS.length > 0
    ? ["about", "skills", "projects", "blog", "contact"]
    : ["about", "skills", "contact"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: `1.25rem ${PAD}`,
      background: "rgba(248,246,241,0.88)", backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.rule}`,
    }}>
      <a href="#hero" style={{ fontFamily: C.serif, fontSize: "1.15rem", color: C.ink, textDecoration: "none" }}>
        {ME.name}
      </a>
      <ul style={{ display: "flex", gap: "2rem", listStyle: "none" }}>
        {links.map((l) => (
          <li key={l}>
            <a href={`#${l}`} style={{
              fontFamily: C.mono, fontSize: "0.72rem", letterSpacing: "0.08em",
              textTransform: "uppercase", textDecoration: "none",
              color: active === l ? C.ink : C.ink2, transition: "color 0.2s",
            }}>{l}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── HERO ── */
function Hero() {
  const [cursor, setCursor] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  const anim = (delay) => ({ opacity: 0, animation: `fadeUp 0.9s ${delay}s forwards` });
  const [first, ...rest] = ME.name.split(" ");

  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", padding: `8rem ${PAD} 4rem`,
      maxWidth: MAX_W, margin: "0 auto", position: "relative",
    }}>
      <p style={{ ...anim(0.2), fontFamily: C.mono, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink3, marginBottom: "1.5rem" }}>
        {ME.role} · {ME.availability}
      </p>

      <h1 style={{ ...anim(0.35), fontFamily: C.serif, fontSize: "clamp(3.5rem,9vw,8rem)", lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
        {first}<br />
        <em style={{ fontStyle: "italic", color: C.ink2 }}>{rest.join(" ")}</em>
      </h1>

      <div style={{ ...anim(0.48), fontFamily: C.mono, fontSize: "0.78rem", color: C.ink3, marginBottom: "1rem", letterSpacing: "0.04em" }}>
        <span style={{ color: C.ink2 }}>~/security</span>
        <span> $ </span>
        <span>whoami</span>
        <span style={{ display: "inline-block", width: 8, height: "1em", background: cursor ? C.ink3 : "transparent", marginLeft: 2, verticalAlign: "text-bottom" }} />
      </div>

      <p style={{ ...anim(0.56), maxWidth: 480, fontSize: "1.05rem", color: C.ink2, lineHeight: 1.7, marginBottom: "3rem" }}>
        {ME.tagline}
      </p>

      <div style={{ ...anim(0.68), display: "flex", gap: "1rem" }}>
        {[
          { href: PROJECTS.length > 0 ? "#projects" : "#about", label: "View Work", primary: true },
          { href: "#contact", label: "Get in Touch", primary: false },
        ].map(({ href, label, primary }) => (
          <a key={label} href={href} style={{
            fontFamily: C.mono, fontSize: "0.75rem", letterSpacing: "0.06em",
            textTransform: "uppercase", textDecoration: "none",
            background: primary ? C.ink : "transparent",
            color: primary ? C.paper : C.ink2,
            border: primary ? "none" : `1px solid ${C.rule}`,
            padding: "0.85rem 1.8rem", transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >{label}</a>
        ))}
      </div>

      <div style={{ ...anim(1.1), position: "absolute", bottom: "2.5rem", left: PAD, display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ display: "block", width: 32, height: 1, background: C.ink3 }} />
        <span style={{ fontFamily: C.mono, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink3 }}>
          Scroll to explore
        </span>
      </div>
    </section>
  );
}

/* ── ABOUT ── */
function About() {
  const domains = [
    { num: "01", title: "Cloud Security", desc: "IAM hardening · threat detection · CSPM · zero-trust architecture across AWS, Azure & GCP" },
    { num: "02", title: "Digital Forensics", desc: "Memory analysis · log forensics · incident response · malware triage & reverse engineering" },
    { num: "03", title: "Security Automation", desc: "SOAR workflows · Python tooling · CI/CD security gates · detection engineering" },
  ];

  return (
    <section id="about" style={{ padding: `7rem ${PAD}`, maxWidth: MAX_W, margin: "0 auto", borderTop: `1px solid ${C.rule}` }}>
      <SectionHeader eyebrow="01 — About" title="Securing systems,<br/><em style='font-style:italic;color:#3a3a3a'>one layer at a time</em>" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem" }}>
        <Reveal delay={0.1}>
          <div>
            {ME.bio.map((p, i) => (
              <p key={i} style={{ color: C.ink2, marginBottom: "1.2rem", fontSize: "1.02rem", lineHeight: 1.75 }}>{p}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div>
            {domains.map((d, i) => (
              <div key={i} style={{
                display: "flex", gap: "1.25rem", padding: "1.5rem 0",
                borderTop: i === 0 ? `1px solid ${C.rule}` : "none",
                borderBottom: `1px solid ${C.rule}`,
              }}>
                <span style={{ fontFamily: C.mono, fontSize: "0.68rem", color: C.ink3, minWidth: 24, marginTop: "0.15rem" }}>{d.num}</span>
                <div>
                  <h4 style={{ fontWeight: 500, fontSize: "0.95rem", marginBottom: "0.3rem" }}>{d.title}</h4>
                  <p style={{ fontFamily: C.mono, fontSize: "0.72rem", color: C.ink3, lineHeight: 1.5 }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── SKILLS ── */
function Skills() {
  return (
    <section id="skills" style={{ padding: `7rem ${PAD}`, maxWidth: MAX_W, margin: "0 auto", borderTop: `1px solid ${C.rule}` }}>
      <SectionHeader eyebrow="02 — Skills & Tools" title="The <em style='font-style:italic;color:#3a3a3a'>toolkit</em>" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2.5rem" }}>
        {SKILLS.map((grp, i) => (
          <Reveal key={grp.group} delay={i * 0.1}>
            <div>
              <h3 style={{
                fontFamily: C.mono, fontSize: "0.68rem", letterSpacing: "0.12em",
                textTransform: "uppercase", color: C.ink3, marginBottom: "1.25rem",
                paddingBottom: "0.75rem", borderBottom: `1px solid ${C.rule}`,
              }}>{grp.group}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {grp.tags.map((tag) => (
                  <SkillTag key={tag}>{tag}</SkillTag>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SkillTag({ children }) {
  const [h, setH] = useState(false);
  return (
    <span
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        fontFamily: C.mono, fontSize: "0.70rem", letterSpacing: "0.04em",
        color: h ? C.ink : C.ink2,
        border: `1px solid ${h ? C.ink2 : C.rule}`,
        padding: "0.4rem 0.8rem", background: C.paper2,
        transition: "border-color 0.2s, color 0.2s", cursor: "default",
      }}
    >{children}</span>
  );
}

/* ── PROJECTS ── */
function Projects() {
  const [filter, setFilter] = useState("all");
  const categories = [...new Set(PROJECTS.map((p) => p.category))];
  const filters = [{ key: "all", label: "All" }, ...categories.map((c) => ({ key: c, label: c }))];
  const visible = PROJECTS.filter((p) => filter === "all" || p.category === filter);

  if (PROJECTS.length === 0) return null;

  return (
    <section id="projects" style={{ padding: `7rem ${PAD}`, maxWidth: MAX_W, margin: "0 auto", borderTop: `1px solid ${C.rule}` }}>
      <SectionHeader eyebrow="03 — Projects" title="Selected <em style='font-style:italic;color:#3a3a3a'>work</em>" />

      {categories.length > 1 && (
        <Reveal>
          <div style={{ display: "flex", marginBottom: "2.5rem", borderBottom: `1px solid ${C.rule}` }}>
            {filters.map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                fontFamily: C.mono, fontSize: "0.70rem", letterSpacing: "0.08em",
                textTransform: "uppercase", background: "none", border: "none",
                borderBottom: filter === f.key ? `2px solid ${C.ink}` : "2px solid transparent",
                padding: "0.75rem 1.5rem 0.75rem 0",
                cursor: "pointer", color: filter === f.key ? C.ink : C.ink3,
                marginBottom: -1, transition: "color 0.2s",
              }}>{f.label}</button>
            ))}
          </div>
        </Reveal>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1.5px", background: C.rule }}>
        {visible.map((p, i) => <ProjectCard key={i} project={p} delay={i * 0.06} />)}
      </div>
    </section>
  );
}

function ProjectCard({ project, delay }) {
  const [h, setH] = useState(false);
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h ? C.paper2 : C.paper, padding: "2rem",
        opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)",
        transition: `background 0.2s, opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <span style={{ fontFamily: C.mono, fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.ink3 }}>
          {project.category}
        </span>
        {project.link && (
          <a href={project.link} target="_blank" rel="noreferrer"
            style={{ fontFamily: C.mono, fontSize: "0.68rem", color: C.ink3, textDecoration: "none" }}>
            ↗ Link
          </a>
        )}
      </div>
      <h3 style={{ fontFamily: C.serif, fontSize: "1.35rem", letterSpacing: "-0.01em", color: C.ink, marginBottom: "0.6rem", lineHeight: 1.2 }}>
        {project.title}
      </h3>
      {project.desc && (
        <p style={{ fontSize: "0.88rem", color: C.ink3, lineHeight: 1.65, marginBottom: "1.25rem" }}>{project.desc}</p>
      )}
      {project.stack?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {project.stack.map((s) => (
            <span key={s} style={{ fontFamily: C.mono, fontSize: "0.62rem", color: C.ink3, background: C.paper2, padding: "0.25rem 0.6rem", border: `1px solid ${C.rule}` }}>
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── BLOG ── */
function Blog() {
  if (BLOG_POSTS.length === 0) return null;

  return (
    <section id="blog" style={{ padding: `7rem ${PAD}`, maxWidth: MAX_W, margin: "0 auto", borderTop: `1px solid ${C.rule}` }}>
      <SectionHeader eyebrow="04 — Blog" title="Write-ups & <em style='font-style:italic;color:#3a3a3a'>research</em>" />
      <div>
        {BLOG_POSTS.map((post, i) => <BlogRow key={i} post={post} delay={i * 0.06} />)}
      </div>
    </section>
  );
}

function BlogRow({ post, delay }) {
  const [h, setH] = useState(false);
  const [ref, visible] = useReveal();

  const inner = (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "grid", gridTemplateColumns: "110px 1fr auto",
        gap: "2rem", alignItems: "start",
        padding: "1.75rem 0", borderBottom: `1px solid ${C.rule}`,
        opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        textDecoration: "none", color: "inherit",
      }}>
      <span style={{ fontFamily: C.mono, fontSize: "0.68rem", color: C.ink3, letterSpacing: "0.04em", paddingTop: "0.2rem" }}>
        {post.date}
      </span>
      <div>
        {post.tag && (
          <p style={{ fontFamily: C.mono, fontSize: "0.60rem", letterSpacing: "0.08em", textTransform: "uppercase", color: C.ink3, marginBottom: "0.3rem" }}>
            {post.tag}
          </p>
        )}
        <p style={{ fontFamily: C.serif, fontSize: "1.15rem", letterSpacing: "-0.01em", color: h ? C.ink3 : C.ink, transition: "color 0.2s" }}>
          {post.title}
        </p>
        {post.excerpt && (
          <p style={{ fontSize: "0.82rem", color: C.ink3, marginTop: "0.4rem", lineHeight: 1.55 }}>{post.excerpt}</p>
        )}
      </div>
      <span style={{ fontFamily: C.mono, fontSize: "0.85rem", color: C.ink3, paddingTop: "0.2rem", display: "inline-block", transform: h ? "translateX(4px)" : "none", transition: "transform 0.2s" }}>
        →
      </span>
    </div>
  );

  return (
    <div ref={ref}>
      {post.link ? <a href={post.link} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>{inner}</a> : inner}
    </div>
  );
}

/* ── CONTACT ── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const links = [
    { label: "Email", display: ME.email + " ↗", href: `mailto:${ME.email}` },
    { label: "LinkedIn", display: ME.linkedin.replace("https://", "") + " ↗", href: ME.linkedin },
    { label: "GitHub", display: ME.github.replace("https://", "") + " ↗", href: ME.github },
    { label: "Twitter / X", display: ME.twitter.replace("https://twitter.com/", "@") + " ↗", href: ME.twitter },
  ].filter((l) => l.href);

  const eyebrow = PROJECTS.length > 0 ? "05 — Contact" : BLOG_POSTS.length > 0 ? "04 — Contact" : "03 — Contact";

  return (
    <section id="contact" style={{ padding: `7rem ${PAD}`, maxWidth: MAX_W, margin: "0 auto", borderTop: `1px solid ${C.rule}` }}>
      <SectionHeader eyebrow={eyebrow} title="Let's <em style='font-style:italic;color:#3a3a3a'>connect</em>" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem" }}>

        <Reveal delay={0.1}>
          <p style={{ fontSize: "1.02rem", color: C.ink2, lineHeight: 1.75, marginBottom: "2rem" }}>
            Open to consulting engagements, full-time roles, and collaborations on open-source security tooling. If you're building something worth protecting, let's talk.
          </p>
          <div>
            {links.map((cl, i) => {
              const [h, setH] = useState(false);
              return (
                <a key={i} href={cl.href} target="_blank" rel="noreferrer"
                  onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "1rem 0",
                    borderTop: i === 0 ? `1px solid ${C.rule}` : "none",
                    borderBottom: `1px solid ${C.rule}`,
                    textDecoration: "none",
                    color: h ? C.ink : C.ink2,
                    fontFamily: C.mono, fontSize: "0.78rem", letterSpacing: "0.04em",
                    transition: "color 0.2s",
                  }}>
                  <span>{cl.label}</span>
                  <span style={{ color: h ? C.ink2 : C.ink3, transition: "color 0.2s" }}>{cl.display}</span>
                </a>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          {sent ? (
            <div style={{ padding: "2.5rem", border: `1px solid ${C.rule}`, textAlign: "center" }}>
              <p style={{ fontFamily: C.serif, fontSize: "1.4rem", marginBottom: "0.5rem" }}>Message sent.</p>
              <p style={{ fontFamily: C.mono, fontSize: "0.72rem", color: C.ink3 }}>I'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { label: "Name", name: "name", type: "text", placeholder: "Your name" },
                { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
              ].map((f) => (
                <FormField key={f.name} {...f} value={form[f.name]} onChange={handle} />
              ))}
              <FormField label="Message" name="message" value={form.message} onChange={handle}
                placeholder="What are you working on?" as="textarea" />
              <button type="submit" style={{
                alignSelf: "flex-start", fontFamily: C.mono, fontSize: "0.72rem",
                letterSpacing: "0.08em", textTransform: "uppercase",
                background: C.ink, color: C.paper, border: "none",
                padding: "0.9rem 2rem", cursor: "pointer", transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.78"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >Send Message</button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function FormField({ label, name, value, onChange, type = "text", placeholder, as }) {
  const [focused, setFocused] = useState(false);
  const base = {
    fontFamily: C.sans, fontSize: "0.95rem", color: C.ink,
    background: "transparent", border: "none",
    borderBottom: `1px solid ${focused ? C.ink2 : C.rule}`,
    padding: "0.6rem 0", outline: "none", width: "100%",
    transition: "border-color 0.2s",
  };
  return (
    <div>
      <label style={{ fontFamily: C.mono, fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.ink3, display: "block", marginBottom: "0.4rem" }}>
        {label}
      </label>
      {as === "textarea"
        ? <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={4}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{ ...base, resize: "none" }} />
        : <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={base} />
      }
    </div>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${C.rule}`,
      padding: `2.5rem ${PAD}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      maxWidth: MAX_W, margin: "0 auto",
    }}>
      <p style={{ fontFamily: C.mono, fontSize: "0.65rem", letterSpacing: "0.06em", color: C.ink3 }}>
        © {new Date().getFullYear()} {ME.name} — {ME.role}
      </p>
      <a href="#hero" style={{ fontFamily: C.mono, fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: C.ink3, textDecoration: "none" }}>
        ↑ Back to top
      </a>
    </footer>
  );
}

/* ── APP ── */
export default function App() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const onScroll = () => {
      let cur = "";
      sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Nav active={active} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
}
