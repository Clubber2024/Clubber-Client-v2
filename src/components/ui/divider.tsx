import { cn } from '@/lib/utils';

interface DividerProps {
  className?: string;
}

export default function Divider({ className }: DividerProps) {
  return <div className={cn(' border-b bg-gray-200', className)} />;
}
