"use client";

import { useEffect, useRef, useState } from 'react';

interface CKEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function CKEditor({ content, onChange, placeholder = "Start writing..." }: CKEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    let editorInstance: any = null;

    const initializeEditor = async () => {
      if (typeof window !== 'undefined' && editorRef.current) {
        try {
          // Dynamically import CKEditor
          const { default: DecoupledEditor } = await import('@ckeditor/ckeditor5-build-decoupled-document');
          
          const editorInstance = await DecoupledEditor.create(editorRef.current, {
            placeholder,
            toolbar: {
              items: [
                'heading',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                '|',
                'fontSize',
                'fontColor',
                'fontBackgroundColor',
                '|',
                'alignment',
                '|',
                'numberedList',
                'bulletedList',
                '|',
                'outdent',
                'indent',
                '|',
                'link',
                'blockQuote',
                'insertTable',
                '|',
                'imageUpload',
                'mediaEmbed',
                '|',
                'undo',
                'redo',
                '|',
                'sourceEditing'
              ]
            },
            heading: {
              options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
              ]
            },
            fontSize: {
              options: [
                9, 11, 13, 'default', 17, 19, 21, 27, 35
              ]
            },
            fontColor: {
              colors: [
                {
                  color: 'hsl(0, 0%, 0%)',
                  label: 'Black'
                },
                {
                  color: 'hsl(0, 0%, 30%)',
                  label: 'Dim grey'
                },
                {
                  color: 'hsl(0, 0%, 60%)',
                  label: 'Grey'
                },
                {
                  color: 'hsl(0, 0%, 90%)',
                  label: 'Light grey'
                },
                {
                  color: 'hsl(0, 0%, 100%)',
                  label: 'White',
                  hasBorder: true
                },
                {
                  color: 'hsl(0, 75%, 60%)',
                  label: 'Red'
                },
                {
                  color: 'hsl(30, 75%, 60%)',
                  label: 'Orange'
                },
                {
                  color: 'hsl(60, 75%, 60%)',
                  label: 'Yellow'
                },
                {
                  color: 'hsl(90, 75%, 60%)',
                  label: 'Light green'
                },
                {
                  color: 'hsl(120, 75%, 60%)',
                  label: 'Green'
                },
                {
                  color: 'hsl(150, 75%, 60%)',
                  label: 'Aquamarine'
                },
                {
                  color: 'hsl(180, 75%, 60%)',
                  label: 'Turquoise'
                },
                {
                  color: 'hsl(210, 75%, 60%)',
                  label: 'Light blue'
                },
                {
                  color: 'hsl(240, 75%, 60%)',
                  label: 'Blue'
                },
                {
                  color: 'hsl(270, 75%, 60%)',
                  label: 'Purple'
                }
              ]
            },
            fontBackgroundColor: {
              colors: [
                {
                  color: 'hsl(0, 0%, 0%)',
                  label: 'Black'
                },
                {
                  color: 'hsl(0, 0%, 30%)',
                  label: 'Dim grey'
                },
                {
                  color: 'hsl(0, 0%, 60%)',
                  label: 'Grey'
                },
                {
                  color: 'hsl(0, 0%, 90%)',
                  label: 'Light grey'
                },
                {
                  color: 'hsl(0, 0%, 100%)',
                  label: 'White',
                  hasBorder: true
                },
                {
                  color: 'hsl(0, 75%, 60%)',
                  label: 'Red'
                },
                {
                  color: 'hsl(30, 75%, 60%)',
                  label: 'Orange'
                },
                {
                  color: 'hsl(60, 75%, 60%)',
                  label: 'Yellow'
                },
                {
                  color: 'hsl(90, 75%, 60%)',
                  label: 'Light green'
                },
                {
                  color: 'hsl(120, 75%, 60%)',
                  label: 'Green'
                },
                {
                  color: 'hsl(150, 75%, 60%)',
                  label: 'Aquamarine'
                },
                {
                  color: 'hsl(180, 75%, 60%)',
                  label: 'Turquoise'
                },
                {
                  color: 'hsl(210, 75%, 60%)',
                  label: 'Light blue'
                },
                {
                  color: 'hsl(240, 75%, 60%)',
                  label: 'Blue'
                },
                {
                  color: 'hsl(270, 75%, 60%)',
                  label: 'Purple'
                }
              ]
            },
            table: {
              contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableCellProperties',
                'tableProperties'
              ]
            },
            image: {
              toolbar: [
                'imageTextAlternative',
                'toggleImageCaption',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side'
              ]
            },
            link: {
              decorators: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                toggleDownloadable: {
                  mode: 'manual',
                  label: 'Downloadable',
                  attributes: {
                    download: 'file'
                  }
                }
              }
            }
          });

          // Add the toolbar to the page
          const toolbarContainer = document.querySelector('#toolbar-container');
          if (toolbarContainer && editorInstance.ui.view.toolbar.element) {
            toolbarContainer.appendChild(editorInstance.ui.view.toolbar.element);
          }

          // Set initial content
          if (content) {
            editorInstance.setData(content);
          }

          // Listen for changes
          editorInstance.model.document.on('change:data', () => {
            onChange(editorInstance.getData());
          });

          setEditor(editorInstance);
          setIsLoaded(true);

        } catch (error) {
          console.error('Error initializing CKEditor:', error);
        }
      }
    };

    initializeEditor();

    return () => {
      if (editorInstance) {
        editorInstance.destroy().catch((error: any) => {
          console.error('Error destroying CKEditor:', error);
        });
      }
    };
  }, []);

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getData()) {
      editor.setData(content);
    }
  }, [content, editor]);

  return (
    <div className="ck-editor-container">
      <div id="toolbar-container" className="border border-b-0 rounded-t-md bg-background"></div>
      <div 
        ref={editorRef}
        className="min-h-[400px] border rounded-b-md p-4 prose dark:prose-invert max-w-none focus:outline-none"
        style={{ minHeight: '400px' }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="text-sm text-muted-foreground">Loading editor...</div>
        </div>
      )}
    </div>
  );
}