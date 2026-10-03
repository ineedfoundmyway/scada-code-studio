import { ArrowRight, Cpu, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import profile from "@/assets/brunno-dev-opening.jpg.asset.json";
import { useLanguage } from "../Language";

export function IntroSlide({ onNavigate }: { onNavigate?: (index: number) => void }) {
  const { t } = useLanguage();
  return (
    <div className="intro-slide flex h-full flex-col justify-center gap-10">
      <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-center">
        <a href="https://brunnodev.store" target="_blank" rel="noopener noreferrer" className="profile-link shrink-0" aria-label={t("Perfil de brunnodev")}>
          <img src={profile.url} alt={t("Perfil de brunnodev")} className="profile-image rounded-lg border border-border object-cover" />
        </a>
        <a href="https://brunnodev.store" target="_blank" rel="noopener noreferrer" className="brand-wordmark text-5xl font-bold text-foreground transition-colors hover:text-primary">brunnodev<span className="text-primary">.</span></a>
      </div>
      <div className="space-y-5">
        <div className="font-mono text-xs uppercase text-primary">{t("SCADA · PLC · Comandos Elétricos")}</div>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">SCADA Live<span className="block text-primary text-3xl sm:text-4xl">{t("Automação Industrial")}</span></h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{t("Uma apresentação interativa de SCADA e CLP aplicada a comandos elétricos. Acione botoeiras, observe a lógica ladder energizar em tempo real e leia o código IEC 61131-3 que executa por trás de cada acionamento.")}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={() => onNavigate?.(1)} size="lg">{t("Iniciar apresentação")}<ArrowRight /></Button>
          <Button onClick={() => onNavigate?.(2)} variant="outline" size="lg"><Workflow />{t("Explorar cenários")}</Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6">
        {[{value:"04",label:"Cenários"},{value:"ST + LD",label:"Linguagens"},{value:"TON",label:"Tempo real"}].map(item => <div key={item.label}><div className="font-mono text-xl text-primary">{item.value}</div><div className="mt-1 text-xs text-muted-foreground">{t(item.label)}</div></div>)}
        <Cpu className="ml-auto size-8 self-center text-accent" />
      </div>
    </div>
  );
}
