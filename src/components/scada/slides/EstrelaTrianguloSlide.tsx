import { useLanguage } from "../Language";
import { useEffect, useRef, useState } from "react";
import { HMIPanel, PushButton, Lamp, Motor, StatusBar } from "../HMI";
import { LadderRung, Contact, Coil, Wire } from "../Ladder";
import { CodeView } from "../CodeView";
const ST_CODE = `PROGRAM EstrelaTriangulo
VAR_INPUT
    S0, S1, FT : BOOL;
END_VAR
VAR_OUTPUT
    K1 : BOOL;
    KY : BOOL;
    KD : BOOL;
END_VAR
VAR
    T1 : TON;
    M  : BOOL;
END_VAR

M := (S1 OR M) AND S0 AND FT;

T1(IN := M, PT := T#5s);

K1 := M;
KY := M AND NOT T1.Q AND NOT KD;
KD := M AND T1.Q;

END_PROGRAM`;
export function EstrelaTrianguloSlide() {
    const { t } = useLanguage();
    const [s1, setS1] = useState(false);
    const [s0p, setS0p] = useState(false);
    const [fault, setFault] = useState(false);
    const S0 = !s0p;
    const FT = !fault;
    const [M, setM] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const PT = 5000;
    const tickRef = useRef<number | null>(null);
    useEffect(() => {
        if (s1 && S0 && FT)
            setM(true);
    }, [s1, S0, FT]);
    useEffect(() => {
        if (!S0 || !FT)
            setM(false);
    }, [S0, FT]);
    useEffect(() => {
        if (!M) {
            setElapsed(0);
            if (tickRef.current)
                cancelAnimationFrame(tickRef.current);
            return;
        }
        let last = performance.now();
        const loop = (t: number) => {
            const dt = t - last;
            last = t;
            setElapsed((e) => Math.min(PT, e + dt));
            tickRef.current = requestAnimationFrame(loop);
        };
        tickRef.current = requestAnimationFrame(loop);
        return () => {
            if (tickRef.current)
                cancelAnimationFrame(tickRef.current);
        };
    }, [M]);
    const T1Q = elapsed >= PT;
    const K1 = M;
    const KD = M && T1Q;
    const KY = M && !T1Q && !KD;
    const progress = Math.min(100, (elapsed / PT) * 100);
    return (<div className="h-full flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.32em] text-primary mb-2">{t("04 · Cenário")}</div>
          <h2 className="text-4xl font-bold">{t("Partida Estrela-Triângulo")}</h2>
          <p className="text-muted-foreground mt-1">{t("Temporizador TON comuta a configuração após 5 segundos")}</p>
        </div>
        
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <HMIPanel title={t("HMI · Partida Y-Δ")} className="col-span-4 flex flex-col">
          <div className="p-6 flex-1 flex flex-col items-center justify-around gap-4">
            <Motor running={M} fault={fault} label="M1 · 15cv"/>
            <div className="w-full px-4">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground mb-1">
                <span>{t("T1 · Temporizador")}</span>
                <span className="text-primary">{(elapsed / 1000).toFixed(2)}s / 5.00s</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden border border-border">
                <div className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-75" style={{ width: `${progress}%` }}/>
              </div>
            </div>
            <div className="flex gap-4">
              <Lamp label={t("K1 · Linha")} on={K1} color="green"/>
              <Lamp label="KY · Y" on={KY} color="amber"/>
              <Lamp label="KD · Δ" on={KD} color="green"/>
              <Lamp label="Trip" on={fault} color="red"/>
            </div>
            <div className="flex gap-4">
              <PushButton label={t("S0 · Parar")} color="red" pressed={s0p} onPress={() => setS0p(true)} onRelease={() => setS0p(false)}/>
              <PushButton label={t("S1 · Partir")} color="green" pressed={s1} onPress={() => setS1(true)} onRelease={() => setS1(false)}/>
              <PushButton label={fault ? "Reset" : "Trip"} color="amber" momentary={false} pressed={false} onPress={() => setFault((f) => !f)}/>
            </div>
          </div>
          <StatusBar items={[
            { label: t("Etapa"), value: !M ? "STOP" : KY ? t("ESTRELA") : t("TRIÂNGULO"), tone: !M ? "warn" : KY ? "warn" : "ok" },
            { label: "I", value: !M ? "0 A" : KY ? "12 A" : "36 A" },
            { label: "Scan", value: "4.2 ms" },
        ]}/>
        </HMIPanel>

        <HMIPanel title="Ladder · Online" className="col-span-4">
          <div className="p-2">
            <LadderRung num={1} energized={M}>
              <Contact label="S1" on={s1}/>
              <Contact label="S0" on={S0} normallyClosed/>
              <Contact label="FT" on={FT} normallyClosed/>
              <Wire on={M}/>
              <Coil label="M" on={M} type="S"/>
            </LadderRung>
            <LadderRung num={2} energized={M}>
              <div className="pl-2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">└─</span>
                <Contact label="M" on={M}/>
                <Wire on={M} len="w-24"/>
              </div>
            </LadderRung>
            <LadderRung num={3} energized={M}>
              <Contact label="M" on={M}/>
              <Wire on={M}/>
              <Coil label={`T1 · ${(elapsed / 1000).toFixed(1)}s`} on={M} type="T"/>
            </LadderRung>
            <LadderRung num={4} energized={KY}>
              <Contact label="M" on={M}/>
              <Contact label="T1.Q" on={T1Q} normallyClosed/>
              <Contact label="KD" on={KD} normallyClosed/>
              <Wire on={KY}/>
              <Coil label="KY" on={KY}/>
            </LadderRung>
            <LadderRung num={5} energized={KD}>
              <Contact label="M" on={M}/>
              <Contact label="T1.Q" on={T1Q}/>
              <Wire on={KD}/>
              <Coil label="KD" on={KD}/>
            </LadderRung>
            <LadderRung num={6} energized={K1}>
              <Contact label="M" on={M}/>
              <Wire on={K1}/>
              <Coil label="K1" on={K1}/>
            </LadderRung>
          </div>
        </HMIPanel>

        <div className="col-span-4">
          <CodeView files={[{ name: "EstrelaTriangulo.st", lang: "Structured Text", code: ST_CODE }]} highlightLines={{ "EstrelaTriangulo.st": KY ? [21] : KD ? [22] : [15] }}/>
        </div>
      </div>
    </div>);
}
