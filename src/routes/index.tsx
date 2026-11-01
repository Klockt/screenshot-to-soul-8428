import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portal de Reservas RREE · USM San Joaquín" },
      { name: "description", content: "Agenda horas de salud, apoyo psicológico y asistencia social en Relaciones Estudiantiles USM." },
      { property: "og:title", content: "Portal de Reservas RREE · USM" },
      { property: "og:description", content: "Agenda horas de salud y asistencia social en RREE USM San Joaquín." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: App,
});

type Cat = "salud" | "social";
type View = "inicio" | "agendar" | "citas";
type Cita = {
  id: string;
  categoria: Cat;
  profesional: string;
  fecha: string;
  bloque: string;
  tramite: string;
  comentarios: string;
};

const USER = "Adolfo Epstein";
const ROL = "202273514-K";
const CARRERA = "Ing. Civil Informática";

const PROFESIONALES: Record<Cat, string[]> = {
  salud: [
    "Ps. Roberto Méndez - Psicólogo, Oficina F-154",
    "Dra. Paula Fuentes - Médico General, Oficina F-150",
    "Dr. Ignacio Rojas - Dentista, Oficina F-151",
  ],
  social: [
    "Sra. Carmen Cárdenas Mundaca - Asistente Social, Oficina F-152, carmen.cardenas@usm.cl",
    "Sra. Valeria Soto - Asistente Social, Oficina F-153, valeria.soto@usm.cl",
  ],
};

const TRAMITES: Record<Cat, string[]> = {
  salud: ["Consulta psicológica", "Consulta médica general", "Atención dental", "Certificado médico"],
  social: [
    "Congelar con Gratuidad",
    "Pérdida de beneficios MINEDUC",
    "Postulación Becas MINEDUC",
    "Consulta general de Gratuidad",
  ],
};

const DOCUMENTOS: Record<string, string[]> = {
  "Congelar con Gratuidad": [
    "Formulario de solicitud de congelamiento firmado",
    "Certificado de alumno regular vigente",
    "Documento que respalde la causal (médico, laboral o familiar)",
    "Cédula de identidad",
  ],
  "Pérdida de beneficios MINEDUC": [
    "Concentración de notas actualizada",
    "Carta explicativa de la situación académica",
    "Documentos de respaldo de causal (certificados médicos, sociales)",
    "Cédula de identidad",
  ],
};

const BLOQUES = [
  "08:15 - 08:35",
  "09:00 - 09:20",
  "09:40 - 10:00",
  "10:55 - 12:05",
  "12:00 - 12:20",
  "14:40 - 15:00",
  "15:30 - 15:50",
  "16:15 - 16:35",
];

const CAT_LABEL: Record<Cat, string> = {
  salud: "Salud y Apoyo Psicológico",
  social: "Beneficios y Asistencia Social",
};

const INICIALES: Cita[] = [
  {
    id: "RREE-1042",
    categoria: "salud",
    profesional: PROFESIONALES.salud[0],
    fecha: "2026-11-05",
    bloque: "09:00 - 09:20",
    tramite: "Consulta psicológica",
    comentarios: "Seguimiento de sesión anterior.",
  },
  {
    id: "RREE-1057",
    categoria: "social",
    profesional: PROFESIONALES.social[0],
    fecha: "2026-11-10",
    bloque: "12:00 - 12:20",
    tramite: "Consulta general de Gratuidad",
    comentarios: "",
  },
];

function fmtFecha(f: string) {
  const [y, m, d] = f.split("-");
  return `${d}-${m}-${y}`;
}

