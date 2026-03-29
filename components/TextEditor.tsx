"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { useEffect } from "react";
import Image from "@tiptap/extension-image";

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
        defaultLanguage: "javascript",
      }),
      Image,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      editor?.chain().focus().setImage({ src: data.url }).run();

      event.target.value = ""; // reset input
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden">

      {/* Toolbar */}
      <div className="flex gap-1 border-b border-border px-3 py-2 bg-surface">

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-3 py-1 text-sm rounded-md text-text-secondary hover:bg-hover-bg hover:text-text-primary transition"
        >
          <b>B</b>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-3 py-1 text-sm rounded-md text-text-secondary hover:bg-hover-bg hover:text-text-primary transition"
        >
          <i>I</i>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className="px-3 py-1 text-sm rounded-md text-text-secondary hover:bg-hover-bg hover:text-text-primary transition"
        >
          {"</>"}
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="px-3 py-1 text-sm rounded-md text-text-secondary hover:bg-hover-bg hover:text-text-primary transition"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-3 py-1 text-sm rounded-md text-text-secondary hover:bg-hover-bg hover:text-text-primary transition"
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="px-3 py-1 text-sm rounded-md text-text-secondary hover:bg-hover-bg hover:text-text-primary transition"
        >
          1. List
        </button>

        <label className="px-3 py-1 text-sm rounded-md text-text-secondary hover:bg-hover-bg hover:text-text-primary transition cursor-pointer">
          Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
        </label>

      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-[260px] p-3 text-text-primary focus:outline-none"
      />
    </div>
  );
}