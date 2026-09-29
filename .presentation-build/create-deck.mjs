import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = "C:/Users/dell_/OneDrive/Desktop/test";
const skillDir = "C:/Users/dell_/.codex/plugins/cache/openai-primary-runtime/presentations/26.921.10847/skills/Presentations";
const buildDir = path.join(workspaceDir, ".presentation-build");
const outputDir = path.join(workspaceDir, "presentation-output");
const finalPath = path.join(outputDir, "github-project-explorer-class-talk.pptx");
const { resolvePresentationFont, finalizePresentation } = await import(
  pathToFileURL(path.join(skillDir, "container_tools/artifact_tool_utils.mjs")).href,
);
const font = resolvePresentationFont({ fontFamily: "Arial" });
const pres = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const slides = [];

const C = {
  ink: "#111714", paper: "#F5F7F3", white: "#FFFFFF", muted: "#56635B",
  green: "#159447", lime: "#D6F36A", line: "#CBD3CB", pale: "#E7EEE7",
  blue: "#3C6E9E", red: "#D65C45",
};

function box(slide, x, y, w, h, fill = "none", stroke = "none", radius = "rect") {
  return slide.shapes.add({
    geometry: radius,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { fill: stroke, width: stroke === "none" ? 0 : 1.5 },
  });
}

function text(slide, value, x, y, w, h, size, color = C.ink, bold = false, opts = {}) {
  const shape = box(slide, x, y, w, h);
  shape.text = value;
  shape.text.style = {
    typeface: font, fontSize: size, color, bold, autoFit: "shrinkText",
    verticalAlignment: opts.valign ?? "middle",
    wrap: true,
    alignment: opts.align ?? "left",
    ...opts.style,
  };
  return shape;
}

function line(slide, x1, y1, x2, y2, color = C.line, width = 2) {
  const s = slide.shapes.add({
    geometry: "line",
    position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 },
    fill: "none", line: { fill: color, width, beginArrowType: "none", endArrowType: "triangle" },
  });
  return s;
}

function addSlide(title, number, background = C.paper) {
  const slide = pres.slides.add();
  slides.push(slide);
  slide.background.fill = background;
  if (title) text(slide, title, 72, 44, 1080, 58, 34, background === C.ink ? C.white : C.ink, true);
  if (number) {
    line(slide, 72, 662, 1208, 662, background === C.ink ? "#46534B" : C.line, 1);
    text(slide, "OPEN SOURCE GITHUB PROJECT EXPLORER", 72, 672, 780, 22, 12, background === C.ink ? "#B9C5BC" : C.muted, true);
    text(slide, number, 1150, 672, 58, 22, 12, background === C.ink ? "#B9C5BC" : C.muted, true, { align: "right" });
  }
  return slide;
}

function notes(slide, content) { slide.speakerNotes.textFrame.setText(content); }

// 1. Opening
{
  const s = addSlide(null, null, C.ink);
  box(s, 72, 80, 12, 158, C.lime);
  text(s, "OPEN SOURCE\nGITHUB PROJECT\nEXPLORER", 112, 70, 760, 256, 57, C.white, true, { valign: "top" });
  text(s, "A full-stack workspace for finding and evaluating repositories", 114, 358, 710, 62, 23, "#C7D1CA");
  box(s, 900, 110, 250, 250, "#18221B", "#3A493E", "ellipse");
  box(s, 956, 166, 138, 138, C.green, C.green, "ellipse");
  text(s, "GH", 956, 193, 138, 75, 43, C.white, true, { align: "center" });
  text(s, "PROJECT OVERVIEW  /  5 MINUTES", 114, 594, 700, 30, 15, C.lime, true);
  notes(s, "(0:00–0:30) Hello. This presentation introduces the Open Source GitHub Project Explorer, a full-stack application for discovering, analyzing, and bookmarking public GitHub repositories. The goal is to make the first steps of evaluating an open-source project easier: search across repositories, narrow the results, inspect useful signals, and keep a short list to revisit. I’ll cover the problem it addresses, the main features, how the application is structured, and the technologies behind it. The project is a working developer tool, with GitHub as its data source.");
}

