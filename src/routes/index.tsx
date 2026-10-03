import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Activity, Cpu, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageProvider, useLanguage, type Language } from "@/components/scada/Language";
import { cn } from "@/lib/utils";
import { IntroSlide } from "@/components/scada/slides/IntroSlide";
import { ConceptSlide } from "@/components/scada/slides/ConceptSlide";
import { PartidaDiretaSlide } from "@/components/scada/slides/PartidaDiretaSlide";
import { ReversaoSlide } from "@/components/scada/slides/ReversaoSlide";
import { EstrelaTrianguloSlide } from "@/components/scada/slides/EstrelaTrianguloSlide";
import { SemaforoSlide } from "@/components/scada/slides/SemaforoSlide";
import { ClosingSlide } from "@/components/scada/slides/ClosingSlide";
export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "SCADA Live · Apresentação Interativa de CLP e Comandos Elétricos" },
            {
                name: "description",
                content: "Apresentação interativa de SCADA e CLP com simulações ao vivo de comandos elétricos, lógica ladder e código IEC 61131-3.",
            },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "author", content: "https://brunnodev.store" },
            { property: "og:title", content: "SCADA Live · CLP e Comandos Elétricos" },
            {
                property: "og:description",
                content: "Acione botoeiras, veja a lógica ladder energizar e leia o código IEC 61131-3 em tempo real.",
            },
        ],
    }),
    component: Presentation,
});
const SLIDES = [
    { id: "intro", title: "Abertura", section: "Apresentação", Comp: IntroSlide },
    { id: "arquitetura", title: "Arquitetura", section: "Conceitos", Comp: ConceptSlide },
    { id: "partida", title: "Partida Direta", section: "Cenário", Comp: PartidaDiretaSlide },
    { id: "reversao", title: "Reversão", section: "Cenário", Comp: ReversaoSlide },
    { id: "yd", title: "Estrela-Triângulo", section: "Cenário", Comp: EstrelaTrianguloSlide },
    { id: "semaforo", title: "Semáforo", section: "Cenário", Comp: SemaforoSlide },
    { id: "fim", title: "Encerramento", section: "Final", Comp: ClosingSlide },
];
function Presentation() {
    const [language, setLanguage] = useState<Language>("pt");
    useEffect(() => {
        document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
    }, [language]);
    return <LanguageProvider language={language}><Index onLanguageChange={setLanguage}/></LanguageProvider>;
}
function Index({ onLanguageChange }: {
    onLanguageChange: (language: Language) => void;
}) {
    const { language, t } = useLanguage();
    const [idx, setIdx] = useState(0);
    const total = SLIDES.length;
    const go = useCallback((n: number) => setIdx((i) => Math.max(0, Math.min(total - 1, n))), [total]);
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLElement && e.target.closest("button, a, input, textarea, select, [contenteditable]"))
                return;
            if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
                e.preventDefault();
                go(idx + 1);
            }
            else if (e.key === "ArrowLeft" || e.key === "PageUp") {
                e.preventDefault();
                go(idx - 1);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [idx, go]);
    const Current = SLIDES[idx].Comp;
    return (<div className="min-h-screen text-foreground flex flex-col">
      
      <header className="border-b border-border/60 bg-card/40 backdrop-blur-md">
        <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary/15 border border-primary/40 grid place-items-center">
              <Cpu className="h-4 w-4 text-primary"/>
            </div>
            <div>
              <div className="font-display font-bold text-sm leading-none">SCADA LIVE</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground mt-1">
                {t("PLC · Comandos Elétricos · IEC 61131-3")}
              </div>
            </div>
          </div>

          <nav className="hidden 2xl:flex items-center gap-1 ml-4">
            {SLIDES.map((s, i) => (<Button variant="ghost" key={s.id} onClick={() => go(i)} className={cn("px-3 py-1.5 rounded font-mono text-[10px] uppercase tracking-widest transition-colors", i === idx
                ? "bg-primary/15 text-primary border border-primary/40"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60")}>
                {String(i + 1).padStart(2, "0")} · {t(s.title)}
              </Button>))}
          </nav>

          <div className="ml-auto flex items-center gap-1 border border-border rounded-md p-0.5" role="group" aria-label={t("Idioma")}>
            <Languages className="size-4 mx-2 text-muted-foreground"/>
            {(["pt", "en"] as const).map(value => <Button key={value} size="sm" variant={language === value ? "secondary" : "ghost"} aria-pressed={language === value} onClick={() => onLanguageChange(value)}>{value.toUpperCase()}</Button>)}
          </div>
          <div className="hidden xl:flex flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-accent"/>
              <span className="text-accent">RUN</span>
            </div>
            <span>·</span>
            <span>CLP-01 · 192.168.0.10</span>
            <span>·</span>
            <Clock />
          </div>
        </div>
      </header>

      <nav className="2xl:hidden flex gap-1 px-4 py-2 overflow-x-auto border-b border-border" aria-label={t("Apresentação SCADA")}>
        {SLIDES.map((s, i) => <Button key={s.id} variant={idx === i ? "secondary" : "ghost"} size="sm" aria-current={idx === i ? "step" : undefined} onClick={() => go(i)}>{String(i + 1).padStart(2, "0")} · {t(s.title)}</Button>)}
      </nav>
      <main className="presentation-stage flex-1 px-4 sm:px-6 py-6 min-h-0">
        <div key={SLIDES[idx].id} className="slide-content min-h-[calc(100svh-11rem)] animate-in fade-in duration-300">
          <Current onNavigate={go}/>
        </div>
      </main>

      
      <footer className="border-t border-border/60 bg-card/40 backdrop-blur-md px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-2 sm:gap-4">
        <Button variant="ghost" aria-label={t("Anterior")} title={t("Anterior")} onClick={() => go(idx - 1)} disabled={idx === 0} className="h-9 w-9 grid place-items-center rounded border border-border bg-secondary/60 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="h-4 w-4"/>
        </Button>
        <Button variant="ghost" aria-label={t("Próximo")} title={t("Próximo")} onClick={() => go(idx + 1)} disabled={idx === total - 1} className="h-9 w-9 grid place-items-center rounded border border-border bg-secondary/60 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronRight className="h-4 w-4"/>
        </Button>

        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span className="text-primary">{String(idx + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(total).padStart(2, "0")}</span>
          <span className="mx-2 text-foreground/80">{t(SLIDES[idx].title)}</span>
          <span className="px-2 py-0.5 rounded border border-border bg-secondary/40 uppercase tracking-widest">
            {t(SLIDES[idx].section)}
          </span>
        </div>

        <div className="flex-1 min-w-16 mx-4 h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-500" style={{ width: `${((idx + 1) / total) * 100}%` }}/>
        </div>

        <a href="https://brunnodev.store" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-muted-foreground hover:text-primary">brunnodev</a>
      </footer>
    </div>);
}
function Clock() {
    const [t, setT] = useState<string>("--:--:--");
    useEffect(() => {
        const tick = () => setT(new Date().toLocaleTimeString("pt-BR", {
            hour12: false,
        }));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);
    return <span>{t}</span>;
}
