import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GalleryVerticalEnd } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
       New Subhan
      </Link>
      <div className='absolute left-24 bottom-28 z-50 w-1/3'><img src="/—Pngtree—blue bus vektor_8046867.png" alt="" /></div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        
        <div className="relative z-20 flex items-center text-3xl font-medium">
        <GalleryVerticalEnd className="size-7 mr-4" />
          New <span className='text-gradient ml-2'>Subhan</span>
        </div>
        <span className="truncate text-xs text-gradient z-20 ml-36">Bus Service</span>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login
            </h1>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
