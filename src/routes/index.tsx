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
import usmEscudo from "@/assets/usm-escudo.png";

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

type Cat = "salud" | "psicologia" | "social";
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

type Beneficio = {
  id: string;
  titulo: string;
  url: string;
  imagen: string;
};

const USER = "Adolfo Epstein";
const ROL = "202273514-K";
const CARRERA = "Ing. Civil Informática";

const PROFESIONALES: Record<Cat, string[]> = {
  salud: [
    "Dra. Paula Fuentes - Médico General, Oficina F-150",
    "Dr. Ignacio Rojas - Dentista, Oficina F-151",
  ],
  psicologia: [
    "Ps. Roberto Méndez - Psicólogo, Oficina F-154",
  ],
  social: [
    "Sra. Carmen Cárdenas Mundaca - Asistente Social, Oficina F-152, carmen.cardenas@usm.cl",
    "Sra. Valeria Soto - Asistente Social, Oficina F-153, valeria.soto@usm.cl",
  ],
};

const TRAMITES: Record<Cat, string[]> = {
  salud: ["Consulta médica general", "Atención dental", "Certificado médico"],
  psicologia: ["Consulta psicológica"],
  social: [
    "Beca de Alimentación JUNAEB",
    "Beca de Alimentación USM",
    "Beca Residencia USM",
    "Becas AEXA",
    "Becas JUNAEB (PRI, CHAITEN, IT, INDIGENA)",
    "Beneficios MINEDUC",
    "Beneficios USM - Solicitudes y/o Renuncias",
    "Cambio de Carrera y/o Campus/Sede",
    "Cambio de Universidad",
    "Cómo congelar Beneficios MINEDUC",
    "Cómo Efectuar Supensión Temporal de Estudios",
    "Congelar con Gratuidad",
    "Consulta general de Gratuidad",
    "Crédito con Aval del Estado",
    "Declaración de Antecedentes Socioeconómicos",
    "Económico pago de Arancel y/o Matrícula",
    "Enfermedades y gastos derivados",
    "Familiares y/o personales",
    "Firma del Pagaré FSCU",
    "Pérdida de Beneficios MINEDUC estudiante de curso superior",
    "Postulación Becas MINEDUC",
    "Reingreso a la Universidad",
    "Renovación de Beneficios",
    "Suspensión de Estudios y/o Retiro definitivo",
    "TNE",
  ],
};

const DOCUMENTOS: Record<string, string[]> = {
  "Congelar con Gratuidad": [
    "Formulario de solicitud de congelamiento firmado",
    "Certificado de alumno regular vigente",
    "Documento que respalde la causal (médico, laboral o familiar)",
    "Cédula de identidad",
  ],
  "Cómo congelar Beneficios MINEDUC": [
    "Concentración de notas actualizada",
    "Carta explicativa de la situación académica",
    "Documentos de respaldo de causal (certificados médicos, sociales)",
    "Cédula de identidad",
  ],
  "Pérdida de Beneficios MINEDUC estudiante de curso superior": [
    "Concentración de notas actualizada",
    "Carta explicativa de la situación académica",
    "Documentos de respaldo de causal (certificados médicos, sociales)",
    "Cédula de identidad",
  ],
};

const BENEFICIOS_ITEMS: Beneficio[] = [
  {
    id: "b-1",
    titulo: "Beneficios USM",
    url: "https://rree.usm.cl/atencion-social-beneficios/beneficios-usm/",
    imagen: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "b-2",
    titulo: "Tarjeta Nacional Estudiantil (TNE)",
    url: "https://rree.usm.cl/atencion-social-beneficios/tarjeta-nacional-estudiantil-tne/",
    imagen: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "b-3",
    titulo: "Becas Junaeb",
    url: "https://rree.usm.cl/atencion-social-beneficios/becas-junaeb/",
    imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "b-4",
    titulo: "Gratuidad",
    url: "https://rree.usm.cl/atencion-social-beneficios/gratuidad/",
    imagen: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "b-5",
    titulo: "Becas y Créditos Mineduc",
    url: "https://rree.usm.cl/atencion-social-beneficios/becas-y-creditos-mineduc/",
    imagen: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "b-6",
    titulo: "Fondo Solidario y CAE",
    url: "https://rree.usm.cl/atencion-social-beneficios/fondo-solidario-y-cae/",
    imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  },
];

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
  salud: "Salud Médica y Dental",
  psicologia: "Apoyo Psicológico",
  social: "Beneficios y Asistencia Social",
};

