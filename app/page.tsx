"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, Braces, ChevronDown, ChevronRight, Code2, Cpu, Database,
  ExternalLink, FileCode2, Folder, FolderOpen, GitBranch, Github, Linkedin,
  Mail, Menu, Minus, PanelsTopLeft, Play, Search, Send, Server, Sparkles,
  Terminal as TerminalIcon, X, Zap
} from "lucide-react";

type FileItem = { name: string; path: string; icon: "ts" | "tsx" | "py" | "sql" | "md" | "cpp" | "ino" | "json" | "docker" };
type FolderItem = { name: string; children: FileItem[] };

const fileContent: Record<string, string> = {
  "profile/Karas.ts": `export const profile = {\n  name: "Karas Ebrahim",\n  title: "Data Scientist / AI & ML Engineer",\n  education: "B.Sc. Computer Science",\n  university: "ASU & University of East London",\n  focus: ["Data Science", "AI", "ML", "DL", "CV"],\n  backend: ["Node.js", "TypeScript", "Express", "MongoDB"],\n};`,
  "profile/README.md": `# Karas Ebrahim\n\nComputer Science freshman focused on Data Science,\nAI & Machine Learning, with a strong backend foundation.\n\n> Build. Learn. Ship. Repeat.`,
  "backend/Node.ts": `import express from "express";\n\nconst app = express();\napp.use(express.json());\n\n// Gym Booking API\napp.listen(process.env.PORT || 3000);`,
  "backend/Express.ts": `router.post("/api/auth/register", register);\nrouter.post("/api/auth/login", login);\nrouter.get("/api/classes", getAllClassSessions);\nrouter.post("/api/bookings", createBooking);`,
  "backend/GymBooking.md": `# Gym Booking API\n\nRESTful backend for gym classes and member bookings.\n\nAuthentication: JWT + HTTP-only cookies\nDatabase: MongoDB + Mongoose\nDocs: Swagger / OpenAPI`,
  "data/Python.py": `import pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# Clean → explore → visualize → model\ndf = pd.read_csv("dataset.csv")`,
  "data/ML.py": `from sklearn.linear_model import LogisticRegression\n\nmodel = LogisticRegression(max_iter=1000)\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)`,
  "data/CV.py": `# Computer Vision learning track\n# image processing • feature extraction\n# classification • evaluation`,
  "data/DL.py": `# Deep Learning learning track\n# neural networks • optimization\n# model evaluation • experimentation`,
  "database/MongoDB.ts": `import mongoose from "mongoose";\n\nawait mongoose.connect(process.env.MONGO_URI!);\nconsole.log("MongoDB connected");`,
  "database/SQL.sql": `SELECT skill, category, level\nFROM learning_stack\nWHERE category IN ('data', 'backend')\nORDER BY level DESC;`,
  "tools/Dockerfile": `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nCMD ["npm", "start"]`,
  "projects/Nidhogg.cpp": `// C++ + SFML 2.6.2\n// 2D local multiplayer action game\n// 3 maps • 16 stages • combat • movement\n// health • audio • animation • progression`,
  "projects/SmartLocker.ino": `// Arduino UNO smart locker\n// keypad + LCD + buzzer + servo\n// password protection • 3 attempts • alert`,
  "projects/GymBooking.md": `# Gym Booking API\n\nNode.js • TypeScript • Express.js\nMongoDB • Mongoose • JWT • bcrypt\nSwagger/OpenAPI • validation • RBAC`,
};

const folders: FolderItem[] = [
  { name: "profile", children: [{name:"Karas.ts",path:"profile/Karas.ts",icon:"ts"},{name:"README.md",path:"profile/README.md",icon:"md"}] },
  { name: "backend", children: [{name:"Node.ts",path:"backend/Node.ts",icon:"ts"},{name:"Express.ts",path:"backend/Express.ts",icon:"ts"},{name:"GymBooking.md",path:"backend/GymBooking.md",icon:"md"}] },
  { name: "data", children: [{name:"Python.py",path:"data/Python.py",icon:"py"},{name:"ML.py",path:"data/ML.py",icon:"py"},{name:"DL.py",path:"data/DL.py",icon:"py"},{name:"CV.py",path:"data/CV.py",icon:"py"}] },
  { name: "database", children: [{name:"MongoDB.ts",path:"database/MongoDB.ts",icon:"ts"},{name:"SQL.sql",path:"database/SQL.sql",icon:"sql"}] },
  { name: "tools", children: [{name:"Dockerfile",path:"tools/Dockerfile",icon:"docker"}] },
  { name: "projects", children: [{name:"GymBooking.md",path:"projects/GymBooking.md",icon:"md"},{name:"Nidhogg.cpp",path:"projects/Nidhogg.cpp",icon:"cpp"},{name:"SmartLocker.ino",path:"projects/SmartLocker.ino",icon:"ino"}] },
];

