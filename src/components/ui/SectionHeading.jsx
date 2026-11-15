/* Left aligned section heading: node marker, title, optional text and action.
   `eyebrow` is the marker label; `number` adds the mono section number. */
import NodeMark from "@/components/site/NodeMark";
import { cn } from "@/utils/cn";

export default function SectionHeading({ id, eyebrow, number, title, text, action, as: H = "h2", className, tone = "default" }) {
  const dark = tone === "dark";
  return (
    <div className={cn("flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <NodeMark number={number} label={eyebrow} tone={tone} />}
        <H id={id} className={cn("mt-4 text-h2", dark && "text-white")}>
          {title}
        </H>
        {text && <p className={cn("mt-4 max-w-[60ch] text-body-lg", dark ? "text-gd-navy-200" : "text-muted")}>{text}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