function App() {
  const [view, setView] = useState<View>("inicio");
  const [citas, setCitas] = useState<Cita[]>(INICIALES);
  const [preCat, setPreCat] = useState<Cat | "">("");

  const goAgendar = (c: Cat | "") => {
    setPreCat(c);
    setView("agendar");
  };

  const tabs: { id: View; label: string }[] = [
    { id: "inicio", label: "Inicio" },
    { id: "agendar", label: "Agendar Atención" },
    { id: "citas", label: `Mis Citas Agendadas (${citas.length})` },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight">
              RREE <span className="text-accent">USM</span>
            </p>
            <p className="text-xs opacity-80">Relaciones Estudiantiles · Campus San Joaquín</p>
          </div>
          <p className="text-xs opacity-90">
            {USER} · Rol {ROL} · {CARRERA}
          </p>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => (t.id === "agendar" ? goAgendar(preCat) : setView(t.id))}
              className={`whitespace-nowrap rounded-t-md px-4 py-2 text-sm font-medium transition-colors ${
                view === t.id ? "bg-background text-primary" : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {view === "inicio" && <Inicio onAgendar={goAgendar} onCitas={() => setView("citas")} total={citas.length} />}
        {view === "agendar" && (
          <Agendar
            key={preCat || "none"}
            initialCat={preCat}
            onSubmit={(c) => setCitas((p) => [...p, c])}
            onCitas={() => setView("citas")}
          />
        )}
        {view === "citas" && (
          <MisCitas
            citas={citas}
            onAnular={(id) => setCitas((p) => p.filter((c) => c.id !== id))}
            onAgendar={() => goAgendar("")}
          />
        )}
      </main>
    </div>
  );
}

function Inicio({ onAgendar, onCitas, total }: { onAgendar: (c: Cat) => void; onCitas: () => void; total: number }) {
  const cards: { cat: Cat; desc: string; items: string }[] = [
    {
      cat: "salud",
      desc: "Atención de profesionales de la salud para tu bienestar físico y emocional.",
      items: "Psicología · Médico · Dental",
    },
    {
      cat: "social",
      desc: "Orientación con asistentes sociales sobre beneficios estudiantiles y trámites académico-financieros.",
      items: "Gratuidad · Becas MINEDUC · Congelamiento",
    },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-primary">Hola, Adolfo</h1>
        <p className="mt-1 text-muted-foreground">¿Qué tipo de atención necesitas hoy?</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((c) => (
          <div key={c.cat} className="flex flex-col rounded-lg border-t-4 border-accent bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl font-semibold text-primary">{CAT_LABEL[c.cat]}</h2>
            <p className="mt-1 text-sm font-medium text-secondary-foreground">{c.items}</p>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{c.desc}</p>
            <Button className="mt-5 self-start" onClick={() => onAgendar(c.cat)}>
              Agendar en esta categoría
            </Button>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-start justify-between gap-3 rounded-lg bg-secondary p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-secondary-foreground">Mis Citas Agendadas</p>
          <p className="text-sm text-muted-foreground">Tienes {total} cita(s) activa(s).</p>
        </div>
        <Button variant="outline" onClick={onCitas}>
          Ver mis citas
        </Button>
      </div>
    </div>
  );
}

function Req() {
  return <span className="text-destructive"> *</span>;
}

function Agendar({
  initialCat,
  onSubmit,
  onCitas,
}: {
  initialCat: Cat | "";
  onSubmit: (c: Cita) => void;
  onCitas: () => void;
}) {
  const [cat, setCat] = useState<Cat | "">(initialCat);
  const [prof, setProf] = useState("");
  const [fecha, setFecha] = useState("");
  const [bloque, setBloque] = useState("");
  const [tramite, setTramite] = useState("");
  const [coment, setComent] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<Cita | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const errors = {
    cat: !cat,
    prof: !prof,
    fecha: !fecha,
    bloque: !bloque,
    tramite: !tramite,
  };
  const valid = !Object.values(errors).some(Boolean);
  const field = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const err = (k: keyof typeof errors) =>
    tried && errors[k] ? <p className="mt-1 text-xs text-destructive">Campo obligatorio</p> : null;

  const reset = () => {
    setCat(""); setProf(""); setFecha(""); setBloque(""); setTramite(""); setComent(""); setTried(false); setDone(null);
  };

  const submit = () => {
    setTried(true);
    if (!valid || !cat) return;
    const c: Cita = {
      id: `RREE-${Math.floor(1100 + Math.random() * 8900)}`,
      categoria: cat,
      profesional: prof,
      fecha,
      bloque,
      tramite,
      comentarios: coment,
    };
    onSubmit(c);
    setDone(c);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border-t-4 border-success bg-card p-6 shadow-sm">
        <h1 className="font-display text-2xl font-extrabold text-primary">¡Reserva confirmada!</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tu solicitud fue registrada correctamente.</p>
        <div className="mt-4"><Comprobante c={done} /></div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={onCitas}>Ir a Mis Citas Agendadas</Button>
          <Button variant="outline" onClick={reset}>Agendar otra atención</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-lg bg-card p-6 shadow-sm">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-primary">Agendar Atención</h1>
        <p className="text-sm text-muted-foreground">Los campos con <span className="text-destructive">*</span> son obligatorios.</p>
      </div>

      <div>
        <label className="text-sm font-medium">Categoría{errors.cat && <Req />}</label>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {(["salud", "social"] as Cat[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setCat(c); setProf(""); setTramite(""); }}
              className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                cat === c ? "border-primary bg-primary text-primary-foreground" : "border-input hover:bg-secondary"
              }`}
            >
              {c === "salud" ? "Salud / Psicología" : "Asistencia Social"}
            </button>
          ))}
        </div>
        {err("cat")}
      </div>

      <div>
        <label className="text-sm font-medium">Profesional{errors.prof && <Req />}</label>
        <select className={`${field} mt-2`} value={prof} disabled={!cat} onChange={(e) => setProf(e.target.value)}>
          <option value="">{cat ? "Selecciona un profesional" : "Primero elige una categoría"}</option>
          {cat && PROFESIONALES[cat].map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {err("prof")}
      </div>

      <div>
        <label className="text-sm font-medium">Fecha{errors.fecha && <Req />}</label>
        <input type="date" min={today} className={`${field} mt-2`} value={fecha} onChange={(e) => setFecha(e.target.value)} />
        {err("fecha")}
      </div>

      <div>
        <label className="text-sm font-medium">Bloque Horario USM{errors.bloque && <Req />}</label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {BLOQUES.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBloque(b)}
              className={`rounded-md border px-2 py-2 text-sm transition-colors ${
                bloque === b ? "border-accent bg-accent text-accent-foreground font-semibold" : "border-input hover:bg-secondary"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        {err("bloque")}
      </div>

      <div>
        <label className="text-sm font-medium">Motivo de Atención — Trámite{errors.tramite && <Req />}</label>
        <select className={`${field} mt-2`} value={tramite} disabled={!cat} onChange={(e) => setTramite(e.target.value)}>
          <option value="">{cat ? "Selecciona el trámite" : "Primero elige una categoría"}</option>
          {cat && TRAMITES[cat].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {err("tramite")}
        {cat === "social" && DOCUMENTOS[tramite] && (
          <div className="mt-3 rounded-md border border-accent bg-info p-4 text-sm">
            <p className="font-semibold">Documentos obligatorios para "{tramite}":</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {DOCUMENTOS[tramite].map((d) => <li key={d}>{d}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Comentarios (opcional)</label>
        <textarea rows={3} className={`${field} mt-2`} value={coment} onChange={(e) => setComent(e.target.value)} placeholder="Describe brevemente tu situación" />
      </div>

      <Button className="w-full" size="lg" onClick={submit} disabled={tried && !valid}>
        Confirmar Reserva
      </Button>
    </div>
  );
}

function Comprobante({ c }: { c: Cita }) {
  const rows: [string, string][] = [
    ["N° de reserva", c.id],
    ["Estudiante", USER],
    ["Rol USM", ROL],
    ["Carrera", CARRERA],
    ["Categoría", CAT_LABEL[c.categoria]],
    ["Profesional", c.profesional],
    ["Fecha", fmtFecha(c.fecha)],
    ["Bloque", c.bloque],
    ["Trámite", c.tramite],
    ["Comentarios", c.comentarios || "—"],
    ["Lugar", "RREE, Edificio F, Campus San Joaquín"],
  ];
  return (
    <dl className="divide-y divide-border rounded-md border border-border text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-3 gap-2 px-3 py-2">
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="col-span-2 font-medium break-words">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function MisCitas({ citas, onAnular, onAgendar }: { citas: Cita[]; onAnular: (id: string) => void; onAgendar: () => void }) {
  const [ver, setVer] = useState<Cita | null>(null);
  const [anular, setAnular] = useState<Cita | null>(null);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-primary">Mis Citas Agendadas</h1>
      {citas.length === 0 ? (
        <div className="rounded-lg bg-card p-6 text-center shadow-sm">
          <p className="text-muted-foreground">No tienes citas activas.</p>
          <Button className="mt-4" onClick={onAgendar}>Agendar Atención</Button>
        </div>
      ) : (
        citas.map((c) => (
          <div key={c.id} className="flex flex-col gap-3 rounded-lg border-l-4 border-primary bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{CAT_LABEL[c.categoria]} · {c.id}</p>
              <p className="mt-1 font-semibold">{c.tramite}</p>
              <p className="text-sm text-muted-foreground">{c.profesional}</p>
              <p className="mt-1 text-sm font-medium text-primary">{fmtFecha(c.fecha)} · {c.bloque}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setVer(c)}>Ver Comprobante</Button>
              <Button variant="destructive" onClick={() => setAnular(c)}>Anular Solicitud de Hora</Button>
            </div>
          </div>
        ))
      )}

      <Dialog open={!!ver} onOpenChange={(o) => !o && setVer(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Comprobante oficial de reserva</DialogTitle>
            <DialogDescription>Relaciones Estudiantiles · UTFSM Campus San Joaquín</DialogDescription>
          </DialogHeader>
          {ver && <Comprobante c={ver} />}
          <DialogFooter>
            <Button onClick={() => setVer(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!anular} onOpenChange={(o) => !o && setAnular(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Anular solicitud de hora?</DialogTitle>
            <DialogDescription>
              {anular && `Se anulará la reserva ${anular.id} del ${fmtFecha(anular.fecha)} (${anular.bloque}). Esta acción no se puede deshacer.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnular(null)}>Volver</Button>
            <Button variant="destructive" onClick={() => { if (anular) onAnular(anular.id); setAnular(null); }}>
              Sí, anular
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
