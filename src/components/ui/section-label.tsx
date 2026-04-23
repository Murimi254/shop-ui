import { cn } from "@/utils/utility-functions";
interface SectionLabelProps {
  tag: string;
  heading?: string;
  className?: string;
}

export function SectionLabel({ tag, heading, className }: SectionLabelProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-10 rounded bg-[#db4444]" />
        <span className="text-[#db4444] font-semibold text-sm">{tag}</span>
      </div>
      {heading && <h2 className="text-3xl font-bold text-black">{heading}</h2>}
    </div>
  );
}
