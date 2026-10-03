import { Button } from "@/components/ui/button";
import { useLanguage } from "./Language";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
export function HMIPanel({ title, children, className, }: {
    title?: string;
    children: ReactNode;
    className?: string;
}) {
    return (<div className={cn("relative rounded-lg border border-border bg-card/60 backdrop-blur-sm overflow-hidden", "shadow-panel", className)}>
      <div className="absolute inset-0 scanline pointer-events-none opacity-60"/>
      {title && (<div className="relative flex items-center justify-between px-4 py-2 border-b border-border/60 bg-secondary/40">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent glow-on"/>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {title}
            </span>
          </div>
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-signal-fault/60"/>
            <div className="h-1.5 w-1.5 rounded-full bg-primary/70"/>
            <div className="h-1.5 w-1.5 rounded-full bg-signal-on/70"/>
          </div>
        </div>)}
      <div className="relative">{children}</div>
    </div>);
}
export function PushButton({ label, color = "green", pressed, onPress, onRelease, momentary = true, }: {
    label: string;
    color?: "green" | "red" | "amber" | "blue";
    pressed: boolean;
    onPress: () => void;
    onRelease?: () => void;
    momentary?: boolean;
}) {
    const { t } = useLanguage();
    const palette = {
        green: "from-signal-on/80 to-signal-on/40 ring-signal-on/60 text-background",
        red: "from-signal-fault/90 to-signal-fault/50 ring-signal-fault/60 text-background",
        amber: "from-primary to-primary/60 ring-primary/60 text-primary-foreground",
        blue: "from-accent to-accent/60 ring-accent/60 text-background",
    }[color];
    const handleDown = () => onPress();
    const handleUp = () => {
        if (momentary && onRelease)
            onRelease();
    };
    return (<Button variant="ghost" aria-label={label} aria-pressed={pressed} title={label} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); handleDown(); }} onPointerUp={handleUp} onPointerCancel={handleUp} onLostPointerCapture={handleUp} onKeyDown={(event) => { if ((event.key === " " || event.key === "Enter") && !event.repeat) {
        event.preventDefault();
        handleDown();
    } }} onKeyUp={(event) => { if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        handleUp();
    } }} onBlur={handleUp} className="group h-auto p-2 flex flex-col items-center gap-2 select-none touch-none hover:bg-transparent">
      <div className={cn("h-16 w-16 rounded-full bg-gradient-to-b ring-4 transition-all duration-75", "border border-foreground/10 shadow-lg", palette, pressed
            ? "translate-y-1 shadow-inner scale-95"
            : "shadow-pushbutton")}/>
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {t(label)}
      </span>
    </Button>);
}
export function Lamp({ label, on, color = "green", }: {
    label: string;
    on: boolean;
    color?: "green" | "red" | "amber";
}) {
    const palette = {
        green: on ? "bg-signal-on glow-on" : "bg-signal-on/15",
        red: on ? "bg-signal-fault glow-fault" : "bg-signal-fault/15",
        amber: on ? "bg-primary glow-warn" : "bg-primary/15",
    }[color];
    return (<div className="flex flex-col items-center gap-2">
      <div className="h-10 w-10 rounded-full p-1.5 bg-secondary border border-border">
        <div className={cn("h-full w-full rounded-full transition-all duration-200", palette)}/>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>);
}
export function Motor({ running, reverse = false, label = "M1", fault = false, }: {
    running: boolean;
    reverse?: boolean;
    label?: string;
    fault?: boolean;
}) {
    const { language } = useLanguage();
    return (<div className="flex flex-col items-center gap-2">
      <div className={cn("relative h-28 w-28 rounded-full border-4 flex items-center justify-center transition-all", fault
            ? "border-signal-fault bg-signal-fault/10 glow-fault"
            : running
                ? "border-signal-on bg-signal-on/10 glow-on"
                : "border-rail bg-muted")}>
        <div className={cn("h-20 w-20 rounded-full border-2 border-border bg-card flex items-center justify-center", running && (reverse ? "spin-rev" : "spin-fast"))}>
          <svg viewBox="0 0 100 100" className="h-16 w-16">
            <g fill="none" stroke="currentColor" strokeWidth="3" className="text-muted-foreground">
              <circle cx="50" cy="50" r="8"/>
              {[0, 60, 120, 180, 240, 300].map((a) => (<line key={a} x1="50" y1="50" x2={50 + 35 * Math.cos((a * Math.PI) / 180)} y2={50 + 35 * Math.sin((a * Math.PI) / 180)}/>))}
            </g>
          </svg>
        </div>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-background border border-border font-mono text-[10px]">
          {label}
        </div>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {fault ? (language === "pt" ? "FALHA" : "FAULT") : running ? `${language === "pt" ? "Ligado" : "Running"} ${reverse ? "REV" : "FWD"}` : (language === "pt" ? "Parado" : "Stopped")}
      </div>
    </div>);
}
export function StatusBar({ items }: {
    items: {
        label: string;
        value: string;
        tone?: "ok" | "warn" | "fault";
    }[];
}) {
    return (<div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 border-t border-border/60 bg-secondary/30 font-mono text-[11px]">
      {items.map((it) => (<div key={it.label} className="flex items-center gap-2">
          <span className="text-muted-foreground uppercase tracking-widest">{it.label}</span>
          <span className={cn("px-2 py-0.5 rounded border", it.tone === "fault"
                ? "text-signal-fault border-signal-fault/60 bg-signal-fault/10"
                : it.tone === "warn"
                    ? "text-primary border-primary/60 bg-primary/10"
                    : "text-signal-on border-signal-on/60 bg-signal-on/10")}>
            {it.value}
          </span>
        </div>))}
    </div>);
}
