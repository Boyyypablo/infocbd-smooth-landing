import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  description: string;
  delay?: string;
  className?: string;
}

export const InfoCard = ({ title, description, delay = "0s", className }: InfoCardProps) => {
  return (
    <div
      className={cn(
        "group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 animate-fade-in hover:shadow-[var(--shadow-hover)] hover:scale-[1.02]",
        className
      )}
      style={{ animationDelay: delay }}
    >
      <h3 className="text-3xl font-bold text-primary mb-4 group-hover:text-primary/80 transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};
