/**
 * Standard utility mapping markdown characters to CSS-styled clean HTML blocks.
 * Eliminates bundle dependency issues and guarantees secure, sandboxed rendering.
 */
export function parseMarkdownToHTML(markdown: string): string {
  if (!markdown) return "";
  
  // Clean line endings
  let lines = markdown.split("\n");
  let inList = false;
  let inNumList = false;
  let formattedLines: string[] = [];

  for (let line of lines) {
    let trimmed = line.trim();

    // Check lists transitions
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        formattedLines.push('<ul class="list-disc pl-5 my-2 space-y-1 text-slate-300">');
        inList = true;
      }
      let content = trimmed.substring(2);
      formattedLines.push(`<li>${parseInlineMarkdown(content)}</li>`);
      continue;
    } else if (inList) {
      formattedLines.push('</ul>');
      inList = false;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      if (!inNumList) {
        formattedLines.push('<ol class="list-decimal pl-5 my-2 space-y-1 text-slate-300">');
        inNumList = true;
      }
      let content = trimmed.replace(/^\d+\.\s+/, "");
      formattedLines.push(`<li>${parseInlineMarkdown(content)}</li>`);
      continue;
    } else if (inNumList) {
      formattedLines.push('</ol>');
      inNumList = false;
    }

    // Headers
    if (trimmed.startsWith("# ")) {
      formattedLines.push(`<h1 class="text-2xl font-extrabold text-white mt-5 mb-3 border-b border-slate-800 pb-2 tracking-wide font-display">${parseInlineMarkdown(trimmed.substring(2))}</h1>`);
    } else if (trimmed.startsWith("## ")) {
      formattedLines.push(`<h2 class="text-xl font-bold text-slate-100 mt-4 mb-2 tracking-normal">${parseInlineMarkdown(trimmed.substring(3))}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      formattedLines.push(`<h3 class="text-lg font-semibold text-indigo-400 mt-3 mb-1">${parseInlineMarkdown(trimmed.substring(4))}</h3>`);
    } 
    // Horizontal Rule
    else if (trimmed === "---") {
      formattedLines.push('<hr class="border-slate-800 my-4" />');
    }
    // Blockquote
    else if (trimmed.startsWith("> ")) {
      let content = trimmed.substring(2);
      formattedLines.push(`<blockquote class="border-l-4 border-indigo-500 pl-4 py-2 my-3 italic text-slate-300 bg-brand-900/20 rounded-r">${parseInlineMarkdown(content)}</blockquote>`);
    }
    // Empty lines
    else if (trimmed === "") {
      formattedLines.push('<div class="h-2"></div>');
    }
    // Standard paragraphs
    else {
      formattedLines.push(`<p class="text-slate-300 leading-relaxed my-1.5">${parseInlineMarkdown(trimmed)}</p>`);
    }
  }

  // Close lists if document ends
  if (inList) formattedLines.push('</ul>');
  if (inNumList) formattedLines.push('</ol>');

  return formattedLines.join("\n");
}

function parseInlineMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
  
  // Italics *text*
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-200">$1</em>');

  // Highlight tags like [Speeding] or [Vehicle Number]
  html = html.replace(/\[(.*?)\]/g, '<span class="px-1.5 py-0.5 rounded text-xs bg-slate-800 text-indigo-300 font-mono">$1</span>');

  return html;
}
