'use client'
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebar } from '../ui/sidebar';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  const {open} = useSidebar()
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-52px)]">
          <div className={`h-full  p-4 md:pl-8 md:pr-4  ${open?"w-[81vw]":"w-[97vw]"}`}>{children}</div>
        </ScrollArea>
      ) : (
        <div className="h-full  p-4 md:px-8">{children}</div>
      )}
    </>
  );
}
