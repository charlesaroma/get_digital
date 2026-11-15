/* GetDigital AI Lab: a small, clickable preview of the free course.
   Three steps as tabs (arrow keys move between them), use case pills, and course progress. */
import { Bot, Briefcase, Check, CircleAlert, MessageSquareText, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { memo, useEffect, useRef, useState } from "react";

import { EASE } from "@/components/motion/ease";
import Badge from "@/components/ui/Badge";
import { usePageCopy } from "@/store/tanstackStore/queries/site";
import { cn } from "@/utils/cn";

const STEP_ICONS = { ask: Bot, prompt: MessageSquareText, work: Briefcase };

export default function AiLabWidget() {
  const { aiLab } = usePageCopy("home");
  const [tab, setTab] = useState(aiLab.steps[0].id);
  const tabRefs = useRef([]);

  const onTabKey = (e, index) => {
    const last = aiLab.steps.length - 1;
    const next = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setTab(aiLab.steps[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="relative rounded-[1.75rem] border border-border bg-surface/70 p-1.5 shadow-lift backdrop-blur-sm sm:p-2">
      <div className="rounded-[1.4rem] bg-surface p-4 ring-1 ring-inset ring-border/70 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gd-navy-900 text-gd-yellow-500">
              <Sparkles aria-hidden="true" size={20} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-[1.0625rem] font-semibold tracking-tight">{aiLab.title}</p>
              <p className="truncate text-small text-muted">Introduction to AI and LLMs</p>
            </div>
          </div>
          <Badge tone="primary" className="max-xs:hidden">
            {aiLab.week}
          </Badge>
        </div>

        <div role="tablist" aria-label="AI Lab steps" className="mt-5 grid grid-cols-3 gap-1 rounded-2xl bg-surface-muted p-1">
          {aiLab.steps.map((step, i) => {
            const selected = step.id === tab;
            const Icon = STEP_ICONS[step.id];
            return (
              <button
                key={step.id}
                ref={(el) => (tabRefs.current[i] = el)}
                type="button"
                role="tab"
                id={`ailab-tab-${step.id}`}
                aria-selected={selected}
                aria-controls={`ailab-panel-${step.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(step.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn(
                  "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-center transition-colors duration-200",
                  selected ? "text-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="ailab-tab-pill"
                    className="absolute inset-0 rounded-xl bg-surface shadow-card ring-1 ring-border"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5 text-[0.8125rem] font-semibold leading-tight sm:text-small">
                  <Icon aria-hidden="true" size={16} strokeWidth={1.75} className="hidden shrink-0 sm:block" />
                  <span className="sm:hidden">
                    {i + 1}. {step.short}
                  </span>
                  <span className="hidden sm:inline">
                    {i + 1}. {step.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`ailab-panel-${tab}`}
          aria-labelledby={`ailab-tab-${tab}`}
          tabIndex={0}
          className="mt-4 min-h-[17.5rem] rounded-xl sm:min-h-[15rem]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              {tab === "ask" && <AskPanel copy={aiLab.ask} />}
              {tab === "prompt" && <PromptPanel copy={aiLab.prompt} />}
              {tab === "work" && <WorkPanel items={aiLab.work} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <Progress value={aiLab.progress} label={aiLab.progressLabel} />
      </div>
    </div>
  );
}

const AskPanel = memo(function AskPanel({ copy }) {
  const reduce = useReducedMotion();
  const [typing, setTyping] = useState(!reduce);

  useEffect(() => {
    if (reduce) return undefined;
    const t = setTimeout(() => setTyping(false), 1100);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <div className="flex flex-col gap-3" aria-live="polite">
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-gd-navy-900 px-4 py-3 text-small text-white">{copy.question}</div>
      <div className="flex items-start gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-gd-navy-900 dark:text-gd-yellow-100">
          <Bot aria-hidden="true" size={16} strokeWidth={1.75} />
        </span>
        {typing ? (
          <div className="flex h-11 items-center gap-1.5 rounded-2xl rounded-tl-md bg-surface-muted px-4" aria-label="The assistant is typing">
            {[0, 1, 2].map((i) => (
              <span key={i} className="gd-typing-dot size-1.5 rounded-full bg-muted" style={{ "--i": i }} />
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="max-w-[90%] rounded-2xl rounded-tl-md bg-surface-muted px-4 py-3 text-small leading-relaxed text-foreground"
          >
            {copy.answer}
          </motion.p>
        )}
      </div>
    </div>
  );
});

function PromptPanel({ copy }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-border bg-surface-muted/60 p-4">
        <p className="flex items-center gap-1.5 text-label font-bold tracking-[0.12em] text-error uppercase">
          <CircleAlert aria-hidden="true" size={14} strokeWidth={2} /> Too vague
        </p>
        <p className="mt-1.5 font-mono text-small text-muted">{copy.weak}</p>
      </div>
      <div className="rounded-xl border border-gd-yellow-300 bg-primary-soft p-4 dark:border-gd-yellow-800">
        <p className="flex items-center gap-1.5 text-label font-bold tracking-[0.12em] text-success uppercase">
          <Check aria-hidden="true" size={14} strokeWidth={2.25} /> Clear and specific
        </p>
        <p className="mt-1.5 font-mono text-small leading-relaxed text-foreground">{copy.better}</p>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="A good prompt says">
        {copy.parts.map((p) => (
          <li key={p}>
            <Badge icon={Check}>{p}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkPanel({ items }) {
  const [active, setActive] = useState(items[0].id);
  const current = items.find((i) => i.id === active);

  return (
    <div className="flex flex-col gap-4">
      <div role="radiogroup" aria-label="Choose a task" className="flex flex-wrap gap-2">
        {items.map((item) => {
          const checked = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => setActive(item.id)}
              className={cn(
                "relative min-h-11 rounded-full px-4 text-small font-semibold transition-colors duration-200",
                checked ? "text-gd-navy-900" : "border border-border bg-surface text-muted hover:text-foreground",
              )}
            >
              {checked && (
                <motion.span
                  layoutId="ailab-usecase-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.25, ease: EASE }}
          className="rounded-xl border border-border p-4"
        >
          <p className="text-label font-bold tracking-[0.12em] text-muted uppercase">You type</p>
          <p className="mt-1.5 font-mono text-small leading-relaxed text-foreground">{current.prompt}</p>
          <p className="mt-4 text-label font-bold tracking-[0.12em] text-muted uppercase">You get</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {current.result.map((r) => (
              <li key={r} className="flex items-center gap-2 text-small text-foreground">
                <Check aria-hidden="true" size={16} strokeWidth={2} className="shrink-0 text-success" />
                {r}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Progress({ value, label }) {
  return (
    <div className="mt-5 border-t border-border pt-4">
      <div className="flex items-center justify-between text-small">
        <span id="ailab-progress-label" className="font-semibold text-foreground">
          {label}
        </span>
        <span className="font-mono tabular-nums text-muted">{value}% complete</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby="ailab-progress-label"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-surface-muted ring-1 ring-inset ring-border"
      >
        <motion.div
          className="h-full origin-left rounded-full bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value / 100 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.6 }}
        />
      </div>
    </div>
  );
}
