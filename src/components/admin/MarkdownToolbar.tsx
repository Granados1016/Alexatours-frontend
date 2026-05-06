"use client";

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
}

type FormatAction = {
  label: string;
  title: string;
  action: (selected: string, before: string, after: string) => { prefix: string; suffix: string; placeholder: string };
};

const ACTIONS: FormatAction[] = [
  { label: "B", title: "Negrita", action: () => ({ prefix: "**", suffix: "**", placeholder: "texto en negrita" }) },
  { label: "I", title: "Cursiva", action: () => ({ prefix: "_", suffix: "_", placeholder: "texto en cursiva" }) },
  { label: "H2", title: "Título", action: () => ({ prefix: "## ", suffix: "", placeholder: "Título de sección" }) },
  { label: "H3", title: "Subtítulo", action: () => ({ prefix: "### ", suffix: "", placeholder: "Subtítulo" }) },
  { label: "—", title: "Separador", action: () => ({ prefix: "\n---\n", suffix: "", placeholder: "" }) },
  { label: "• Lista", title: "Lista con viñetas", action: () => ({ prefix: "\n- ", suffix: "", placeholder: "elemento de lista" }) },
  { label: "1. Lista", title: "Lista numerada", action: () => ({ prefix: "\n1. ", suffix: "", placeholder: "elemento de lista" }) },
  { label: "🔗 Link", title: "Enlace", action: (sel) => ({ prefix: "[", suffix: `](${sel.startsWith("http") ? sel : "https://"})`, placeholder: "texto del enlace" }) },
];

export default function MarkdownToolbar({ textareaRef, onChange }: Props) {
  const applyFormat = (action: FormatAction) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const fullText = el.value;
    const selected = fullText.substring(start, end);

    const { prefix, suffix, placeholder } = action.action(selected, fullText.substring(0, start), fullText.substring(end));
    const insert = selected || placeholder;
    const newText = fullText.substring(0, start) + prefix + insert + suffix + fullText.substring(end);

    onChange(newText);

    // Restaurar el foco y selección
    setTimeout(() => {
      el.focus();
      const newStart = start + prefix.length;
      const newEnd = newStart + insert.length;
      el.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border border-gray-200 border-b-0 rounded-t-xl bg-gray-50">
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          title={action.title}
          onClick={() => applyFormat(action)}
          className="px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          {action.label}
        </button>
      ))}
      <span className="ml-auto text-xs text-gray-300 self-center pr-1">Markdown</span>
    </div>
  );
}
