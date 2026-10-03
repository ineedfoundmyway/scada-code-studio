import { useLanguage } from "../Language";
import { useEffect, useState } from "react";
import { HMIPanel, PushButton, Lamp, Motor, StatusBar } from "../HMI";
import { LadderRung, Contact, Coil, Wire } from "../Ladder";
import { CodeView } from "../CodeView";

const ST_CODE = `PROGRAM Reversao
VAR_INPUT
    S0, S1, S2, FT : BOOL;
END_VAR
VAR_OUTPUT
    K1, K2 : BOOL;
END_VAR

K1 := (S1 OR K1) AND S0 AND FT AND NOT K2 AND NOT S2;

K2 := (S2 OR K2) AND S0 AND FT AND NOT K1 AND NOT S1;

END_PROGRAM`;

export function ReversaoSlide() {
  const { t } = useLanguage();
  const [s1, setS1] = useState(false);
  const [s2, setS2] = useState(false);
  const [s0p, setS0p] = useState(false);
  const [fault, setFault] = useState(false);
  const S0 = !s0p;
  const FT = !fault;

  const [sealFwd, setSealFwd] = useState(false);
  const [sealRev, setSealRev] = useState(false);

  useEffect(() => {
    if (!S0 || !FT) {
      setSealFwd(false);
      setSealRev(false);
    }
  }, [S0, FT]);
  useEffect(() => {
    if (s1 && !sealRev && !s2) setSealFwd(true);
  }, [s1, sealRev, s2]);
  useEffect(() => {
    if (s2 && !sealFwd && !s1) setSealRev(true);
  }, [s2, sealFwd, s1]);

  const K1 = sealFwd && S0 && FT && !sealRev;
  const K2 = sealRev && S0 && FT && !sealFwd;

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.32em] text-primary mb-2">{t("03 · Cenário")}</div>
          <h2 className="text-4xl font-bold">{t("Reversão de Motor")}</h2>
          <p className="text-muted-foreground mt-1">{t("Intertravamento elétrico — K1 bloqueia K2 e vice-versa")}</p>
        </div>
        
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <HMIPanel title={t("HMI · Painel")} className="col-span-4 flex flex-col">
          <div className="p-6 flex-1 flex flex-col items-center justify-around gap-5">
            <Motor running={K1 || K2} reverse={K2} fault={fault} label="M1" />
            <div className="flex gap-4">
              <Lamp label="L · FWD" on={K1} color="green" />
              <Lamp label="L · REV" on={K2} color="amber" />
              <Lamp label="Trip" on={fault} color="red" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <PushButton label={t("S0 · Parar")} color="red"
                pressed={s0p} onPress={() => setS0p(true)} onRelease={() => setS0p(false)} />
              <PushButton label={fault ? "Reset" : "Trip"} color="amber"
                momentary={false} pressed={false} onPress={() => setFault((f) => !f)} />
              <PushButton label={t("S1 · Direto")} color="green"
                pressed={s1} onPress={() => setS1(true)} onRelease={() => setS1(false)} />
              <PushButton label={t("S2 · Reverso")} color="blue"
                pressed={s2} onPress={() => setS2(true)} onRelease={() => setS2(false)} />
            </div>
          </div>
          <StatusBar items={[
            { label: "K1", value: K1 ? "ON" : "OFF", tone: K1 ? "ok" : "warn" },
            { label: "K2", value: K2 ? "ON" : "OFF", tone: K2 ? "ok" : "warn" },
            { label: "FT", value: fault ? "TRIP" : "OK", tone: fault ? "fault" : "ok" },
          ]} />
        </HMIPanel>

        <HMIPanel title="Ladder · Online" className="col-span-4">
          <div className="p-2">
            <LadderRung num={1} comment="Avanço com intertravamento de K2 e S2" energized={K1}>
              <Contact label="S1" on={s1} />
              <Contact label="S0" on={S0} normallyClosed />
              <Contact label="FT" on={FT} normallyClosed />
              <Contact label="K2" on={K2} normallyClosed />
              <Contact label="S2" on={s2} normallyClosed />
              <Wire on={K1} />
              <Coil label="K1" on={K1} />
            </LadderRung>
            <LadderRung num={2} comment="Selo de K1" energized={K1}>
              <div className="pl-2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">└─</span>
                <Contact label="K1" on={K1} />
                <Wire on={K1} len="w-20" />
              </div>
            </LadderRung>
            <LadderRung num={3} comment="Recuo com intertravamento de K1 e S1" energized={K2}>
              <Contact label="S2" on={s2} />
              <Contact label="S0" on={S0} normallyClosed />
              <Contact label="FT" on={FT} normallyClosed />
              <Contact label="K1" on={K1} normallyClosed />
              <Contact label="S1" on={s1} normallyClosed />
              <Wire on={K2} />
              <Coil label="K2" on={K2} />
            </LadderRung>
            <LadderRung num={4} comment="Selo de K2" energized={K2}>
              <div className="pl-2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">└─</span>
                <Contact label="K2" on={K2} />
                <Wire on={K2} len="w-20" />
              </div>
            </LadderRung>
          </div>
        </HMIPanel>

        <div className="col-span-4">
          <CodeView files={[{ name: "Reversao.st", lang: "Structured Text", code: ST_CODE }]}
            highlightLines={{ "Reversao.st": [K1 ? 8 : K2 ? 10 : 8] }} />
        </div>
      </div>
    </div>
  );
}