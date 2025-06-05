import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import { extensions } from './extensions';
import { EditorMenuBar } from './editor-menu-bar';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, Link as LinkIcon } from 'lucide-react';
import { ImageUpload } from './image-upload';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export function TiptapEditor({ content, onChange, onImageUpload }: TiptapEditorProps) {
  const [showImageUpload, setShowImageUpload] = useState(false);

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (file: File) => {
    if (onImageUpload && editor) {
      try {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    setShowImageUpload(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md">
      <Tabs defaultValue="edit">
        <div className="border-b">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="edit"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
            >
              Edit
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
            >
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="p-0">
          <EditorMenuBar editor={editor} />
          
          {showImageUpload && (
            <div className="p-4 border-b">
              <ImageUpload onImageUpload={handleImageUpload} />
            </div>
          )}

          <EditorContent
            editor={editor}
            className="min-h-[400px] p-4 prose dark:prose-invert max-w-none"
          />

          {editor && (
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
              <div className="flex items-center space-x-1 rounded-md border bg-background shadow-md p-1">
                <Button
                  variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('link') ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    const url = window.prompt('Enter URL');
                    if (url) {
                      editor.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </BubbleMenu>
          )}
        </TabsContent>

        <TabsContent value="preview" className="p-4">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}