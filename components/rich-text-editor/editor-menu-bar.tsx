import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { menuItems, historyItems } from './menu-items';
import { cn } from '@/lib/utils';

interface EditorMenuBarProps {
  editor: Editor;
}

export function EditorMenuBar({ editor }: EditorMenuBarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-background p-2">
      <div className="flex items-center space-x-1">
        {historyItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            size="icon"
            onClick={() => item.command(editor)}
            className="h-8 w-8"
          >
            <item.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {menuItems.map((section) => (
        <DropdownMenu key={section.title}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2 font-normal"
            >
              <section.icon className="h-4 w-4" />
              <span className="hidden md:inline">{section.title}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {section.items.map((item) => (
              <DropdownMenuItem
                key={item.name}
                onClick={() => item.command(editor)}
                className={cn(
                  'flex items-center gap-2',
                  item.isActive?.(editor) && 'bg-accent'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
}