const INICIALES: Cita[] = [
  {
    id: "RREE-1042",
    categoria: "psicologia",
    profesional: PROFESIONALES.psicologia[0]!,
    fecha: "2026-11-05",
    bloque: "09:00 - 09:20",
    tramite: "Consulta psicológica",
    comentarios: "Seguimiento de sesión anterior.",
  },
  {
    id: "RREE-1057",
    categoria: "social",
    profesional: PROFESIONALES.social[0]!,
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
          <div className="flex items-center gap-3">
            <img 
              src={usmEscudo} 
              alt="Escudo Universidad Técnica Federico Santa María" 
              className="h-12 w-auto rounded-sm bg-white p-1" 
            />
            <div>
              <p className="font-display text-xl font-extrabold tracking-tight">
                RREE <span className="text-accent">USM</span>
              </p>
              <p className="text-xs opacity-80">Relaciones Estudiantiles · Campus San Joaquín</p>
            </div>
          </div>

          <p className="text-xs opacity-90 md:text-right">
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
        {view === "inicio" && <Inicio onAgendar={goAgendar} />}
        
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

function Inicio({ onAgendar }: { onAgendar: (c: Cat) => void }) {
  const cards: { cat: Cat; desc: string; items: string }[] = [
    {
      cat: "salud",
      desc: "Atención de profesionales de la salud para tu bienestar físico.",
      items: "Médico · Dental",
    },
    {
      cat: "psicologia",
      desc: "Apoyo profesional para tu bienestar emocional y salud mental.",
      items: "Psicología",
    },
    {
      cat: "social",
      desc: "Orientación con asistentes sociales sobre beneficios estudiantiles y trámites.",
      items: "Gratuidad · Becas MINEDUC · Congelamiento",
    },
  ];

  const [beneficioIdx, setBeneficioIdx] = useState(0);
  const itemsVisibles = 4;
  const maxIdx = Math.max(0, BENEFICIOS_ITEMS.length - itemsVisibles);

  const prevBeneficio = () => setBeneficioIdx((p) => Math.max(0, p - 1));
  const nextBeneficio = () => setBeneficioIdx((p) => Math.min(maxIdx, p + 1));

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-primary">Hola, Adolfo</h1>
        <p className="mt-1 text-muted-foreground">¿Qué tipo de atención necesitas hoy?</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.cat} className="flex flex-col rounded-lg border-t-4 border-accent bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl font-semibold text-primary">{CAT_LABEL[c.cat]}</h2>
            <p className="mt-1 text-sm font-medium text-secondary-foreground">{c.items}</p>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{c.desc}</p>
            <Button className="mt-5 self-start" onClick={() => onAgendar(c.cat)}>
              Agendar
            </Button>
          </div>
        ))}
      </div>

      {/* Sección Beneficios Estudiantiles */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold tracking-tight text-primary">
          Beneficios Estudiantiles
        </h2>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex gap-4 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${beneficioIdx * (100 / itemsVisibles)}%)` }}
          >
            {BENEFICIOS_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-40 min-w-[calc(100%/1.2-12px)] sm:min-w-[calc(100%/2-12px)] md:min-w-[calc(100%/4-12px)] flex-col justify-end overflow-hidden rounded-xl bg-slate-900 p-4 transition-transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <span className="relative z-10 text-center font-display text-sm font-semibold text-white group-hover:text-amber-300">
                  {item.titulo}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Paginador inferior */}
        <div className="flex items-center justify-end gap-2 text-xs font-semibold text-muted-foreground pt-1">
          <button
            type="button"
            onClick={prevBeneficio}
            disabled={beneficioIdx === 0}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white transition-opacity hover:bg-amber-600 disabled:opacity-30"
            aria-label="Anterior"
          >
            ←
          </button>
          <span>
            {Math.min(beneficioIdx + itemsVisibles, BENEFICIOS_ITEMS.length)}/{BENEFICIOS_ITEMS.length}
          </span>
          <button
            type="button"
            onClick={nextBeneficio}
            disabled={beneficioIdx >= maxIdx}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white transition-opacity hover:bg-amber-600 disabled:opacity-30"
            aria-label="Siguiente"
          >
            →
          </button>
        </div>
      </section>
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
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {(["salud", "psicologia", "social"] as Cat[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setCat(c); setProf(""); setTramite(""); }}
              className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                cat === c ? "border-primary bg-primary text-primary-foreground" : "border-input hover:bg-secondary"
              }`}
            >
              {CAT_LABEL[c]}
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
        <label className="text-sm font-medium">Motivo de Atención{errors.tramite && <Req />}</label>
        <select className={`${field} mt-2`} value={tramite} disabled={!cat} onChange={(e) => setTramite(e.target.value)}>
          <option value="">{cat ? "Selecciona un servicio" : "Primero elige una categoría"}</option>
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