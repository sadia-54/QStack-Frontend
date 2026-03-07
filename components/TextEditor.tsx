"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const lowlight = createLowlight();

export default function RichTextEditor({ value, onChange }: Props) {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // disable default
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-purple-400/20 rounded-xl bg-white/5 overflow-hidden">

      {/* Toolbar */}
      <div className="flex gap-1 border-b border-purple-400/20 px-3 py-2 bg-white/5">

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-3 py-1 text-sm rounded-md text-gray-300 hover:bg-purple-500/20 hover:text-white transition"
        >
          <b>B</b>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-3 py-1 text-sm rounded-md text-gray-300 hover:bg-purple-500/20 hover:text-white transition"
        >
          <i>I</i>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className="px-3 py-1 text-sm rounded-md text-gray-300 hover:bg-purple-500/20 hover:text-white transition"
        >
          {"</>"}
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="px-3 py-1 text-sm rounded-md text-gray-300 hover:bg-purple-500/20 hover:text-white transition"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-3 py-1 text-sm rounded-md text-gray-300 hover:bg-purple-500/20 hover:text-white transition"
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="px-3 py-1 text-sm rounded-md text-gray-300 hover:bg-purple-500/20 hover:text-white transition"
        >
          1. List
        </button>

      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-[260px] p-3 text-white focus:outline-none"
      />
    </div>
  );
}