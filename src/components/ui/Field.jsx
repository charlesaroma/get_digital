/* Form fields: label above, hint or error below, linked with aria-describedby. */
import { CircleAlert } from "lucide-react";

import { cn } from "@/utils/cn";

const control =
  "w-full rounded-md border border-border-strong bg-surface px-4 text-body text-foreground placeholder:text-subtle " +
  "transition-[border-color,box-shadow] duration-200 hover:border-foreground/40 focus:border-foreground focus:outline-none " +
  "focus-visible:ring-4 focus-visible:ring-gd-yellow-500/35 aria-[invalid=true]:border-error aria-[invalid=true]:focus-visible:ring-error/20";

export function Field({ field, label, hint, required, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={field.id} className="text-small font-semibold text-foreground">
        {label}
        {!required && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children}
      {field.error ? (
        <p id={`${field.id}-error`} className="flex items-start gap-1.5 text-small font-semibold text-error">
          <CircleAlert aria-hidden="true" size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          {field.error}
        </p>
      ) : (
        <p id={`${field.id}-hint`} className={cn("text-small text-muted", !hint && "sr-only")}>
          {hint || label}
        </p>
      )}
    </div>
  );
}

export function TextInput({ field, type = "text", className, ...rest }) {
  return <input type={type} className={cn(control, "h-12", className)} {...field.inputProps} {...rest} />;
}

export function TextArea({ field, rows = 5, className, ...rest }) {
  return <textarea rows={rows} className={cn(control, "min-h-32 resize-y py-3", className)} {...field.inputProps} {...rest} />;
}

export function Select({ field, options, placeholder = "Choose one", className, ...rest }) {
  return (
    <select className={cn(control, "h-12 appearance-none bg-[length:20px] bg-[right_0.875rem_center] bg-no-repeat pr-11 gd-select", className)} {...field.inputProps} {...rest}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function Checkbox({ field, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={field.id} className="flex min-h-11 items-start gap-3 text-small text-foreground">
        <input
          type="checkbox"
          className="mt-0.5 size-5 shrink-0 rounded border-border-strong accent-gd-navy-900"
          {...field.inputProps}
        />
        <span>{children}</span>
      </label>
      {field.error && (
        <p id={`${field.id}-error`} className="flex items-start gap-1.5 text-small font-semibold text-error">
          <CircleAlert aria-hidden="true" size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          {field.error}
        </p>
      )}
    </div>
  );
}
