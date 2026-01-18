// jsonToResumeLatex.ts

export type Contact = {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
};

export type Education = {
  school?: string;
  degree?: string;
  start?: string;
  end?: string;
  gpa?: string;
};

export type Experience = {
  company?: string;
  role?: string;
  start?: string;
  end?: string;
  location?: string;
  bullets?: string[];
};

export type ResumeJson = {
  contact?: Contact;
  summary?: string;
  education?: Education[];
  experience?: Experience[];
  skillsText?: string;
};

export function escapeLatex(str: string = ""): string {
  return String(str)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

export function hasText(s: unknown): boolean {
  return !!String(s ?? "").trim();
}

export function joinNonEmpty(parts: string[], sep: string = " $|$ "): string {
  return parts.filter(Boolean).join(sep);
}

export function makeHeading(contact: Contact = {}): string {
  const phone = hasText(contact.phone) ? escapeLatex(contact.phone!) : "";

  const email = hasText(contact.email)
    ? `\\href{mailto:${escapeLatex(contact.email!)}}{\\underline{${escapeLatex(
        contact.email!
      )}}}`
    : "";

  const linkedin = hasText(contact.linkedin)
    ? `\\href{${escapeLatex(contact.linkedin!)}}{\\underline{${escapeLatex(
        contact.linkedin!.replace(/^https?:\/\//, "")
      )}}}`
    : "";

  const website = hasText(contact.website)
    ? `\\href{${escapeLatex(contact.website!)}}{\\underline{${escapeLatex(
        contact.website!.replace(/^https?:\/\//, "")
      )}}}`
    : "";

  const location = hasText(contact.location) ? escapeLatex(contact.location!) : "";

  return joinNonEmpty([phone, email, linkedin, website, location]);
}

export function normalizeBullets(bullets: unknown): string[] {
  if (!Array.isArray(bullets)) return [];
  return bullets.map((b) => String(b ?? "").trim()).filter(Boolean);
}

export function jsonToResumeLatex(resumeJson: ResumeJson): string {
  const d: ResumeJson = resumeJson || {};
  const contact: Contact = d.contact || {};

  const fullName = hasText(contact.fullName)
    ? escapeLatex(contact.fullName!)
    : "Your Name";

  const headingLine = makeHeading(contact);

  const summarySection = hasText(d.summary)
    ? `\\section{Summary}
\\small{${escapeLatex(String(d.summary))}}
`
    : "";

  const education: Education[] = Array.isArray(d.education) ? d.education : [];
  const educationSection =
    education.some((e) => hasText(e.school) || hasText(e.degree))
      ? `\\section{Education}
  \\resumeSubHeadingListStart
${education
  .filter((e) => hasText(e.school) || hasText(e.degree))
  .map((e) => {
    const school = escapeLatex(e.school || "");
    const degree = escapeLatex(e.degree || "");
    const dates = escapeLatex([e.start, e.end].filter(hasText).join(" -- "));
    const gpa = hasText(e.gpa) ? `, GPA: ${escapeLatex(e.gpa || "")}` : "";

    return `    \\resumeSubheading
      {${school}}{${dates}}
      {${degree}${gpa}}{}`;
  })
  .join("\n")}
  \\resumeSubHeadingListEnd
`
      : "";

  const experience: Experience[] = Array.isArray(d.experience) ? d.experience : [];
  const experienceSection =
    experience.some((x) => hasText(x.company) || hasText(x.role))
      ? `\\section{Experience}
  \\resumeSubHeadingListStart
${experience
  .filter((x) => hasText(x.company) || hasText(x.role))
  .map((x) => {
    const role = escapeLatex(x.role || "");
    const company = escapeLatex(x.company || "");
    const dates = escapeLatex([x.start, x.end].filter(hasText).join(" -- "));
    const loc = escapeLatex(x.location || "");

    const bullets = normalizeBullets(x.bullets);
    const bulletsBlock = bullets.length
      ? `
      \\resumeItemListStart
${bullets.map((b) => `        \\resumeItem{${escapeLatex(b)}}`).join("\n")}
      \\resumeItemListEnd`
      : "";

    return `    \\resumeSubheading
      {${role}}{${dates}}
      {${company}}{${loc}}${bulletsBlock}`;
  })
  .join("\n")}
  \\resumeSubHeadingListEnd
`
      : "";

  const skillsSection = hasText(d.skillsText)
    ? `\\section{Technical Skills}
 \\begin{itemize}
    \\small{\\item{
     ${escapeLatex(String(d.skillsText))}
    }}
 \\end{itemize}
`
    : "";

  // Paste your real preamble here
  const PREAMBLE = `
%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage[hidelinks]{hyperref}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

`;


  const body = `
\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${fullName}} \\\\ \\vspace{1pt}
    \\small ${headingLine}
\\end{center}

${summarySection}
${educationSection}
${experienceSection}
${skillsSection}

\\end{document}
`.trim();

  return `${PREAMBLE}\n\n${body}\n`;
}
