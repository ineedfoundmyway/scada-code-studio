import { useLanguage } from "../Language";
import { useEffect, useState } from "react";
import { HMIPanel, PushButton, Lamp, Motor, StatusBar } from "../HMI";
import { LadderRung, Contact, Coil, Wire } from "../Ladder";
import { CodeView } from "../CodeView";
const ST_CODE = `PROGRAM PartidaDireta
VAR_INPUT
    S0 : BOOL;
    S1 : BOOL;
    FT : BOOL;
END_VAR
VAR_OUTPUT
    K1 : BOOL;
    L1 : BOOL;
END_VAR

K1 := (S1 OR K1) AND S0 AND FT;

L1 := K1;
END_PROGRAM`;
const LD_CODE = `| S1   S0   FT          K1   |
|--| |--|/|--| |---+----( )--|
|                  |          |
| K1               |          |
|--| |-------------+          |
|                              |
| K1                       L1  |
|--| |---------------------( )-|`;
export function PartidaDiretaSlide() {
    const { t } = useLanguage();
    const [s1, setS1] = useState(false);
    const [s0Pressed, setS0Pressed] = useState(false);
    const [fault, setFault] = useState(false);
    const S0 = !s0Pressed;
    const FT = !fault;
    const [sealed, setSealed] = useState(false);
    useEffect(() => {
        if (s1 && S0 && FT)
            setSealed(true);
    }, [s1, S0, FT]);
    useEffect(() => {
        if (!S0 || !FT)
            setSealed(false);
    }, [S0, FT]);
    const k1 = sealed && S0 && FT;
    const rungEnergized = k1;
    return (<div className="h-full flex flex-col gap-4">
      <Header num="02" title={t("Partida Direta")} sub={t("Selo + intertravamento térmico")}/>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        
        <HMIPanel title={t("HMI · Painel de Comando")} className="col-span-4 flex flex-col">
          <div className="p-6 flex-1 flex flex-col items-center justify-around gap-6">
            <Motor running={k1} fault={fault} label="M1 · 5cv"/>
            <div className="flex gap-4">
              <Lamp label="L1 · Run" on={k1} color="green"/>
              <Lamp label="Stop" on={!k1 && !fault} color="amber"/>
              <Lamp label="Trip" on={fault} color="red"/>
            </div>
            <div className="flex gap-5 items-end">
              <PushButton label={t("S0 · Parar")} color="red" pressed={s0Pressed} onPress={() => setS0Pressed(true)} onRelease={() => setS0Pressed(false)}/>
              <PushButton label={t("S1 · Ligar")} color="green" pressed={s1} onPress={() => setS1(true)} onRelease={() => setS1(false)}/>
              <PushButton label={fault ? "Reset" : "Trip FT"} color="amber" pressed={false} momentary={false} onPress={() => setFault((f) => !f)}/>
            </div>
          </div>
          <StatusBar items={[
            { label: "K1", value: k1 ? "ON" : "OFF", tone: k1 ? "ok" : "warn" },
            { label: "FT", value: fault ? "TRIP" : "OK", tone: fault ? "fault" : "ok" },
            { label: t("Modo"), value: "AUTO", tone: "ok" },
        ]}/>
        </HMIPanel>

        
        <HMIPanel title={t("Diagrama Ladder · Online Monitor")} className="col-span-4">
          <div className="p-2">
            <LadderRung num={1} energized={rungEnergized}>
              <Contact label="S1" on={s1}/>
              <Wire on={s1 || k1} len="w-4"/>
              <Contact label="S0" on={S0} normallyClosed/>
              <Wire on={(s1 || k1) && S0} len="w-4"/>
              <Contact label="FT" on={FT} normallyClosed/>
              <Wire on={rungEnergized}/>
              <Coil label="K1" on={k1}/>
            </LadderRung>
            <LadderRung num={2} energized={k1}>
              <div className="pl-2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">└─</span>
                <Contact label="K1" on={k1}/>
                <Wire on={k1} len="w-24"/>
              </div>
            </LadderRung>
            <LadderRung num={3} energized={k1}>
              <Contact label="K1" on={k1}/>
              <Wire on={k1}/>
              <Coil label="L1" on={k1}/>
            </LadderRung>
          </div>
        </HMIPanel>

        
        <div className="col-span-4">
          <CodeView files={[
            { name: "PartidaDireta.st", lang: "Structured Text", code: ST_CODE },
            { name: "PartidaDireta.ld", lang: "Ladder Diagram", code: LD_CODE },
        ]} highlightLines={{ "PartidaDireta.st": [12] }}/>
        </div>
      </div>
    </div>);
}
function Header({ num, title, sub }: {
    num: string;
    title: string;
    sub: string;
}) {
    const { t } = useLanguage();
    return (<div className="flex items-end justify-between">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.32em] text-primary mb-2">
          {num}{t("· Cenário")}</div>
        <h2 className="text-4xl font-bold">{title}</h2>
        <p className="text-muted-foreground mt-1">{sub}</p>
      </div>
      
    </div>);
}
