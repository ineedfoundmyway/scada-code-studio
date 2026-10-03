import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
export function LadderRung({ num, energized, children, }: {
    num: number;
    energized: boolean;
    children: ReactNode;
}) {
    return (<div className="group">
      <div className="flex items-stretch gap-0">
        <div className="w-8 shrink-0 flex items-center justify-center font-mono text-[11px] text-muted-foreground border-r border-border/40">
          {String(num).padStart(3, "0")}
        </div>
        <div className={cn("w-[3px] shrink-0 transition-all", energized ? "bg-signal-on pulse-rail" : "bg-rail/60")}/>
        <div className="flex-1 flex items-center gap-2 px-2 py-3 min-h-14">
          {children}
        </div>
        <div className={cn("w-[3px] shrink-0 transition-all", energized ? "bg-signal-on pulse-rail" : "bg-rail/60")}/>
      </div>
    </div>);
}
export function Wire({ on, len = "flex-1" }: {
    on: boolean;
    len?: string;
}) {
    return (<div className={cn(len, "h-[2px] transition-colors", on ? "bg-signal-on" : "bg-rail/50")}/>);
}
export function Contact({ label, on, normallyClosed = false, }: {
    label: string;
    on: boolean;
    normallyClosed?: boolean;
}) {
    const passing = normallyClosed ? !on : on;
    return (<div className="flex flex-col items-center gap-1">
      <div className="font-mono text-[10px] text-muted-foreground tracking-wide">{label}</div>
      <div className="relative flex items-center">
        <div className={cn("h-[2px] w-3", passing ? "bg-signal-on" : "bg-rail/60")}/>
        <div className={cn("h-7 w-[2px] transition-colors", passing ? "bg-signal-on" : "bg-rail")}/>
        <div className="w-2"/>
        {normallyClosed && (<div className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-7 h-[2px] rotate-45 origin-left", passing ? "bg-signal-on" : "bg-rail")}/>)}
        <div className={cn("h-7 w-[2px] transition-colors", passing ? "bg-signal-on" : "bg-rail")}/>
        <div className={cn("h-[2px] w-3", passing ? "bg-signal-on" : "bg-rail/60")}/>
      </div>
    </div>);
}
export function Coil({ label, on, type = "M" }: {
    label: string;
    on: boolean;
    type?: "M" | "T" | "S";
}) {
    return (<div className="flex flex-col items-center gap-1 ml-auto">
      <div className="font-mono text-[10px] text-muted-foreground tracking-wide">{label}</div>
      <div className="flex items-center">
        <div className={cn("h-[2px] w-3", on ? "bg-signal-on" : "bg-rail/60")}/>
        <div className={cn("h-8 w-8 rounded-full border-2 flex items-center justify-center font-mono text-[10px] transition-all", on
            ? "border-signal-on text-signal-on glow-on"
            : "border-rail text-muted-foreground/70")}>
          {type === "T" ? "TON" : type === "S" ? "SET" : "( )"}
        </div>
        <div className={cn("h-[2px] w-3", on ? "bg-signal-on" : "bg-rail/60")}/>
      </div>
    </div>);
}