// 2. User problem and product flow
{
  const s = addSlide("Project overview", "01");
  text(s, "Finding a useful repository takes more than a search", 72, 122, 900, 76, 31, C.ink, true);
  text(s, "The explorer brings discovery and first-pass evaluation into one browser experience.", 72, 208, 820, 42, 20, C.muted);
  const steps = [
    { x: 72, title: "Discover", desc: "Search GitHub\nfor a project", n: "01", color: C.green },
    { x: 455, title: "Evaluate", desc: "Filter and sort\nuseful signals", n: "02", color: C.blue },
    { x: 838, title: "Keep", desc: "Bookmark it\nand add a note", n: "03", color: C.red },
  ];
  for (const st of steps) {
    box(s, st.x, 326, 78, 78, st.color, st.color, "ellipse");
    text(s, st.n, st.x, 343, 78, 40, 20, C.white, true, { align: "center" });
    text(s, st.title, st.x + 102, 326, 250, 42, 24, C.ink, true);
    text(s, st.desc, st.x + 102, 371, 240, 64, 18, C.muted);
  }
  text(s, "A simple path from an idea to a saved shortlist", 72, 514, 880, 40, 20, C.green, true);
  notes(s, "(0:30–1:15) The project addresses a familiar workflow problem. Developers often find a project through a search, then open several pages to compare maintenance signals, languages, popularity, and open issues. It is easy to lose track of promising candidates. This application gives that early research a single place. A user searches GitHub, refines the results by language, topic, or time period, and sorts by stars, forks, issues, or recent updates. From a result, the user can open a repository profile, bookmark it, and write a personal note. The intended outcome is a useful shortlist, not a replacement for a full code review.");
}

// 3. Features
{
  const s = addSlide("Feature set", "02", C.ink);
  text(s, "Explore, inspect, and remember", 72, 118, 780, 56, 32, C.white, true);
  const features = [
    { y: 216, no: "01", title: "Repository search", body: "Paginated results with language, topic, and trending-window filters." },
    { y: 315, no: "02", title: "Sorting and details", body: "Rank by stars, forks, issues, or updates; inspect metadata, languages, and open issues." },
    { y: 414, no: "03", title: "Bookmarks and notes", body: "Save candidates and attach personal notes in the browser." },
    { y: 513, no: "04", title: "Analytics and comfort", body: "Charts summarize retrieved repositories; dark mode and responsive layouts support everyday use." },
  ];
  for (const f of features) {
    text(s, f.no, 72, f.y, 64, 44, 17, C.lime, true);
    text(s, f.title, 152, f.y, 340, 42, 23, C.white, true);
    text(s, f.body, 510, f.y, 650, 56, 17, "#C7D1CA");
    line(s, 152, f.y + 66, 1168, f.y + 66, "#344139", 1);
  }
  notes(s, "(1:15–2:10) The main features fit into that discovery loop. Search supports pagination, and filters let the user narrow by programming language, topic, and a trending window. Results can be sorted by stars, forks, issues, or recent updates. Opening a repository shows its description, license, default branch, key counts, language breakdown, and a list of open issues. Users can bookmark repositories and add personal notes. An analytics page visualizes the repository data currently retrieved by the app. The interface also includes dark mode, responsive layouts, and explicit loading, error, and empty states. One boundary is important: the charts summarize retrieved data, not historical repository activity.");
}

// 4. Architecture
{
  const s = addSlide("Application architecture", "03");
  text(s, "A small, clear path from screen to source", 72, 119, 890, 55, 31, C.ink, true);
  const blocks = [
    { x: 72, w: 294, title: "React client", sub: "Pages · components\nSearch and local state", fill: C.white, stroke: C.line, color: C.ink },
    { x: 493, w: 294, title: "Express API", sub: "Routes · controllers\nValidation and errors", fill: "#E7F1E9", stroke: C.green, color: C.ink },
    { x: 914, w: 294, title: "GitHub REST API", sub: "Search · repository\nLanguages · issues", fill: C.ink, stroke: C.ink, color: C.white },
  ];
  for (const b of blocks) {
    box(s, b.x, 286, b.w, 174, b.fill, b.stroke);
    text(s, b.title, b.x + 22, 310, b.w - 44, 38, 22, b.color, true);
    text(s, b.sub, b.x + 22, 365, b.w - 44, 66, 17, b.color === C.white ? "#C7D1CA" : C.muted);
  }
  line(s, 366, 373, 480, 373, C.green, 3);
  line(s, 787, 373, 901, 373, C.green, 3);
  text(s, "GET /api/repositories/...", 325, 470, 250, 30, 13, C.muted, false, { align: "center" });
  text(s, "GitHub REST requests", 745, 470, 250, 30, 13, C.muted, false, { align: "center" });
  text(s, "The browser talks to the app's API. The backend centralizes GitHub requests, response mapping, and rate-limit errors.", 72, 526, 1040, 64, 19, C.muted);
  notes(s, "(2:10–3:00) The architecture has three parts. The React client renders the pages and manages interaction state. It calls the application's Express API through routes under the /api path. On the server, routes pass work to controllers and a GitHub service. That service calls the GitHub REST API, normalizes repository, language, and issue data, and handles common failures such as a missing repository or a rate limit. This keeps GitHub-specific behavior in one place, rather than spreading API requests across browser components. The frontend receives a consistent shape of data and can focus on the search and detail experience.");
}

