import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string;
}

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
