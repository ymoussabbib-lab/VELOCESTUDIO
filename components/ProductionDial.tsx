"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { SYSTEMS, EVENTS, DialEvent, SystemDef } from '@/data/portfolioData';

interface LogEntry {
  id: string;
  time: string;
  name: string;
  color: string;
  text: string;
}

export const ProductionDial: React.FC = () => {
  const handRef = useRef<SVGGElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);
  const pingRef = useRef<SVGGElement | null>(null);

  const [log, setLog] = useState<LogEntry[]>([]);
  const lastIdxRef = useRef<number>(-1);

  // Precompute static SVG geometry
  const ticks = useMemo(() => {
    const list = [];
    for (let h = 0; h < 24; h++) {
      const major = h % 6 === 0;
      list.push({
        h,
        y1: major ? 178 : 184,
        y2: 196,
        stroke: major ? '#17150F' : '#C9C4B7',
        w: major ? 1.4 : 1,
        rot: `rotate(${h * 15} 210 210)`
      });
    }
    return list;
  }, []);

  const hourLabels = useMemo(() => {
    return [
      { h: 0, label: '00' },
      { h: 6, label: '06' },
      { h: 12, label: '12' },
      { h: 18, label: '18' }
    ].map((o) => {
      const a = (o.h / 24) * Math.PI * 2;
      const R = 212;
      return {
        label: o.label,
        x: (210 + R * Math.sin(a)).toFixed(1),
        y: (214 - R * Math.cos(a)).toFixed(1)
      };
    });
  }, []);

  const rings = useMemo(() => {
    return SYSTEMS.map((s, i) => {
      const r = 168 - i * 16;
      const C = 2 * Math.PI * r;
      const f = (s.to - s.from) / 24;
      return {
        r,
        color: s.color,
        dash: `${(f * C).toFixed(1)} ${C.toFixed(1)}`,
        rot: `rotate(${((s.from / 24) * 360 - 90)} 210 210)`
      };
    });
  }, []);

  const dots = useMemo(() => {
    return EVENTS.map((ev) => {
      const i = ev.s;
      const r = 168 - i * 16;
      const a = (ev.h / 24) * Math.PI * 2;
      return {
        cx: (210 + r * Math.sin(a)).toFixed(1),
        cy: (210 - r * Math.cos(a)).toFixed(1),
        color: SYSTEMS[i].color
      };
    });
  }, []);

  const legend = useMemo(() => {
    return SYSTEMS.map((s) => ({
      name: s.name,
      color: s.color,
      window: `${String(s.from).padStart(2, '0')}–${String(s.to === 24 ? '00' : s.to).padStart(2, '0')}`
    }));
  }, []);

  // Ping animation on SVG
  const triggerPing = (ev: DialEvent, sys: SystemDef) => {
    const g = pingRef.current;
    if (!g) return;
    const r = 168 - SYSTEMS.indexOf(sys) * 16;
    const a = (ev.h / 24) * Math.PI * 2;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', (210 + r * Math.sin(a)).toFixed(1));
    circle.setAttribute('cy', (210 - r * Math.cos(a)).toFixed(1));
    circle.setAttribute('r', '3.5');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', sys.color);
    circle.setAttribute('stroke-width', '1.6');
    circle.style.animation = 'vs-ping 900ms ease-out forwards';
    g.appendChild(circle);
    setTimeout(() => {
      if (circle.parentNode === g) {
        g.removeChild(circle);
      }
    }, 950);
  };

  // rAF loop
  useEffect(() => {
    let rafId: number;
    const DAY = 26000;
    const t0 = performance.now();

    const tick = (now: number) => {
      const prog = ((now - t0) % DAY) / DAY;
      const hour = prog * 24;

      if (handRef.current) {
        handRef.current.setAttribute('transform', `rotate(${(prog * 360).toFixed(2)} 210 210)`);
      }

      if (timeRef.current) {
        const h = Math.floor(hour);
        const m = Math.floor((hour - h) * 60);
        timeRef.current.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      }

      let idx = -1;
      for (let i = 0; i < EVENTS.length; i++) {
        if (hour >= EVENTS[i].h) idx = i;
      }

      if (idx !== lastIdxRef.current) {
        lastIdxRef.current = idx;
        if (idx >= 0) {
          const ev = EVENTS[idx];
          const sys = SYSTEMS[ev.s];
          const h = Math.floor(ev.h);
          const m = Math.round((ev.h - h) * 60);
          const newEntry: LogEntry = {
            id: `${ev.h}-${sys.key}-${Date.now()}`,
            time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
            name: sys.name,
            color: sys.color,
            text: ev.t
          };
          setLog((prev) => [newEntry, ...prev].slice(0, 7));
          triggerPing(ev, sys);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="day" className="max-w-[1440px] mx-auto px-10 pt-[72px]">
      <div className="flex items-baseline justify-between border-b border-ink pb-3.5">
        <h2 className="m-0 font-mono text-[12px] tracking-[0.12em] uppercase font-medium text-ink">
          One day in production
        </h2>
        <span className="font-mono text-[12px] text-grey-400">
          Five systems · 24 hours · replayed live
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-14 mt-11 items-start">
        {/* Left Column: Dial & Clock */}
        <div>
          <svg viewBox="-18 -18 456 456" className="w-full h-auto block select-none">
            {/* Rim circle */}
            <circle cx="210" cy="210" r="196" fill="none" stroke="#D6D1C5" strokeWidth="1" />

            {/* Hour ticks */}
            {ticks.map((k) => (
              <line
                key={k.h}
                x1="210"
                y1={k.y1}
                x2="210"
                y2={k.y2}
                stroke={k.stroke}
                strokeWidth={k.w}
                transform={k.rot}
              />
            ))}

            {/* Hour labels */}
            {hourLabels.map((h) => (
              <text
                key={h.label}
                x={h.x}
                y={h.y}
                textAnchor="middle"
                className="font-mono text-[11px] fill-grey-400 tracking-[0.06em]"
              >
                {h.label}
              </text>
            ))}

            {/* System concentric rings */}
            {rings.map((r, i) => (
              <g key={i}>
                <circle cx="210" cy="210" r={r.r} fill="none" stroke="#E3DFD4" strokeWidth="7" />
                <circle
                  cx="210"
                  cy="210"
                  r={r.r}
                  fill="none"
                  stroke={r.color}
                  strokeWidth="7"
                  strokeDasharray={r.dash}
                  transform={r.rot}
                  opacity="0.9"
                />
              </g>
            ))}

            {/* Event dots */}
            {dots.map((d, i) => (
              <circle
                key={i}
                cx={d.cx}
                cy={d.cy}
                r="3.4"
                fill={d.color}
                stroke="#F2EFE8"
                strokeWidth="1.4"
              />
            ))}

            {/* Ping Layer */}
            <g ref={pingRef} />

            {/* Clock Hand */}
            <g ref={handRef} style={{ transformOrigin: '210px 210px' }}>
              <line x1="210" y1="210" x2="210" y2="12" stroke="#17150F" strokeWidth="1.4" />
              <circle cx="210" cy="12" r="3" fill="#C7371A" />
            </g>

            {/* Hub */}
            <circle cx="210" cy="210" r="4" fill="#17150F" />
          </svg>

          {/* Clock + Legend Row */}
          <div className="flex items-baseline justify-between mt-[18px] border-t border-ink pt-3.5">
            <div>
              <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-grey-400">
                Replay clock
              </div>
              <div
                ref={timeRef}
                className="font-mono text-[42px] font-bold tracking-[-0.03em] leading-[1.05] mt-1 text-ink tabular-nums"
              >
                00:00
              </div>
            </div>

            <div className="flex flex-col gap-1.5 items-end">
              {legend.map((l, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.03em]"
                >
                  <span className="text-grey-400">{l.window}</span>
                  <span className="text-ink min-w-[96px] text-right">{l.name}</span>
                  <span className="w-5 h-[7px]" style={{ backgroundColor: l.color }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Intro & Live Event Log */}
        <div>
          <p className="m-0 mb-7 text-[21px] leading-[1.45] text-ink-soft max-w-[50ch] [text-wrap:pretty]">
            This is what we actually sell: the hours between opening and closing, held by software instead
            of by someone&apos;s memory. The dial replays a real operating day across the five systems we run
            in production.
          </p>

          <div className="border border-ink bg-ink text-on-dark shadow-none">
            <div className="flex justify-between px-[18px] py-3 border-b border-line-dark-alt font-mono text-[11px] tracking-[0.1em] uppercase text-grey-400">
              <span>Live event log</span>
              <span>tail -f production</span>
            </div>

            <div className="min-h-[366px] p-[14px_18px_18px] flex flex-col gap-3">
              {log.length === 0 ? (
                <div className="font-mono text-[12px] text-grey-400 italic py-4">
                  Synchronizing dial telemetry...
                </div>
              ) : (
                log.map((entry) => (
                  <div
                    key={entry.id}
                    className="font-mono text-[12.5px] leading-[1.5] animate-[vs-logIn_460ms_cubic-bezier(0.22,0.61,0.36,1)_both]"
                  >
                    <div className="flex items-baseline gap-3.5">
                      <span className="text-grey-400">{entry.time}</span>
                      <span style={{ color: entry.color }} className="tracking-[0.02em] font-medium">
                        {entry.name}
                      </span>
                    </div>
                    <div className="text-on-dark-log mt-0.5 pl-[52px] -indent-[52px]">
                      {entry.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
