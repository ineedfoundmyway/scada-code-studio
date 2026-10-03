import { useState } from "react";
import { Cpu, Database, Eye, Network, ArrowRight, Radio, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "../Language";
const blocks = [
    { icon: Database, title: "I/O e Comandos", sub: "Botoeiras, contatoras, sensores", desc: "Os comandos elétricos clássicos — NA, NF, selo e intertravamento — são a base da automação." },
    { icon: Network, title: "Field Bus", sub: "Modbus TCP · PROFINET · EtherCAT", desc: "Rede industrial que transporta os tags entre CLP, IHM, SCADA e dispositivos remotos." },
    { icon: Cpu, title: "CLP / PLC", sub: "Controlador Lógico Programável", desc: "Executa a lógica de controle em ciclo determinístico: lê entradas, processa o programa e escreve saídas." },
    { icon: Eye, title: "SCADA", sub: "Supervisory Control And Data Acquisition", desc: "Camada de supervisão — exibe sinópticos, alarmes, históricos e permite ao operador interagir com o processo." },
];
const levels = [
    { level: "L0", label: "Sensores / Atuadores", desc: "Medição física e acionamento dos equipamentos." },
    { level: "L1", label: "CLP / PLC", desc: "Controle determinístico e processamento da lógica." },
    { level: "L2", label: "SCADA / IHM", desc: "Supervisão do processo, alarmes e tendências." },
    { level: "L3", label: "MES", desc: "Execução da produção, receitas e rastreabilidade." },
    { level: "L4", label: "ERP", desc: "Planejamento empresarial, pedidos e recursos." },
];
export function ConceptSlide() {
    const { t } = useLanguage();
    const [selected, setSelected] = useState(0);
    const [signal, setSignal] = useState(false);
    const [level, setLevel] = useState(2);
    const block = blocks[selected];
    return (<div className="flex flex-col gap-6">
      <div><div className="font-mono text-xs uppercase text-primary mb-2">{t("01 · Arquitetura")}</div><h2 className="text-3xl sm:text-4xl font-bold">{t("Do botão à supervisão")}</h2></div>
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <h3 className="font-semibold">{t("Fluxo de sinal")}</h3>
        <Button variant={signal ? "secondary" : "default"} onClick={() => setSignal(value => !value)}>{signal ? <RotateCcw /> : <Radio />}{t(signal ? "Limpar sinal" : "Enviar sinal")}</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {blocks.map((item, i) => <Button key={item.title} variant="outline" aria-pressed={selected === i} onClick={() => setSelected(i)} className={cn("h-auto min-h-36 whitespace-normal items-start justify-start flex-col p-5 text-left", selected === i && "border-primary bg-primary/10", signal && "border-signal-on/60")}><div className="flex w-full justify-between"><item.icon className={cn("size-6", signal ? "text-signal-on" : "text-primary")}/>{i < 3 && <ArrowRight className="text-muted-foreground"/>}</div><span className="text-lg font-semibold">{t(item.title)}</span><span className="font-mono text-xs leading-relaxed text-muted-foreground">{t(item.sub)}</span></Button>)}
      </div>
      <section className="grid gap-6 border-y border-border py-6 lg:grid-cols-2" aria-live="polite">
        <div><h3 className="text-xl font-semibold mb-3">{t(block.title)}</h3><p className="text-muted-foreground leading-relaxed">{t(block.desc)}</p></div>
        <div className="space-y-3"><div className={cn("font-mono text-sm", signal ? "text-signal-on" : "text-muted-foreground")}>{t(signal ? "Sinal recebido" : "Aguardando sinal")} · I0.0 = {signal ? "1" : "0"} → Q0.0 = {signal ? "1" : "0"}</div><h4 className="text-sm font-semibold">{t("Ciclo de varredura")}</h4><div className="flex flex-wrap gap-2 text-xs text-muted-foreground">{["Ler entradas", "Executar lógica", "Atualizar saídas"].map((step, i) => <span key={step}>{i + 1}. {t(step)}{i < 2 && " →"}</span>)}</div></div>
      </section>
      <section><h3 className="text-lg font-semibold mb-4">{t("Pirâmide da automação · ISA-95")}</h3><div className="flex flex-wrap gap-2" role="group" aria-label="ISA-95">{levels.map((item, i) => <Button key={item.level} variant={level === i ? "default" : "outline"} onClick={() => setLevel(i)} aria-pressed={level === i}>{item.level} · {t(item.label)}</Button>)}</div><p className="mt-4 min-h-12 text-muted-foreground" aria-live="polite">{t(levels[level].desc)}</p></section>
      <div className="flex gap-3 border-t border-border pt-4 text-sm text-muted-foreground"><ShieldCheck className="size-5 shrink-0 text-accent"/><p>{t("Proteções físicas e intertravamentos devem ser validados antes de qualquer aplicação real.")}</p></div>
    </div>);
}
