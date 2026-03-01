"use client";

import {
  MDXEditor,
  BoldItalicUnderlineToggles,
  CreateLink,
  ListsToggle,
  UndoRedo,
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";

interface MdxMarkdownEditorProps {
  markdown: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MdxMarkdownEditor({
  markdown,
  onChange,
  placeholder,
}: MdxMarkdownEditorProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white text-slate-900">
      <MDXEditor
        markdown={markdown}
        onChange={onChange}
        placeholder={placeholder}
        contentEditableClassName="min-h-[180px] bg-white px-4 py-3 text-sm leading-relaxed text-slate-900"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          linkPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <CreateLink />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}