// 5. Stack
{
  const s = addSlide("Technology stack", "04", C.paper);
  text(s, "The stack follows the product's two main jobs", 72, 118, 1000, 55, 31, C.ink, true);
  text(s, "BUILD THE EXPERIENCE", 72, 228, 450, 30, 14, C.green, true);
  text(s, "React", 72, 278, 200, 52, 34, C.ink, true);
  text(s, "Vite", 288, 278, 160, 52, 34, C.ink, true);
  text(s, "Tailwind CSS", 72, 344, 270, 35, 20, C.muted);
  text(s, "React Router · Lucide React", 72, 390, 400, 35, 18, C.muted);
  text(s, "Chart.js · react-chartjs-2", 72, 434, 400, 35, 18, C.muted);
  line(s, 612, 218, 612, 552, C.line, 1);
  text(s, "CONNECT AND SERVE DATA", 704, 228, 500, 30, 14, C.blue, true);
  text(s, "Node.js", 704, 278, 240, 52, 34, C.ink, true);
  text(s, "Express", 954, 278, 220, 52, 34, C.ink, true);
  text(s, "GitHub REST API", 704, 344, 370, 35, 20, C.muted);
  text(s, "Fetch · dotenv · CORS", 704, 390, 400, 35, 18, C.muted);
  text(s, "Browser storage", 704, 434, 400, 35, 18, C.muted);
  box(s, 72, 536, 1120, 1, C.line);
  text(s, "JavaScript throughout  /  localStorage for profile, theme, bookmarks, and notes", 72, 567, 1100, 42, 17, C.ink, true);
  notes(s, "(3:00–3:50) The stack is JavaScript from the browser through the server. On the frontend, React builds the interface and Vite runs the development workflow. Tailwind CSS handles styling; React Router manages page navigation. Lucide React supplies interface icons. Chart.js and its React wrapper render the analytics charts. On the backend, Node.js runs an Express API. The server uses the GitHub REST API for repository data, with fetch requests, dotenv for optional configuration, and CORS middleware. Browser storage holds local profile details, theme preference, bookmarks, and notes. This makes the project straightforward to run locally, while keeping account data browser-specific.");
}

// 6. Scope and close
{
  const s = addSlide("Current scope and next steps", "05", C.ink);
  text(s, "What the current version does well", 72, 128, 690, 50, 30, C.white, true);
  text(s, "Fast repository discovery with practical details and a personal shortlist.", 72, 192, 610, 68, 21, "#C7D1CA");
  text(s, "Current boundaries", 72, 326, 440, 36, 20, C.lime, true);
  text(s, "Sign-in is a local profile, not verified authentication.\nBookmarks and notes stay in this browser.\nAnalytics use current results, not historical trends.", 72, 374, 610, 124, 18, C.white);
  line(s, 706, 142, 706, 542, "#46534B", 1);
  text(s, "Natural next steps", 774, 326, 400, 36, 20, C.lime, true);
  text(s, "Add server-side accounts and persistence.\nCache API results for longer workflows.\nCompare repositories side by side.", 774, 374, 420, 124, 18, C.white);
  text(s, "Thank you", 774, 548, 340, 54, 28, C.lime, true);
  notes(s, "(3:50–5:00) To close, the project delivers a focused workflow for repository discovery and first-pass evaluation. It gives users search, useful filters, repository details, bookmarks, notes, and lightweight analytics in one place. The current version also has clear scope limits. Sign-in stores a local profile and does not verify identity. Bookmarks and notes do not sync to a server or across devices. Analytics show the repositories retrieved in the current session, not historical growth. Those limits suggest practical next steps: add verified accounts with database persistence, introduce broader caching for repeated searches, and let users compare repositories directly. The central idea remains simple: reduce the friction between finding an open-source project and deciding whether to explore it further. Thank you.");
}

await fs.mkdir(buildDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });
const candidatePath = path.join(buildDir, "candidate.pptx");
await (await PresentationFile.exportPptx(pres)).save(candidatePath);
const renderDir = path.join(buildDir, "render");
await fs.mkdir(renderDir, { recursive: true });
for (const [index, slide] of slides.entries()) {
  const png = await pres.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(renderDir, `slide-${index + 1}.png`), new Uint8Array(await png.arrayBuffer()));
}

const report = await finalizePresentation({
  explicitTotalSlideCount: 6,
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable: "C:/Users/dell_/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe",
  integrityValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-heading-fit"],
  fontPolicy: { basis: "design", families: [font] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(buildDir, "validation-class-talk.json"),
});
console.log(JSON.stringify({ finalPath, font, report }, null, 2));
