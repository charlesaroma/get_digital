/* Animated GD monogram: the G turns in, the D slides in, then the network nodes light up.
   Styles live in index.html (.gd-mark*) so the same animation also runs before React loads. */
import { MARK_PATHS } from "./logoMarkPaths";

export default function LogoMark({ className = "", title }) {
  return (
    <svg
      className={`gd-mark ${className}`.trim()}
      viewBox={MARK_PATHS.viewBox}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <g className="gd-mark__g" fill="currentColor">
        {MARK_PATHS.g.map((d) => <path key={d} d={d} />)}
      </g>
      <g className="gd-mark__d" style={{ fill: "var(--color-gd-yellow-500, #FAB30D)" }}>
        {MARK_PATHS.d.map((d) => <path key={d} d={d} />)}
      </g>
      <g fill="currentColor">
        {MARK_PATHS.n.map((d, i) => <path key={d} className="gd-mark__n" style={{ "--i": i }} d={d} />)}
      </g>
    </svg>
  );
}
