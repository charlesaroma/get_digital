/* Modal built on the native <dialog>: focus is trapped, Escape closes, the page behind is inert.
   Bottom sheet on phones, centred card from 640px. */
import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

export default function Modal({ open, onClose, title, description, children }) {
  const ref = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="gd-dialog"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-h3">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-2 text-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <X aria-hidden="true" size={22} strokeWidth={1.75} />
          </button>
        </div>
        <div className="mt-6">{open && children}</div>
      </div>
    </dialog>
  );
}
