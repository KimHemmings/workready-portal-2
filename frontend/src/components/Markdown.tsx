type Props = { markdown: string };

// Small, dependency-free markdown renderer: headings, lists, blockquotes, bold, paragraphs.
export default function Markdown({ markdown }: Props) {
  const lines = markdown.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let ordered = false;

  const inline = (text: string) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part.replace(/\*([^*]+)\*/g, "$1")}</span>
      ),
    );

  const flush = () => {
    if (!list.length) return;
    const items = list.map((item, i) => (
      <li key={i} className="ml-5 list-outside leading-relaxed">
        {inline(item)}
      </li>
    ));
    blocks.push(
      ordered ? (
        <ol key={`l${blocks.length}`} className="list-decimal space-y-1.5 my-3">
          {items}
        </ol>
      ) : (
        <ul key={`l${blocks.length}`} className="list-disc space-y-1.5 my-3">
          {items}
        </ul>
      ),
    );
    list = [];
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (/^\s*[-*]\s+/.test(line)) {
      if (ordered) flush();
      ordered = false;
      list.push(line.replace(/^\s*[-*]\s+/, ""));
      return;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      if (!ordered) flush();
      ordered = true;
      list.push(line.replace(/^\s*\d+\.\s+/, ""));
      return;
    }
    flush();
    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={idx} className="text-lg font-semibold mt-5 mb-2">
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={idx} className="text-xl font-semibold mt-6 mb-2">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("# ")) {
      blocks.push(
        <h1 key={idx} className="text-2xl font-bold mt-4 mb-3">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={idx}
          className="border-l-4 border-primary/40 bg-secondary/60 pl-4 py-2 my-3 italic rounded-r-md"
        >
          {inline(line.slice(2))}
        </blockquote>,
      );
    } else if (line.trim()) {
      blocks.push(
        <p key={idx} className="leading-relaxed my-2">
          {inline(line)}
        </p>,
      );
    }
  });
  flush();

  return <div className="text-[15px] text-foreground">{blocks}</div>;
}
