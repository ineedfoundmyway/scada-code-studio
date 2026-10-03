import { useLanguage } from "../Language";
import { useEffect, useRef, useState } from "react";
import { HMIPanel, PushButton, Lamp, StatusBar } from "../HMI";
import { LadderRung, Contact, Coil, Wire } from "../Ladder";
import { CodeView } from "../CodeView";
const ST_CODE = `PROGRAM Semaforo
VAR_INPUT
    START, STOP : BOOL;
END_VAR
VAR_OUTPUT
    GREEN, YELLOW, RED : BOOL;
END_VAR
VAR
    STATE : INT := 0;
    T     : TON;
    EN    : BOOL;
END_VAR

EN := (START OR EN) AND NOT STOP;

IF NOT EN THEN
    STATE := 0;
ELSE
    CASE STATE OF
      0: STATE := 1;
      1: T(IN := TRUE, PT := T#6s);
         IF T.Q THEN STATE := 2; T(IN := FALSE); END_IF;
      2: T(IN := TRUE, PT := T#2s);
         IF T.Q THEN STATE := 3; T(IN := FALSE); END_IF;
      3: T(IN := TRUE, PT := T#5s);
         IF T.Q THEN STATE := 1; T(IN := FALSE); END_IF;
    END_CASE;
END_IF;

GREEN  := EN AND (STATE = 1);
YELLOW := EN AND (STATE = 2);
RED    := EN AND (STATE = 3);

END_PROGRAM`;
const PHASES = [
    { name: "GREEN", dur: 6000, next: "YELLOW" },
    { name: "YELLOW", dur: 2000, next: "RED" },
    { name: "RED", dur: 5000, next: "GREEN" },
] as const;
export function SemaforoSlide() {
    const { t } = useLanguage();
    const [en, setEn] = useState(false);
    const [phase, setPhase] = useState(0);
    const [t, setT] = useState(0);
    const raf = useRef<number | null>(null);
    useEffect(() => {
        if (!en) {
            setPhase(0);
            setT(0);
            if (raf.current)
                cancelAnimationFrame(raf.current);
            return;
        }
        let last = performance.now();
        const loop = (now: number) => {
            const dt = now - last;
            last = now;
            setT((cur) => {
                const next = cur + dt;
                if (next >= PHASES[phase].dur) {
                    setPhase((p) => (p + 1) % PHASES.length);
                    return 0;
                }
                return next;
            });
            raf.current = requestAnimationFrame(loop);
        };
        raf.current = requestAnimationFrame(loop);
        return () => {
            if (raf.current)
                cancelAnimationFrame(raf.current);
        };
    }, [en, phase]);
    const currentName = PHASES[phase].name;
    const GREEN = en && currentName === "GREEN";
    const YELLOW = en && currentName === "YELLOW";
    const RED = en && currentName === "RED";
    const progress = (t / PHASES[phase].dur) * 100;
    return (<div className="h-full flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.32em] text-primary mb-2">{t("05 · Cenário")}</div>
          <h2 className="text-4xl font-bold">{t("Semáforo Sequencial")}</h2>
          <p className="text-muted-foreground mt-1">{t("Máquina de estados (CASE) com temporizador único reaproveitado")}</p>
        </div>
        
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <HMIPanel title={t("HMI · Cruzamento")} className="col-span-4 flex flex-col">
          <div className="p-6 flex-1 flex flex-col items-center justify-around gap-6">
            <div className="w-32 rounded-xl border-2 border-border bg-secondary p-4 flex flex-col gap-3">
              <SemLamp on={RED} color="bg-signal-fault" glow="glow-fault"/>
              <SemLamp on={YELLOW} color="bg-primary" glow="glow-warn"/>
              <SemLamp on={GREEN} color="bg-signal-on" glow="glow-on"/>
            </div>
            <div className="w-full px-2">
              <div className="flex justify-between font-mono text-[10px] text-muted-foreground mb-1">
                <span>{t("FASE")}{currentName}</span>
                <span className="text-primary">
                  {(t / 1000).toFixed(2)}s / {(PHASES[phase].dur / 1000).toFixed(0)}s
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden border border-border">
                <div className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-75" style={{ width: `${progress}%` }}/>
              </div>
            </div>
            <div className="flex gap-4">
              <PushButton label="START" color="green" pressed={en} momentary={false} onPress={() => setEn(true)}/>
              <PushButton label="STOP" color="red" pressed={!en} momentary={false} onPress={() => setEn(false)}/>
            </div>
          </div>
          <StatusBar items={[
            { label: t("Estado"), value: en ? currentName : "OFF", tone: en ? "ok" : "warn" },
            { label: t("Ciclo"), value: `${phase + 1}/3` },
            { label: t("Modo"), value: "AUTO", tone: "ok" },
        ]}/>
        </HMIPanel>

        <HMIPanel title="Ladder · Online" className="col-span-4">
          <div className="p-2">
            <LadderRung num={1} energized={en}>
              <Contact label="START" on={en}/>
              <Contact label="STOP" on={!en} normallyClosed/>
              <Wire on={en}/>
              <Coil label="EN" on={en}/>
            </LadderRung>
            <LadderRung num={2} energized={GREEN}>
              <Contact label="EN" on={en}/>
              <Contact label="ST=1" on={GREEN}/>
              <Wire on={GREEN}/>
              <Coil label="GREEN" on={GREEN}/>
            </LadderRung>
            <LadderRung num={3} energized={YELLOW}>
              <Contact label="EN" on={en}/>
              <Contact label="ST=2" on={YELLOW}/>
              <Wire on={YELLOW}/>
              <Coil label="YELLOW" on={YELLOW}/>
            </LadderRung>
            <LadderRung num={4} energized={RED}>
              <Contact label="EN" on={en}/>
              <Contact label="ST=3" on={RED}/>
              <Wire on={RED}/>
              <Coil label="RED" on={RED}/>
            </LadderRung>
            <LadderRung num={5} energized={en}>
              <Contact label="EN" on={en}/>
              <Wire on={en}/>
              <Coil label={`T · ${(t / 1000).toFixed(1)}s`} on={en} type="T"/>
            </LadderRung>
          </div>
        </HMIPanel>

        <div className="col-span-4">
          <CodeView files={[{ name: "Semaforo.st", lang: "Structured Text", code: ST_CODE }]} highlightLines={{ "Semaforo.st": GREEN ? [20] : YELLOW ? [22] : RED ? [24] : [13] }}/>
        </div>
      </div>
    </div>);
}
function SemLamp({ on, color, glow }: {
    on: boolean;
    color: string;
    glow: string;
}) {
    return (<div className={`mx-auto h-12 w-12 rounded-full border-2 border-border/60 transition-all ${on ? `${color} ${glow}` : "bg-muted/40"}`}/>);
}
