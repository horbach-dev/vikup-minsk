import { useRef, type ReactNode } from "react";
import LeadForm from "./lead-form";

export default function CallbackDialog({ className, children }: { className: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" className={className} onClick={() => dialog.current?.showModal()}>
        {children}
      </button>
      <dialog
        ref={dialog}
        className="callback-dialog"
        aria-label="Заказать звонок"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="callback-dialog-inner">
          <button className="dialog-close" type="button" onClick={() => dialog.current?.close()} aria-label="Закрыть">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
          <h2>Заказать звонок</h2>
          <p className="dialog-intro">Оставьте свой номер, и мы вам перезвоним.</p>
          <LeadForm variant="callback" />
        </div>
      </dialog>
    </>
  );
}
