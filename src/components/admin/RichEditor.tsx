"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const ToolBtn = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
      active
        ? "bg-[#0E84C7] text-white border-[#0E84C7]"
        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

export default function RichEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[#0E84C7] underline" } }),
      Image.configure({ HTMLAttributes: { class: "max-w-full rounded-xl my-4" } }),
      Placeholder.configure({ placeholder: placeholder || "Escribe el contenido aquí..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[320px] px-4 py-3 outline-none focus:outline-none text-sm leading-relaxed",
      },
    },
  });

  // Sync external value changes (e.g. loading from API)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false } as Parameters<typeof editor.commands.setContent>[1]);
    }
  }, [value, editor]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("URL del enlace:");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("URL de la imagen:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToolBtn title="Negrita" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn title="Cursiva" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolBtn>
        <ToolBtn title="Tachado" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <s>S</s>
        </ToolBtn>

        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        <ToolBtn title="Título H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolBtn>
        <ToolBtn title="Título H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolBtn>

        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        <ToolBtn title="Lista con viñetas" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • Lista
        </ToolBtn>
        <ToolBtn title="Lista numerada" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. Lista
        </ToolBtn>

        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        <ToolBtn title="Cita" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          ❝
        </ToolBtn>
        <ToolBtn title="Código" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          {'</>'}
        </ToolBtn>
        <ToolBtn title="Separador" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          —
        </ToolBtn>

        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        <ToolBtn title="Enlace" active={editor.isActive("link")} onClick={addLink}>
          🔗 Link
        </ToolBtn>
        <ToolBtn title="Imagen (URL)" onClick={addImage}>
          🖼 Img
        </ToolBtn>

        <span className="ml-auto text-xs text-gray-300 self-center pr-1">Editor visual</span>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}