const iconFor = (kind: FileItem["icon"]) => kind === "py" ? "🐍" : kind === "sql" ? "◈" : kind === "md" ? "◆" : kind === "cpp" ? "C+" : kind === "ino" ? "⚡" : kind === "docker" ? "◇" : kind === "json" ? "{}" : "TS";

function TypeLine({ text, speed=28, delay=0, className="" }: { text:string; speed?:number; delay?:number; className?:string }) {
  const [value,setValue]=useState("");
  useEffect(()=>{ let i=0; const timer=window.setTimeout(()=>{const id=window.setInterval(()=>{i++;setValue(text.slice(0,i));if(i>=text.length)window.clearInterval(id)},speed)},delay); return()=>window.clearTimeout(timer)},[text,speed,delay]);
  return <span className={className}>{value}<span className="caret">▌</span></span>;
}

function highlight(line:string){
  const esc=line.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  return esc
    .replace(/("[^\"]*")/g,'<span class="tok-str">$1</span>')
    .replace(/\b(import|from|const|return|export|default|function|async|await|new|SELECT|FROM|WHERE|ORDER|BY|IN|class|public|private|true|false)\b/g,'<span class="tok-key">$1</span>')
    .replace(/\b(Karas|profile|Node|Express|MongoDB|LogisticRegression|pandas|mongoose|JWT|TypeScript|Gym|Booking)\b/g,'<span class="tok-type">$1</span>')
    .replace(/(\/\/.*|#.*)/g,'<span class="tok-comment">$1</span>');
}

export default function Home(){
  const [currentDir, setCurrentDir] = useState<"~" | "about" | "projects" | "skills">("~");
  const [open,setOpen]=useState<Record<string,boolean>>({profile:true,backend:true,data:true,database:true,tools:false,projects:true});
  const [active,setActive]=useState("profile/Karas.ts");
  const [tabs,setTabs]=useState(["profile/Karas.ts","backend/Node.ts","data/Python.py"]);
  const [cursor,setCursor]=useState({x:0,y:0});
  const [mobileNav,setMobileNav]=useState(false);
  const [terminalInput,setTerminalInput]=useState("");
  const [terminalLines,setTerminalLines]=useState<string[]>([
    "Last login: karas-portfolio",
    "Type 'help' to explore this portfolio.",
  ]);
  const [playCommand,setPlayCommand]=useState("");
  const [playLines, setPlayLines] = useState<string[]>([
  "Booting KarasOS v2.6.0-optimized...",
  "Mounting Hierarchical Strict Union VFS layers...",
  "System ready. requestAnimationFrame rendering engine linked.",
  "Type 'help' to review shell methods pipeline.",
  ]);
  const [scroll,setScroll]=useState(0);

  useEffect(()=>{const onMove=(e:MouseEvent)=>setCursor({x:e.clientX,y:e.clientY});const onScroll=()=>{const h=document.documentElement.scrollHeight-window.innerHeight;setScroll(h?window.scrollY/h*100:0)};window.addEventListener("mousemove",onMove);window.addEventListener("scroll",onScroll,{passive:true});return()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("scroll",onScroll)}},[]);

  const current=fileContent[active] ?? "// Select a file from the Explorer";
  const currentName=active.split("/").at(-1) ?? "Karas.ts";
  const terminalCommand=useMemo(()=>`git log --oneline -3`,[]);

  const selectFile=(path:string)=>{setActive(path);setTabs(t=>t.includes(path)?t:[...t,path])};
  const closeTab=(path:string)=>setTabs(t=>{const next=t.filter(x=>x!==path);if(path===active)setActive(next.at(-1)??"profile/Karas.ts");return next});
  const jump=(id:string)=>{setMobileNav(false);document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"})};

  const runTerminal=(value:string)=>{
    const cmd=value.trim(); if(!cmd)return;
    let out:string[]=[];
    if(cmd==="help") out=["Available: ls, whoami, stack, projects, contact, clear, cat <file>"];
    else if(cmd==="ls") out=["profile/  backend/  data/  database/  tools/  projects/"];
    else if(cmd==="whoami") out=["Karas Ebrahim — Data Scientist / AI & ML Engineer"];
    else if(cmd==="stack") out=["Python  C++  TypeScript  JavaScript  SQL","Pandas  NumPy  Scikit-learn  Node.js  Express  MongoDB","Git  GitHub  Docker  Kaggle  Swagger/OpenAPI"];
    else if(cmd==="projects") out=["Gym Booking API  |  Nidhogg Game  |  Smart Locker System"];
    else if(cmd==="contact") out=["karas0ebrahim@gmail.com  |  linkedin.com/in/karas-ebrahim/","github.com/Karas-Ebrahim"];
    else if(cmd==="clear"){setTerminalLines([]);setTerminalInput("");return}
    else if(cmd.startsWith("cat ")){const target=cmd.slice(4);const key=Object.keys(fileContent).find(k=>k.endsWith(target));out=fileContent[key??""]?.split("\n").slice(0,7)??["cat: file not found"]}
    else out=[`command not found: ${cmd}`];
    setTerminalLines(v=>[...v,`$ ${cmd}`,...out]);setTerminalInput("");
  };
  
  const runPlay = (raw?: string) => {
  const input = (raw ?? playCommand).trim();
  if (!input) return;

  const cleanInput = input.replace(/^\$\s*/, "").trim().toLowerCase();
  const parts = cleanInput.split(/\s+/);
  const cmd = parts[0];
  const arg = parts[1];

  let out: string[] = [];

  switch (cmd) {
    case "help":
      out = [
        "Core Shell Engine commands authorized:",
        "  whoami      - Display developer identity",
        "  ls          - List folder workspace nodes",
        "  cd <dir>    - Traverse trees (supports '..')",
        "  cat <file>  - Print structured file data",
        "  open <lnk>  - Trigger external web layout redirects",
        "  pwd         - View raw environment context location",
        "  clear       - Flush active screen buffer",
      ];
      break;

    case "whoami":
      out = ["karas@portfolio: Data Scientist / AI & ML Engineer"];
      break;

    case "pwd":
      out = [`/home/karas${currentDir === "~" ? "" : "/" + currentDir}`];
      break;

    case "ls":
      if (currentDir === "~") {
        out = ["about/    projects/    skills/    github.lnk    linkedin.lnk"];
      } else if (currentDir === "about") {
        out = ["bio.txt"];
      } else if (currentDir === "skills") {
        out = ["languages.txt    frameworks.txt    tools.txt"];
      } else if (currentDir === "projects") {
        out = ["gym_booking.txt    nidhogg_game.txt    smart_locker.txt"];
      }
      break;

    case "cd":
      if (!arg || arg === "~" || arg === "home" || arg === "..") {
        setCurrentDir("~");
        jump("home");
        out = ["Switched to ~"];
      } else if (arg === "about" || arg === "about/") {
        setCurrentDir("about");
        jump("about");
        out = ["Switched to /about"];
      } else if (arg === "skills" || arg === "skills/" || arg === "stack" || arg === "stack/") {
        setCurrentDir("skills");
        jump("stack");
        out = ["Switched to /skills"];
      } else if (arg === "projects" || arg === "projects/") {
        setCurrentDir("projects");
        jump("projects");
        out = ["Switched to /projects"];
      } else {
        out = [`cd: no such file or directory: ${arg}`];
      }
      break;

    case "about":
      setCurrentDir("about");
      jump("about");
      out = ["Switched to /about"];
      break;

    case "skills":
    case "stack":
      setCurrentDir("skills");
      jump("stack");
      out = ["Switched to /skills"];
      break;

    case "projects":
      setCurrentDir("projects");
      jump("projects");
      out = ["Switched to /projects"];
      break;

    case "cat":
      if (!arg) {
        out = ["usage: cat <filename>"];
      } else if (arg === "bio.txt") {
        out = ["Karas Ebrahim — CS Freshman focused on Data Science, AI/ML, and Backend Systems."];
      } else if (arg === "languages.txt") {
        out = ["Python • C++ • TypeScript • JavaScript • SQL"];
      } else if (arg === "frameworks.txt") {
        out = ["Pandas • NumPy • Scikit-Learn • Node.js • Express • MongoDB"];
      } else if (arg === "tools.txt") {
        out = ["Git • GitHub • Docker • Kaggle • VS Code • Postman"];
      } else if (arg === "gym_booking.txt") {
        out = ["Gym Booking API: Node.js, Express, TypeScript, MongoDB, JWT, Swagger Docs."];
      } else if (arg === "nidhogg_game.txt") {
        out = ["Nidhogg Game: 2D local multiplayer in C++ / SFML 2.6.2."];
      } else if (arg === "smart_locker.txt") {
        out = ["Smart Locker System: Arduino UNO, C++, LCD, Servo, Password protection."];
      } else {
        out = [`cat: ${arg}: No such file or directory`];
      }
      break;

    case "open":
      if (arg === "github.lnk" || arg === "github") {
        window.open("https://github.com/Karas-Ebrahim", "_blank");
        out = ["Opening GitHub profile..."];
      } else if (arg === "linkedin.lnk" || arg === "linkedin") {
        window.open("https://www.linkedin.com/in/karas-ebrahim/", "_blank");
        out = ["Opening LinkedIn profile..."];
      } else {
        out = [`open: unknown target '${arg}'. Try: open github.lnk or open linkedin.lnk`];
      }
      break;

    case "clear":
      setPlayLines([]);
      setPlayCommand("");
      return;

    default:
      out = [`zsh: command not found: ${cleanInput}`];
  }

  const promptPath = currentDir === "~" ? "~" : `/${currentDir}`;
  setPlayLines((v) => [...v, `guest@karas.dev:${promptPath}$ ${input}`, ...out]);
  setPlayCommand("");
  };

  return <main className="site" style={{"--mx":`${cursor.x}px`,"--my":`${cursor.y}px`} as React.CSSProperties}>
    <div className="cursor-glow" />
    <div className="progress" style={{width:`${scroll}%`}} />

    <nav className="nav">
      <button className="brand" onClick={() => jump("home")}>
        <img 
        src="/icon.png" 
        alt="Karas Ebrahim" 
        className="brand-logo-img" 
       />
       <span>Karas Ebrahim</span>
     </button>
    <div className={`nav-links ${mobileNav ? "show" : ""}`}>
      <button onClick={() => jump("about")}>About</button>
      <button onClick={() => jump("stack")}>Stack</button>
      <button onClick={() => jump("projects")}>Projects</button>
      <button onClick={() => jump("playground")}>Playground</button>
      <button onClick={() => jump("contact")}>Contact</button>
    </div>
    <button className="talk" onClick={() => jump("contact")}>
      Let&apos;s talk <span>↗</span>
    </button>
    <button className="mobile-menu" onClick={() => setMobileNav((v) => !v)}>
      <Menu size={19} />
    </button>
  </nav>

    <section id="home" className="hero section">
      <div className="hero-left">
        <div className="availability"><span className="pulse"/> Available for new opportunities</div>
        <h1>Hi, I&apos;m <em>Karas<br/>Ebrahim</em><span className="dot">.</span></h1>
        <h2>I build with <span>data</span>, intelligence and code.</h2>
        <p>Computer Science freshman focused on Data Science, Artificial Intelligence, Machine Learning, Deep Learning, Computer Vision, and backend engineering.</p>
        <div className="hero-actions"><button className="primary" onClick={()=>jump("projects")}>View Projects <ExternalLink size={15}/></button><button className="secondary" onClick={()=>window.open("https://github.com/Karas-Ebrahim","_blank")}>GitHub <Github size={15}/></button></div>
        <div className="mini-stats"><span><b>3+</b> Core Projects</span><span><b>5+</b> Technical Domains</span><span><b>3.8</b> GPA</span></div>
      </div>
      <div className="terminal-hero">
        <div className="window-head"><div className="traffic"><i/><i/><i/></div><span>karas@portfolio:~</span><span className="head-right">● main</span></div>
        <div className="terminal-screen">
          <div className="terminal-prompt"><span>$</span> <TypeLine text="cat profile/Karas.ts" speed={45} delay={350}/></div>
          <div className="term-code"><span className="muted">const</span> <span className="blue">me</span> = {'{'}<br/><span className="indent">name: <span className="green">&quot;Karas Ebrahim&quot;</span>,</span><br/><span className="indent">role: <span className="green">&quot;Data Scientist / AI & ML Engineer&quot;</span>,</span><br/><span className="indent">education: <span className="green">&quot;B.Sc. Computer Science&quot;</span>,</span><br/><span className="indent">focus: [<span className="green">&quot;AI&quot;</span>, <span className="green">&quot;ML&quot;</span>, <span className="green">&quot;DL&quot;</span>, <span className="green">&quot;CV&quot;</span>],</span><br/> {'}'};</div>
          <div className="terminal-prompt second"><span>$</span> <TypeLine text={terminalCommand} speed={38} delay={1200}/></div>
          <div className="term-success">✓ portfolio build ready</div><div className="term-muted">↳ GitHub: <a href="https://github.com/Karas-Ebrahim" target="_blank">github.com/Karas-Ebrahim</a></div><div className="term-cursor">$ <span>▌</span></div>
        </div>
      </div>
    </section>

    <section id="about" className="section content-section">
      <div className="section-label"><span>01</span> ABOUT</div>
      <div className="split-heading"><div><h3>Built from curiosity.<br/><span>Driven by systems.</span></h3></div><p>I&apos;m building a career at the intersection of data, intelligent systems, and software engineering. I enjoy understanding how things work underneath the interface — then turning that understanding into something usable.</p></div>
      <div className="timeline-grid">
        <div className="timeline"><div className="year">2026 — Present</div><div className="line-card"><div className="card-top"><span className="tag cyan">NOW</span><b>Data Science · DEPI</b><span>training</span></div><p>Developing practical skills across Python for Data Science, data analysis, visualization, machine learning, MLOps, Deep Learning and Computer Vision.</p><small>→ Real-world datasets · ML workflows</small></div><div className="year">2026</div><div className="line-card"><div className="card-top"><span className="tag purple">BUILD</span><b>Backend Engineering · OSC</b><span>internship</span></div><p>Built a modular Gym Booking API with authentication, authorization, bookings, validation, MongoDB and Swagger/OpenAPI.</p><small>→ Team project · RESTful API</small></div><div className="year">2025</div><div className="line-card"><div className="card-top"><span className="tag green">FOUND</span><b>Computer Science · ASU</b><span>education</span></div><p>Built foundations in programming, mathematics, problem solving, data structures and algorithms through coursework and competitive programming.</p><small>→ First Year · Excellent · GPA 3.8</small></div></div>
        <aside className="about-panel"><div className="panel-title">developer.json</div><pre>{`{\n  "name": "Karas Ebrahim",\n  "degree": "B.Sc. Computer Science",\n  "graduation": "2029",\n  "location": "Cairo, Egypt",\n  "focus": [\n    "Data Science",\n    "AI / ML",\n    "Backend Engineering"\n  ],\n  "status": "Open to opportunities"\n}`}</pre><div className="focus-box"><b>Current focus</b><span><i/> Machine Learning</span><span><i/> Deep Learning</span><span><i/> Backend Systems</span></div></aside>
      </div>
    </section>

    <section id="stack" className="section content-section">
      <div className="section-label"><span>02</span> STACK</div>
      <div className="stack-head"><h3>Tools I use.<br/><span>Things I&apos;m mastering.</span></h3><p>My stack is deliberately split between the data/AI track and the engineering foundation needed to ship real systems.</p></div>
      <div className="skill-grid">
        <Skill icon={<Code2/>} title="Programming" items={["Python","C++","TypeScript","JavaScript","SQL"]}/>
        <Skill icon={<Cpu/>} title="Data & ML" items={["Pandas","NumPy","Matplotlib","Seaborn","Scikit-learn","ML / DL / CV"]}/>
        <Skill icon={<Server/>} title="Backend" items={["Node.js","Express.js","REST APIs","JWT","Swagger/OpenAPI"]}/>
        <Skill icon={<Database/>} title="Databases" items={["MongoDB","Mongoose","SQL"]}/>
        <Skill icon={<GitBranch/>} title="Developer Tools" items={["Git","GitHub","Docker","Kaggle","VS Code","Postman"]}/>
        <Skill icon={<Braces/>} title="Core Concepts" items={["OOP","Data Structures","Algorithms","Authentication","Authorization","API Design"]}/>
      </div>
    </section>

    <section className="ide-wrap section">
      <div className="ide-window">
        <div className="ide-head"><div className="traffic"><i/><i/><i/></div><div className="crumb">karas-portfolio <span>/</span> workspace</div><div className="ide-status"><span className="green-dot"/> main <GitBranch size={13}/> TypeScript</div></div>
        <div className="ide-body">
          <aside className="activity-bar"><button className="active"><PanelsTopLeft/></button><button><Search/></button><button><GitBranch/><b>3</b></button><button><Code2/></button><button><Database/></button></aside>
          <aside className="explorer"><div className="explorer-title">EXPLORER</div><div className="search-box"><Search size={13}/> Search files...</div><div className="tree">{folders.map(folder=><div key={folder.name}><button className="tree-folder" onClick={()=>setOpen(v=>({...v,[folder.name]:!v[folder.name]}))}>{open[folder.name]?<ChevronDown size={14}/>:<ChevronRight size={14}/>} {open[folder.name]?<FolderOpen size={14}/>:<Folder size={14}/>} <span>{folder.name}</span><small>{folder.children.length}</small></button><div className={`tree-children ${open[folder.name]?"open":""}`}>{folder.children.map(file=><button key={file.path} className={`tree-file ${active===file.path?"selected":""}`} onClick={()=>selectFile(file.path)}><span className="file-indent"/><span className={`file-icon ${file.icon}`}>{iconFor(file.icon)}</span>{file.name}{active===file.path&&<i/>}</button>)}</div></div>)}</div></aside>
          <section className="editor-panel"><div className="tabs">{tabs.map(tab=><button key={tab} className={`editor-tab ${active===tab?"active":""}`} onClick={()=>setActive(tab)}><span className="file-icon ts">TS</span>{tab.split('/').at(-1)}<X size={12} onClick={e=>{e.stopPropagation();closeTab(tab)}}/></button>)}</div><div className="breadcrumb">karas-portfolio <span>/</span> {active.split('/')[0]} <span>/</span> <b>{currentName}</b></div><div className="editor"><div className="minimap"/>{current.split("\n").map((line,i)=><div className={`code-line ${i===2?"focus":""}`} key={i}><span>{String(i+1).padStart(2,"0")}</span><code dangerouslySetInnerHTML={{__html:highlight(line)}}/></div>)}</div><div className="ide-terminal"><div className="ide-term-head"><span><TerminalIcon size={13}/> TERMINAL</span><span>⌃</span></div><div className="ide-term-body">{terminalLines.slice(-7).map((line,i)=><div key={i} className={line.startsWith("$")?"cmd":line.includes("not found")?"err":"out"}>{line}</div>)}<div className="input-line"><span>$</span><input value={terminalInput} onChange={e=>setTerminalInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")runTerminal(terminalInput)}} placeholder="type help..." autoCapitalize="off"/></div></div></div><div className="status-bar"><span>● Next.js</span><span><GitBranch size={11}/> main</span><span>TS</span><span className="grow"/><span>Ln {current.split("\n").length}, Col 2</span><span>✓ Prettier</span></div></section>
        </div>
      </div>
    </section>

    <section id="projects" className="section content-section projects-section">
      <div className="section-label"><span>03</span> PROJECTS</div><div className="projects-head"><h3>Things I&apos;ve <span>built.</span></h3><div className="project-search"><Search size={15}/> Search projects, technologies, or types...</div></div>
      <div className="project-grid"><Project title="Gym Booking API" date="Aug 2026" featured tags={["Node.js","TypeScript","Express","MongoDB"]} description="Modular RESTful backend for gym class scheduling and member bookings, with JWT authentication, role-based authorization, validation, capacity controls and Swagger/OpenAPI documentation." link="https://github.com/Karas-Ebrahim/Gym-Booking-API"/><Project title="Nidhogg Game" date="Apr — May 2026" tags={["C++","SFML 2.6.2","Game Logic"]} description="2D local multiplayer action game featuring three maps, sixteen stages, combat, movement abilities, audio, animation and competitive stage progression." /><Project title="Smart Locker System" date="May 2026" tags={["Arduino","C++","Embedded"]} description="Password-protected smart locker using Arduino UNO, keypad, LCD, buzzer and servo motor with a three-attempt access policy and unauthorized-access alert." /></div>
    </section>

    <section id="playground" className="section playground-section">
  <div className="playground-inner">
    <div className="section-label"><span>04</span> PLAYGROUND</div>
    <div className="playground-title">
      <h3>Explore this portfolio<br/>through an <span>OS terminal.</span></h3>
      <p>It&apos;s not a screenshot. Try the shell.</p>
    </div>
    <div className="shell-terminal">
      <div className="shell-head">
        <div className="traffic"><i/><i/><i/></div>
        <span>karas@portfolio — zsh</span>
        <span>⌄</span>
      </div>
      <div className="shell-body">
        {playLines.slice(-16).map((l, i) => (
          <div key={i} className={l.includes("$") ? "cmd" : "out"}>
            {l}
          </div>
        ))}
        <div className="shell-input">
          <span>guest@karas.dev:{currentDir === "~" ? "~" : `/${currentDir}`}$</span>
          <input
            value={playCommand}
            onChange={(e) => setPlayCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runPlay();
            }}
            placeholder="try 'ls', 'cd skills', or 'help'..."
          />
        </div>
      </div>
    </div>
    <div className="play-hints">
      <span onClick={() => runPlay("cd skills")}>skills</span>
      <span onClick={() => runPlay("cd projects")}>projects</span>
      <span onClick={() => runPlay("help")}>help</span>
    </div>
  </div>
    </section>

    <section id="contact" className="section contact-section"><div className="contact-card"><div className="section-label"><span>05</span> CONTACT</div><h3>Let&apos;s build something<br/><span>worth shipping.</span></h3><p>Open to internships, collaborations, backend projects, and opportunities where I can grow in Data Science and AI/ML engineering.</p><div className="contact-links"><a href="mailto:karas0ebrahim@gmail.com"><Mail/> karas0ebrahim@gmail.com</a><a href="https://www.linkedin.com/in/karas-ebrahim/" target="_blank"><Linkedin/> LinkedIn ↗</a><a href="https://github.com/Karas-Ebrahim" target="_blank"><Github/> GitHub ↗</a></div><div className="contact-foot"><span>Based in Cairo, Egypt</span><span>© {new Date().getFullYear()} Karas Ebrahim</span><span>Built with Next.js</span></div></div></section>

    <footer className="footer"><span><Zap size={13}/> keep learning</span><span>Data → Intelligence → Systems</span><span>v2.0</span></footer>
  </main>
}

function Skill({icon,title,items}:{icon:React.ReactNode;title:string;items:string[]}){return <article className="skill-card"><div className="skill-icon">{icon}</div><h4>{title}</h4><div className="chips">{items.map(x=><span key={x}>{x}</span>)}</div></article>}
function Project({title,date,tags,description,link,featured=false}:{title:string;date:string;tags:string[];description:string;link?:string;featured?:boolean}){return <article className={`project-card ${featured?"featured":""}`}><div className="project-visual"><div className="project-grid-bg"/><div className="project-window"><div className="traffic"><i/><i/><i/></div><span>{title.toLowerCase().replaceAll(" ","-")}</span><div className="project-code"><b>{"{ "}</b><span>status</span>: <em>&quot;shipped&quot;</em><br/><span>stack</span>: [<em>{tags.slice(0,2).map(x=>`"${x}"`).join(", ")}</em>]</div></div></div><div className="project-info"><div className="project-meta"><span>{featured?<strong>FEATURED</strong>:"PROJECT"}</span><span>{date}</span></div><h4>{title}</h4><p>{description}</p><div className="project-tags">{tags.map(t=><span key={t}>{t}</span>)}</div>{link&&<a className="repo" href={link} target="_blank">View Repo <ExternalLink size={14}/></a>}</div></article>}
