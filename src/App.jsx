import { useEffect, useState } from 'react';

// Configure a webhook endpoint (Google Apps Script web app URL) via Vite env:
// VITE_SHEET_WEBHOOK=https://script.google.com/macros/s/XXXX/exec
const SHEET_WEBHOOK_URL = import.meta.env.VITE_SHEET_WEBHOOK || '';
const SHEET_WEBHOOK_SECRET = import.meta.env.VITE_SHEET_SECRET || '';

const services = [
  {
    title: 'Brand-first web design',
    description:
      'Delightful interfaces that feel premium, move quickly, and make every first impression count.',
  },
  {
    title: 'Software that ships',
    description:
      'Fast, reliable product development for dashboards, customer portals, and internal tools.',
  },
  {
    title: 'Conversion-focused builds',
    description:
      'Pages structured to guide attention, build trust, and turn traffic into qualified leads.',
  },
];

const stats = [
  { value: '120+', label: 'brands launched' },
  { value: '98%', label: 'client satisfaction' },
  { value: '2-6w', label: 'typical delivery' },
];

const process = [
  'Discover the business model, audience, and goals.',
  'Design a playful, conversion-minded visual direction.',
  'Build a fast React experience and iterate in public.',
];

const themeStyles = {
  light: {
    shell: 'bg-slate-50 text-slate-900',
    background:
      'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#edf5ff_50%,_#eaf1fb_100%)]',
    grid: 'opacity-35 [mask-image:linear-gradient(to_bottom,white,transparent_88%)]',
    header: 'border-slate-200/80 bg-white/75',
    logo: 'bg-blue-500 text-white shadow-[0_24px_80px_rgba(59,130,246,0.22)]',
    brand: 'text-slate-900',
    subbrand: 'text-slate-500',
    muted: 'text-slate-600',
    body: 'text-slate-700',
    heading: 'text-slate-950',
    statCard: 'border-slate-200 bg-white/85',
    statText: 'text-slate-500',
    card: 'border-slate-200 bg-white/80',
    cardSoft: 'bg-white/85 border-slate-200',
    panel: 'border-slate-200 bg-white',
    panelInner: 'border-slate-200 bg-white',
    processCard: 'border-slate-200 bg-white/75',
    contactText: 'text-slate-700',
    contactHeading: 'text-slate-950',
    contactPanel:
      'border-blue-200 bg-[linear-gradient(135deg,rgba(59,130,246,0.16),rgba(14,165,233,0.1),rgba(255,255,255,0.92))]',
    buttonGhost: 'border-slate-300 bg-white/85 text-slate-900 hover:bg-slate-100',
    buttonSecondary: 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100',
    outline: 'border-slate-200 text-slate-700',
    outlineHover: 'hover:bg-slate-100',
    heroPanel: 'border-slate-200 bg-white/90 shadow-[0_30px_90px_rgba(15,23,42,0.12)]',
    infoText: 'text-slate-500',
    badge: 'bg-blue-100 text-blue-950 ring-blue-200/70',
  },
  dark: {
    shell: 'bg-slate-950 text-slate-100',
    background:
      'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(180deg,_#081120_0%,_#0b1730_48%,_#07101f_100%)]',
    grid: 'opacity-30 [mask-image:linear-gradient(to_bottom,white,transparent_88%)]',
    header: 'border-white/10 bg-white/5',
    logo: 'bg-blue-500 text-white shadow-glow',
    brand: 'text-white',
    subbrand: 'text-slate-400',
    muted: 'text-blue-100',
    body: 'text-slate-300',
    heading: 'text-white',
    statCard: 'border-white/10 bg-white/5',
    statText: 'text-slate-400',
    card: 'border-white/10 bg-white/5',
    cardSoft: 'bg-white/5 border-white/10',
    panel: 'border-white/10 bg-slate-900',
    panelInner: 'border-white/10 bg-slate-900',
    processCard: 'border-white/10 bg-slate-950/40',
    contactText: 'text-slate-200',
    contactHeading: 'text-white',
    contactPanel:
      'border-blue-400/20 bg-[linear-gradient(135deg,rgba(59,130,246,0.22),rgba(14,165,233,0.12),rgba(15,23,42,0.88))]',
    buttonGhost: 'border-blue-400/30 bg-blue-500/15 text-blue-100 hover:bg-blue-500 hover:text-white',
    buttonSecondary: 'border-white/15 bg-white/5 text-white hover:bg-white/10',
    outline: 'border-white/15 text-white',
    outlineHover: 'hover:bg-white/10',
    heroPanel: 'border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl',
    infoText: 'text-slate-400',
    badge: 'bg-blue-500/15 text-blue-100 ring-blue-400/20',
  },
};

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem('configrace-theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return 'light';
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const styles = themeStyles[theme];

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    window.localStorage.setItem('configrace-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Multi-step form state
  const initialForm = {
    projectType: 'web-design',
    scope: '',
    description: '',
    timeline: '',
    budget: '',
    name: '',
    email: '',
    phone: '',
  };
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [booking, setBooking] = useState({ name: '', email: '', phone: '', date: '', time: '', notes: '' });
  const [bookingSending, setBookingSending] = useState(false);
  const [bookingErrors, setBookingErrors] = useState({});

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const validateStep = (s) => {
    const newErrors = {};
    if (s === 1) {
      if (!form.scope || form.scope.trim().length < 5) {
        newErrors.scope = 'Please describe the scope (1–2 sentences).';
      }
    }
    if (s === 2) {
      if (!form.description || form.description.trim().length < 10) {
        newErrors.description = 'Please share the primary goals and audience.';
      }
    }
    if (s === 3) {
      if (!form.timeline || form.timeline.trim().length === 0) {
        newErrors.timeline = 'Please provide an expected timeline.';
      }
      if (!form.budget || form.budget.trim().length === 0) {
        newErrors.budget = 'Please indicate a budget range.';
      }
    }
    if (s === 4) {
      if (!form.name || form.name.trim().length === 0) {
        newErrors.name = 'Please enter your full name.';
      }
      if (!form.email || !validateEmail(form.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllForm = () => {
    // validate all steps; set step to first failing
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(5, s + 1));
    }
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const submitForm = async () => {
    // validate all fields before sending
    if (!validateAllForm()) {
      // jump to first step that has error
      if (errors.scope) setStep(1);
      else if (errors.description) setStep(2);
      else if (errors.timeline || errors.budget) setStep(3);
      else if (errors.name || errors.email) setStep(4);
      return;
    }
    setSubmitting(true);
    try {
      const payload = { type: 'project_lead', timestamp: new Date().toISOString(), secret: SHEET_WEBHOOK_SECRET, ...form };
      if (SHEET_WEBHOOK_URL) {
        await fetch(SHEET_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-webhook-secret': SHEET_WEBHOOK_SECRET },
          body: JSON.stringify(payload),
        });
      } else {
        console.log('No SHEET_WEBHOOK_URL configured — payload:', payload);
      }
      setStep(5);
    } catch (err) {
      console.error('submitForm error', err);
    } finally {
      setSubmitting(false);
    }
  };

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);

  const updateBooking = (patch) => setBooking((b) => ({ ...b, ...patch }));

  const submitBooking = async () => {
    // validate booking inputs
    const be = {};
    if (!booking.name || booking.name.trim().length === 0) be.name = 'Please enter your name.';
    if (!booking.email || !validateEmail(booking.email)) be.email = 'Please enter a valid email.';
    if (!booking.date) be.date = 'Please pick a date.';
    if (!booking.time) be.time = 'Please pick a time.';
    setBookingErrors(be);
    if (Object.keys(be).length > 0) return;

    setBookingSending(true);
    try {
      const payload = { type: 'booking', timestamp: new Date().toISOString(), secret: SHEET_WEBHOOK_SECRET, ...booking };
      if (SHEET_WEBHOOK_URL) {
        await fetch(SHEET_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-webhook-secret': SHEET_WEBHOOK_SECRET },
          body: JSON.stringify(payload),
        });
      } else {
        console.log('No SHEET_WEBHOOK_URL configured — booking payload:', payload);
      }
      // show a brief confirmation then close
      setTimeout(() => {
        setBooking({ name: '', email: '', phone: '', date: '', time: '', notes: '' });
        setBookingSending(false);
        closeBooking();
      }, 900);
    } catch (e) {
      console.error(e);
      setBookingSending(false);
    }
  };

  return (
    <main className={`min-h-screen overflow-hidden ${styles.shell}`}>
      <section className="relative isolate">
        <div className={`absolute inset-0 ${styles.background}`} />
        <div className={`absolute inset-0 bg-grid-fade bg-[size:42px_42px] ${styles.grid}`} />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-10 lg:px-12">
          <header className={`flex items-center justify-between rounded-full border px-4 py-3 backdrop-blur-xl ${styles.header}`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black ${styles.logo}`}>
                C
              </div>
              <div>
                <p className={`text-sm font-semibold tracking-[0.22em] uppercase ${styles.muted}`}>Configrace</p>
                <p className={`text-xs ${styles.subbrand}`}>Design + software agency</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className={`rounded-full border p-2 text-sm transition inline-flex items-center justify-center ${styles.outline} ${styles.outlineHover}`}
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-400">
                    <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1zm0 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a1 1 0 0 1-1 1H17a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1zM6 12a1 1 0 0 1-1 1H3.5a1 1 0 1 1 0-2H5a1 1 0 0 1 1 1zM18.364 18.364a1 1 0 0 1-1.414 0l-1.06-1.06a1 1 0 0 1 1.414-1.414l1.06 1.06a1 1 0 0 1 0 1.414zM7.05 5.05a1 1 0 0 1-1.414 0L4.576 4.01A1 1 0 0 1 5.99 2.595l1.06 1.06a1 1 0 0 1 0 1.394zM18.364 5.636a1 1 0 0 1 0 1.414l-1.06 1.06a1 1 0 0 1-1.414-1.414l1.06-1.06a1 1 0 0 1 1.414 0zM7.05 18.95a1 1 0 0 1 0-1.414l1.06-1.06a1 1 0 1 1 1.414 1.414l-1.06 1.06a1 1 0 0 1-1.414 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-slate-700">
                    <path d="M21.752 15.002A9 9 0 1 1 12.998 2.248 7 7 0 0 0 21.752 15z" />
                  </svg>
                )}
              </button>
              <button
                onClick={openModal}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${styles.buttonGhost}`}
              >
                Start a project
              </button>
            </div>
          </header>

          <div className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:py-8">
            <div className="max-w-3xl">
              <div className={`mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 px-4 py-2 text-sm ${styles.muted}`}>
                <span className={`h-2 w-2 rounded-full ${theme === 'dark' ? 'bg-sky-400' : 'bg-blue-400'}`} />
                Modern websites and software for ambitious teams
              </div>
                <h1 className={`max-w-2xl text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl ${styles.heading}`}>
                Clean, playful digital experiences that make your brand feel bigger.
              </h1>

              <p className={`mt-6 max-w-2xl text-lg leading-8 sm:text-xl ${styles.body}`}>
                We design and build conversion-focused websites, SaaS interfaces, and custom software with a bold blue aesthetic and a smooth, modern feel.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3.5 text-base font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-400"
                >
                  Book a discovery call
                </a>
                <a
                  href="#services"
                  className={`inline-flex items-center justify-center rounded-full border px-6 py-3.5 text-base font-semibold transition ${styles.buttonSecondary}`}
                >
                  View services
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-3xl border p-5 backdrop-blur-xl ${styles.statCard}`}
                  >
                    <p className={`text-3xl font-black ${styles.heading}`}>{stat.value}</p>
                    <p className={`mt-2 text-sm uppercase tracking-[0.2em] ${styles.statText}`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-sky-400/20 blur-3xl" />
              <div className="absolute -right-4 bottom-8 h-32 w-32 rounded-full bg-blue-500/30 blur-3xl" />

              <div className={`relative animate-float rounded-[2rem] border p-5 ${styles.heroPanel}`}>
                <div className={`rounded-[1.5rem] border p-5 ${styles.panelInner}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${styles.infoText}`}>Recent launch</p>
                      <h2 className={`mt-1 text-2xl font-bold ${styles.heading}`}>Studio dashboard</h2>
                    </div>
                    <div className={`rounded-2xl bg-blue-500/20 px-3 py-2 text-sm font-semibold ${theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}`}>
                      +38% leads
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className={`rounded-3xl p-4 ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-slate-50'}`}>
                      <p className={`text-xs uppercase tracking-[0.2em] ${styles.infoText}`}>Launch progress</p>
                      <div className="mt-4 h-40 rounded-2xl bg-[linear-gradient(180deg,rgba(59,130,246,0.45),rgba(14,165,233,0.15))] p-4">
                        <div className="flex h-full items-end gap-3">
                          {[52, 78, 62, 92, 84].map((height, index) => (
                            <div key={index} className={`flex-1 rounded-t-2xl ${theme === 'dark' ? 'bg-white/90' : 'bg-slate-900/90'}`} style={{ height: `${height}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`rounded-3xl border p-4 ${styles.cardSoft}`}>
                        <p className={`text-sm ${styles.infoText}`}>Experience</p>
                        <p className={`mt-1 text-lg font-semibold ${styles.heading}`}>Fast, clear, memorable</p>
                      </div>
                      <div className={`rounded-3xl border p-4 ${styles.cardSoft}`}>
                        <p className={`text-sm ${styles.infoText}`}>Primary color</p>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-12 w-12 rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/30" />
                          <div>
                            <p className={`font-semibold ${styles.heading}`}>Blue system</p>
                            <p className={`text-sm ${styles.infoText}`}>Crisp, friendly, trustworthy</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section id="services" className="grid gap-6 py-8 lg:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service.title}
                className={`group rounded-[1.75rem] border p-6 backdrop-blur-xl transition hover:-translate-y-1 ${styles.card} hover:bg-white/10`}
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold ring-1 ring-inset ${styles.badge}`}>
                  0{index + 1}
                </div>
                <h3 className={`text-2xl font-bold ${styles.heading}`}>{service.title}</h3>
                <p className={`mt-3 text-sm leading-7 ${styles.body}`}>{service.description}</p>
              </article>
            ))}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className={`rounded-[1.75rem] border p-6 backdrop-blur-xl ${styles.panel}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">Our process</p>
              <h2 className={`mt-3 text-3xl font-black ${styles.heading}`}>Simple, collaborative, and easy to trust.</h2>
              <div className="mt-6 space-y-4">
                {process.map((step, index) => (
                  <div key={step} className={`flex gap-4 rounded-2xl border p-4 ${styles.processCard}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-sm font-black text-white">
                      {index + 1}
                    </div>
                    <p className={`pt-1 ${styles.body}`}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="contact" className={`rounded-[1.75rem] border p-6 shadow-glow backdrop-blur-xl sm:p-8 ${styles.contactPanel}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Ready to launch?</p>
              <h2 className={`mt-3 max-w-xl text-3xl font-black sm:text-4xl ${styles.contactHeading}`}>
                Let’s build something clear, fast, and a little unexpected.
              </h2>
              <p className={`mt-4 max-w-xl text-base leading-7 ${styles.contactText}`}>
                Whether you need a fresh marketing site or a custom product experience, we can shape the strategy, design, and build in one team.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:hello@configrace.com"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-base font-semibold text-slate-950 transition hover:bg-blue-100"
                >
                  hello@configrace.com
                </a>
                <button
                  onClick={openBooking}
                  className={`inline-flex items-center justify-center rounded-full border px-6 py-3.5 text-base font-semibold transition ${styles.buttonSecondary}`}
                >
                  Book a session
                </button>
              </div>
            </div>
          </section>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div role="dialog" aria-modal="true" aria-label="Project form" className={`relative z-10 w-full max-w-3xl rounded-2xl p-6 ${styles.panel} shadow-2xl`}> 
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-lg font-bold ${styles.heading}`}>Start your project</h3>
                <p className={`text-sm ${styles.infoText}`}>A few quick questions to help us scope your project — takes under 2 minutes.</p>
              </div>
              <button onClick={closeModal} aria-label="Close" className="rounded-full p-2 text-sm text-slate-500 hover:bg-white/5">
                ×
              </button>
            </div>

            <div className="mt-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-200/30">
                  <div style={{ width: `${(step / 5) * 100}%` }} className="h-2 rounded-full bg-blue-500" />
                </div>
                <div className="text-sm font-medium">Step {step} / 5</div>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                {step === 1 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Project type</label>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => update({ projectType: 'web-design' })} className={`rounded-lg px-4 py-2 ${form.projectType === 'web-design' ? 'bg-blue-500 text-white' : 'bg-white/5'}`}>Web / Visual design</button>
                      <button type="button" onClick={() => update({ projectType: 'web-app' })} className={`rounded-lg px-4 py-2 ${form.projectType === 'web-app' ? 'bg-blue-500 text-white' : 'bg-white/5'}`}>Application / Web development</button>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Scope (brief)</label>
                      <input value={form.scope} onChange={(e) => update({ scope: e.target.value })} className="w-full rounded-md border px-3 py-2" placeholder="E.g. Landing page, SaaS dashboard, e-commerce — 1–2 sentences" />
                      {errors.scope && <p className="mt-1 text-sm text-red-500">{errors.scope}</p>}
                      <p className="mt-2 text-xs text-slate-400">This helps us estimate time and recommend a scope.</p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Project goals</label>
                    <textarea value={form.description} onChange={(e) => update({ description: e.target.value })} className="w-full rounded-md border p-3" rows={5} placeholder="What's the main purpose? Who's the audience? What outcome matters most?" />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    <p className="mt-2 text-xs text-slate-400">Tip: focus on outcomes (e.g. increase signups, support existing users, gather leads).</p>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Timeline</label>
                    <input value={form.timeline} onChange={(e) => update({ timeline: e.target.value })} className="w-full rounded-md border px-3 py-2" placeholder="e.g. 4-6 weeks" />
                    {errors.timeline && <p className="mt-1 text-sm text-red-500">{errors.timeline}</p>}
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Budget</label>
                      <input value={form.budget} onChange={(e) => update({ budget: e.target.value })} className="w-full rounded-md border px-3 py-2" placeholder="e.g. $5k - $20k" />
                      {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Your contact info</label>
                    <input value={form.name} onChange={(e) => update({ name: e.target.value })} className="w-full rounded-md border px-3 py-2 mb-3" placeholder="Full name" />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    <input value={form.email} onChange={(e) => update({ email: e.target.value })} className="w-full rounded-md border px-3 py-2 mb-3" placeholder="Email" type="email" />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    <input value={form.phone} onChange={(e) => update({ phone: e.target.value })} className="w-full rounded-md border px-3 py-2" placeholder="Phone (optional)" />
                    <p className="mt-2 text-xs text-slate-400">We’ll only use this to reach out about your project.</p>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Review</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Type:</strong> {form.projectType}</div>
                      <div><strong>Scope:</strong> {form.scope || '—'}</div>
                      <div><strong>Goals:</strong> {form.description || '—'}</div>
                      <div><strong>Timeline:</strong> {form.timeline || '—'}</div>
                      <div><strong>Budget:</strong> {form.budget || '—'}</div>
                      <div><strong>Name:</strong> {form.name || '—'}</div>
                      <div><strong>Email:</strong> {form.email || '—'}</div>
                      <div><strong>Phone:</strong> {form.phone || '—'}</div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    {step > 1 && <button type="button" onClick={back} className="rounded-md px-4 py-2 border">Back</button>}
                  </div>
                  <div className="flex items-center gap-3">
                    {step < 5 && (
                      <button type="button" onClick={next} className="rounded-md bg-blue-500 px-4 py-2 text-white">Continue</button>
                    )}
                    {step === 5 && (
                      <button type="button" onClick={submitForm} disabled={submitting} className="rounded-md bg-blue-600 px-4 py-2 text-white">{submitting ? 'Sending…' : 'Send request'}</button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeBooking} />
          <div role="dialog" aria-modal="true" aria-label="Book a session" className={`relative z-10 w-full max-w-md rounded-2xl p-6 ${styles.panel} shadow-2xl`}> 
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-lg font-bold ${styles.heading}`}>Book a session</h3>
                <p className={`text-sm ${styles.infoText}`}>Pick a date and time that works for you.</p>
              </div>
              <button onClick={closeBooking} aria-label="Close" className="rounded-full p-2 text-sm text-slate-500 hover:bg-white/5">×</button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input value={booking.name} onChange={(e) => updateBooking({ name: e.target.value })} className="w-full rounded-md border px-3 py-2 mb-3" />
              {bookingErrors.name && <p className="mt-1 text-sm text-red-500">{bookingErrors.name}</p>}
              <label className="block text-sm font-medium mb-1">Email</label>
              <input value={booking.email} onChange={(e) => updateBooking({ email: e.target.value })} className="w-full rounded-md border px-3 py-2 mb-3" type="email" />
              {bookingErrors.email && <p className="mt-1 text-sm text-red-500">{bookingErrors.email}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input value={booking.date} onChange={(e) => updateBooking({ date: e.target.value })} className="w-full rounded-md border px-3 py-2" type="date" />
                  {bookingErrors.date && <p className="mt-1 text-sm text-red-500">{bookingErrors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input value={booking.time} onChange={(e) => updateBooking({ time: e.target.value })} className="w-full rounded-md border px-3 py-2" type="time" />
                  {bookingErrors.time && <p className="mt-1 text-sm text-red-500">{bookingErrors.time}</p>}
                </div>
              </div>
              <label className="block text-sm font-medium mb-1 mt-3">Notes (optional)</label>
              <textarea value={booking.notes} onChange={(e) => updateBooking({ notes: e.target.value })} className="w-full rounded-md border p-2" rows={3} />

              <div className="mt-4 flex justify-end gap-3">
                <button onClick={closeBooking} className="rounded-md px-4 py-2 border">Cancel</button>
                <button onClick={submitBooking} disabled={bookingSending} className="rounded-md bg-blue-600 px-4 py-2 text-white">{bookingSending ? 'Booking…' : 'Book session'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </section>
    </main>
  );
}

export default App;