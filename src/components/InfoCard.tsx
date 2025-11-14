import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: string;
  className?: string;
}

export const InfoCard = ({ icon, title, description, delay = "0s", className }: InfoCardProps) => {
  return (
    <div
      className={cn(
        "group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 animate-fade-in hover:shadow-[var(--shadow-hover)] hover:scale-[1.02]",
        className
      )}
      style={{ animationDelay: delay }}
    >
      <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};
