import { Button } from "@/components/ui/button";
import { useLanguage } from "./Language";
import { useState } from "react";
import { cn } from "@/lib/utils";
function highlightST(code: string) {
    const tokens: {
        type: string;
        value: string;
    }[] = [];
    const kw = /\b(PROGRAM|END_PROGRAM|VAR|END_VAR|VAR_INPUT|VAR_OUTPUT|IF|THEN|ELSE|ELSIF|END_IF|AND|OR|NOT|XOR|TRUE|FALSE|TON|TOF|CTU|FUNCTION_BLOCK|END_FUNCTION_BLOCK|RETURN|CASE|OF|END_CASE|FOR|TO|DO|END_FOR|WHILE|END_WHILE|R_TRIG|F_TRIG|RS|SR)\b/;
    const type = /\b(BOOL|INT|DINT|REAL|TIME|STRING|WORD|BYTE)\b/;
    const num = /\b\d+(\.\d+)?\b|T#\d+\w*/;
    const str = /'[^']*'/;
    const comment = /\(\*[\s\S]*?\*\)|\/\/[^\n]*/;
    const op = /:=|>=|<=|<>|=>|[:;().,+\-*/<>=]/;
    const ident = /[A-Za-z_][A-Za-z0-9_]*/;
    const ws = /\s+/;
    const order: [
        RegExp,
        string
    ][] = [
        [comment, "c"],
        [str, "s"],
        [kw, "k"],
        [type, "t"],
        [num, "n"],
        [op, "o"],
        [ident, "i"],
        [ws, "w"],
    ];
    let i = 0;
    while (i < code.length) {
        let matched = false;
        for (const [re, ty] of order) {
            const r = new RegExp("^(?:" + re.source + ")");
            const m = code.slice(i).match(r);
            if (m && m[0]) {
                tokens.push({ type: ty, value: m[0] });
                i += m[0].length;
                matched = true;
                break;
            }
        }
        if (!matched) {
            tokens.push({ type: "x", value: code[i] });
            i++;
        }
    }
    return tokens;
}
const colors: Record<string, string> = {
    k: "text-primary font-semibold",
    t: "text-accent",
    n: "text-primary",
    s: "text-accent",
    c: "text-muted-foreground italic",
    o: "text-signal-fault/80",
    i: "text-foreground/90",
    w: "",
    x: "",
};
export function CodeView({ files, highlightLines, }: {
    files: {
        name: string;
        lang: string;
        code: string;
    }[];
    highlightLines?: Record<string, number[]>;
}) {
    const { t } = useLanguage();
    const [active, setActive] = useState(0);
    const file = files[active];
    const lines = file.code.split("\n");
    const tokens = highlightST(file.code);
    let lineIdx = 0;
    const rendered: {
        line: number;
        nodes: React.ReactNode[];
    }[] = [{ line: 1, nodes: [] }];
    tokens.forEach((tok, k) => {
        const parts = tok.value.split("\n");
        parts.forEach((part, p) => {
            if (p > 0) {
                lineIdx++;
                rendered.push({ line: lineIdx + 1, nodes: [] });
            }
            if (part) {
                rendered[rendered.length - 1].nodes.push(<span key={`${k}-${p}`} className={colors[tok.type] || ""}>
            {part}
          </span>);
            }
        });
    });
    const hl = new Set(highlightLines?.[file.name] || []);
    return (<div className="flex flex-col h-full bg-background/60 rounded-lg border border-border overflow-hidden">
      <div className="flex items-center border-b border-border bg-secondary/40 px-2">
        {files.map((f, idx) => (<Button variant="ghost" key={f.name} onClick={() => setActive(idx)} className={cn("px-3 py-2 font-mono text-[11px] border-r border-border/60 transition-colors", idx === active
                ? "text-primary bg-background/60"
                : "text-muted-foreground hover:text-foreground")}>
            {f.name}
          </Button>))}
        <div className="ml-auto pr-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {file.lang}
        </div>
      </div>
      <div className="flex-1 overflow-auto font-mono text-[12.5px] leading-[1.55]">
        <pre className="m-0">
          {rendered.map((r, i) => (<div key={i} className={cn("flex px-0 group", hl.has(r.line) && "bg-primary/10 border-l-2 border-primary")}>
              <span className="w-10 shrink-0 text-right pr-3 text-muted-foreground/60 select-none border-r border-border/40 mr-3">
                {r.line}
              </span>
              <span className="whitespace-pre">{r.nodes.length ? r.nodes : " "}</span>
            </div>))}
        </pre>
      </div>
      <div className="px-3 py-1.5 border-t border-border bg-secondary/40 font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center justify-between">
        <span>{lines.length} {t("linhas · IEC 61131-3")}</span>
        <span className="text-accent">{t("● Compilado · Online")}</span>
      </div>
    </div>);
}
