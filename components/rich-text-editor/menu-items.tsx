import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  Table,
  Minus,
  Type,
  Palette,
  HighlighterIcon,
} from 'lucide-react';

export const menuItems = [
  {
    icon: Type,
    title: 'Text',
    items: [
      {
        name: 'heading-1',
        icon: Heading1,
        title: 'Heading 1',
        command: (editor: any) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: (editor: any) => editor.isActive('heading', { level: 1 }),
      },
      {
        name: 'heading-2',
        icon: Heading2,
        title: 'Heading 2',
        command: (editor: any) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: (editor: any) => editor.isActive('heading', { level: 2 }),
      },
      {
        name: 'heading-3',
        icon: Heading3,
        title: 'Heading 3',
        command: (editor: any) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: (editor: any) => editor.isActive('heading', { level: 3 }),
      },
      {
        name: 'paragraph',
        icon: Type,
        title: 'Paragraph',
        command: (editor: any) => editor.chain().focus().setParagraph().run(),
        isActive: (editor: any) => editor.isActive('paragraph'),
      },
    ],
  },
  {
    icon: Bold,
    title: 'Formatting',
    items: [
      {
        name: 'bold',
        icon: Bold,
        title: 'Bold',
        command: (editor: any) => editor.chain().focus().toggleBold().run(),
        isActive: (editor: any) => editor.isActive('bold'),
      },
      {
        name: 'italic',
        icon: Italic,
        title: 'Italic',
        command: (editor: any) => editor.chain().focus().toggleItalic().run(),
        isActive: (editor: any) => editor.isActive('italic'),
      },
      {
        name: 'underline',
        icon: Underline,
        title: 'Underline',
        command: (editor: any) => editor.chain().focus().toggleUnderline().run(),
        isActive: (editor: any) => editor.isActive('underline'),
      },
      {
        name: 'strike',
        icon: Strikethrough,
        title: 'Strikethrough',
        command: (editor: any) => editor.chain().focus().toggleStrike().run(),
        isActive: (editor: any) => editor.isActive('strike'),
      },
      {
        name: 'code',
        icon: Code,
        title: 'Code',
        command: (editor: any) => editor.chain().focus().toggleCode().run(),
        isActive: (editor: any) => editor.isActive('code'),
      },
    ],
  },
  {
    icon: List,
    title: 'Lists',
    items: [
      {
        name: 'bullet-list',
        icon: List,
        title: 'Bullet List',
        command: (editor: any) => editor.chain().focus().toggleBulletList().run(),
        isActive: (editor: any) => editor.isActive('bulletList'),
      },
      {
        name: 'ordered-list',
        icon: ListOrdered,
        title: 'Ordered List',
        command: (editor: any) => editor.chain().focus().toggleOrderedList().run(),
        isActive: (editor: any) => editor.isActive('orderedList'),
      },
    ],
  },
  {
    icon: AlignLeft,
    title: 'Alignment',
    items: [
      {
        name: 'align-left',
        icon: AlignLeft,
        title: 'Align Left',
        command: (editor: any) => editor.chain().focus().setTextAlign('left').run(),
        isActive: (editor: any) => editor.isActive({ textAlign: 'left' }),
      },
      {
        name: 'align-center',
        icon: AlignCenter,
        title: 'Align Center',
        command: (editor: any) => editor.chain().focus().setTextAlign('center').run(),
        isActive: (editor: any) => editor.isActive({ textAlign: 'center' }),
      },
      {
        name: 'align-right',
        icon: AlignRight,
        title: 'Align Right',
        command: (editor: any) => editor.chain().focus().setTextAlign('right').run(),
        isActive: (editor: any) => editor.isActive({ textAlign: 'right' }),
      },
      {
        name: 'align-justify',
        icon: AlignJustify,
        title: 'Align Justify',
        command: (editor: any) => editor.chain().focus().setTextAlign('justify').run(),
        isActive: (editor: any) => editor.isActive({ textAlign: 'justify' }),
      },
    ],
  },
  {
    icon: Image,
    title: 'Insert',
    items: [
      {
        name: 'image',
        icon: Image,
        title: 'Image',
        command: (editor: any) => {
          const url = window.prompt('Enter image URL');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        },
      },
      {
        name: 'link',
        icon: Link,
        title: 'Link',
        command: (editor: any) => {
          const url = window.prompt('Enter URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        },
        isActive: (editor: any) => editor.isActive('link'),
      },
      {
        name: 'table',
        icon: Table,
        title: 'Table',
        command: (editor: any) =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run(),
      },
      {
        name: 'horizontal-rule',
        icon: Minus,
        title: 'Horizontal Rule',
        command: (editor: any) => editor.chain().focus().setHorizontalRule().run(),
      },
    ],
  },
  {
    icon: Palette,
    title: 'Colors',
    items: [
      {
        name: 'color',
        icon: Palette,
        title: 'Text Color',
        command: (editor: any, color: string) =>
          editor.chain().focus().setColor(color).run(),
        isActive: (editor: any, color: string) =>
          editor.isActive('textStyle', { color }),
      },
      {
        name: 'highlight',
        icon: HighlighterIcon,
        title: 'Highlight',
        command: (editor: any, color: string) =>
          editor.chain().focus().toggleHighlight({ color }).run(),
        isActive: (editor: any, color: string) =>
          editor.isActive('highlight', { color }),
      },
    ],
  },
];

export const historyItems = [
  {
    name: 'undo',
    icon: Undo,
    title: 'Undo',
    command: (editor: any) => editor.chain().focus().undo().run(),
  },
  {
    name: 'redo',
    icon: Redo,
    title: 'Redo',
    command: (editor: any) => editor.chain().focus().redo().run(),
  },
];