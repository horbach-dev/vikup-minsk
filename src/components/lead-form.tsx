import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { marks, modelsForMark, years, type CarOption } from "../lib/car-catalog";
import { getLeadPhoneError } from "../lib/lead-phone";
import { phone } from "../lib/site";
import styles from "./lead-form.module.css";

const emptyDraft = { mark: "", model: "", year: "", price: "100", name: "", phone: "" };
const draftKey = "firstForm";
const leadEndpoint = import.meta.env.VITE_LEAD_ENDPOINT?.trim();

type Draft = typeof emptyDraft;
type Field = keyof Draft;
type FieldErrors = Partial<Record<Field, string>>;

type SearchFieldProps = {
  id: string;
  name: Field;
  label: string;
  placeholder: string;
  options: readonly CarOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

function SearchField({
  id,
  name,
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  disabled = false,
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const text = query?.trim().toLowerCase() ?? "";
  const visible = text
    ? options.filter((option) => option.label.toLowerCase().includes(text))
    : options;
  const selected = options.find((option) => option.value === value);
  const listId = `${id}-options`;
  const expanded = open && !disabled;

  useEffect(() => {
    if (activeIndex < 0) return;

    const list = listRef.current;
    const option = list?.children[activeIndex] as HTMLElement | undefined;
    if (!list || !option) return;

    if (option.offsetTop < list.scrollTop) {
      list.scrollTop = option.offsetTop;
    } else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }, [activeIndex]);

  function close() {
    setOpen(false);
    setQuery(null);
    setActiveIndex(-1);
  }

  function choose(option: CarOption) {
    onChange(option.value);
    close();
  }

  function search(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    setQuery(next);
    setOpen(true);
    setActiveIndex(-1);

    const lower = next.trim().toLowerCase();
    const exact = options.find((option) =>
      option.label.toLowerCase() === lower || option.value.toLowerCase() === lower
    );
    if (exact || !next) onChange(exact?.value ?? "");
  }

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!expanded) setOpen(true);
      const last = visible.length - 1;
      if (last < 0) return;
      const next = event.key === "ArrowDown"
        ? (activeIndex + 1) % visible.length
        : activeIndex <= 0 ? last : activeIndex - 1;
      setActiveIndex(next);
    } else if (event.key === "Escape" && expanded) {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "Enter" && expanded) {
      const option = visible[activeIndex] ?? (text ? visible[0] : undefined);
      if (option) {
        event.preventDefault();
        choose(option);
      }
    }
  }

  function handleAction() {
    if (value) {
      onChange("");
      setQuery("");
      setActiveIndex(-1);
      setOpen(true);
      inputRef.current?.focus();
    } else if (expanded) {
      close();
    } else {
      setOpen(true);
      inputRef.current?.focus();
    }
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.controlWrap}>
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-required="true"
          aria-expanded={expanded}
          aria-controls={expanded ? listId : undefined}
          aria-activedescendant={expanded && visible[activeIndex] ? `${listId}-${activeIndex}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          value={query ?? selected?.label ?? ""}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.searchInput}
          onChange={search}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onBlur={close}
          onKeyDown={keyDown}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={value ? `Очистить поле «${label}»` : `Список «${label}»`}
          disabled={disabled}
          className={styles.searchAction}
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleAction}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path
              d={value ? "m4.5 4.5 7 7m0-7-7 7" : "m4 6 4 4 4-4"}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {expanded && (
          <div className={styles.dropdown} onMouseDown={(event) => event.preventDefault()}>
            <ul ref={listRef} id={listId} role="listbox" aria-label={label} className={styles.optionList}>
              {visible.map((option, index) => (
                <li
                  id={`${listId}-${index}`}
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  data-active={index === activeIndex || undefined}
                  className={styles.option}
                  onClick={() => choose(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
            {visible.length === 0 && <p className={styles.noOptions} role="status">Не найдено</p>}
          </div>
        )}
      </div>
      <FieldError id={id} error={error} />
    </div>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? <p id={`${id}-error`} className={styles.fieldError}>{error}</p> : null;
}

function formatPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (value.trimStart().startsWith("+375") || (digits.length >= 12 && digits.startsWith("375"))) {
    digits = digits.slice(3);
  } else if (digits.length >= 11 && digits.startsWith("80")) {
    digits = digits.slice(2);
  }

  if (!digits) return "";
  const code = digits.slice(0, 2);
  if (digits.length <= 2) return `+375 (${code}`;
  const number = [digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)]
    .filter(Boolean).join(" ");
  return `+375 (${code}) ${number}`;
}

function readDraft() {
  try {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return emptyDraft;
    const saved = JSON.parse(raw) as (Partial<Omit<Draft, "price">> & { price?: string | number | null }) | null;
    if (!saved || typeof saved !== "object") return emptyDraft;
    const mark = typeof saved.mark === "string" && modelsForMark(saved.mark).length ? saved.mark : "";
    const price = saved.price === undefined ? emptyDraft.price : String(saved.price ?? "");
    return {
      mark,
      model: modelsForMark(mark).find((option) => option.value === saved.model)?.value ?? "",
      year: years.find((option) => option.value === saved.year)?.value ?? "",
      price,
      name: typeof saved.name === "string" ? saved.name.slice(0, 120) : "",
      phone: typeof saved.phone === "string" ? formatPhone(saved.phone) : "",
    };
  } catch {
    return emptyDraft;
  }
}

function validate(draft: Draft, isCallback: boolean) {
  const errors: FieldErrors = {};

  if (!isCallback) {
    if (!draft.mark) errors.mark = "Введите марку";
    if (!draft.model) errors.model = "Введите модель";
    if (!draft.year) errors.year = "Введите год";
    if (!draft.price) {
      errors.price = "Введите желаемую цену";
    } else if (!Number.isFinite(Number(draft.price)) || Number(draft.price) < 100) {
      errors.price = "Укажите цену от $100";
    }
  }

  const phoneError = getLeadPhoneError(draft.phone);
  if (phoneError) errors.phone = phoneError;
  return errors;
}

export default function LeadForm({ variant = "main" }: { variant?: "main" | "callback" }) {
  const prefix = useId();
  const busyRef = useRef(false);
  const completionRef = useRef<HTMLDivElement>(null);
  const isCallback = variant === "callback";
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [contactsOpened, setContactsOpened] = useState(false);
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (isCallback) return;
    const saved = readDraft();
    setDraft(saved);
    setContactsOpened(Boolean(saved.mark && saved.model && saved.year));
  }, [isCallback]);

  useEffect(() => {
    if (complete) completionRef.current?.focus();
  }, [complete]);

  const hasVehicle = Boolean(draft.mark && draft.model && draft.year);
  const showContacts = isCallback || contactsOpened || hasVehicle;

  function update(field: Field, value: string) {
    if (draft[field] === value) return;
    const next = { ...draft, [field]: value };
    if (field === "mark") next.model = "";
    if (next.mark && next.model && next.year) setContactsOpened(true);
    setDraft(next);
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
      ...(field === "mark" ? { model: undefined } : {}),
    }));
    setServerError("");
    if (!isCallback) {
      try {
        localStorage.setItem(draftKey, JSON.stringify(next));
      } catch {
        // The form still works with browser storage disabled.
      }
    }
  }

  function updatePhone(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const original = input.value;
    const selectionEnd = input.selectionEnd ?? original.length;
    let digitsAfterCaret = original.slice(selectionEnd).replace(/\D/g, "").length;
    const phone = formatPhone(original);

    if (original !== phone) {
      let caret = phone.length;
      while (digitsAfterCaret > 0 && caret > 0) {
        caret -= 1;
        if (/\d/.test(phone[caret])) digitsAfterCaret -= 1;
      }
      if (phone === draft.phone && (event.nativeEvent as InputEvent).inputType === "deleteContentBackward") {
        while (caret > 4 && /\D/.test(phone[caret - 1])) caret -= 1;
      }
      input.value = phone;
      input.setSelectionRange(caret, caret);
    }

    update("phone", phone);
  }

  function focusField(field: Field) {
    document.getElementById(`${prefix}-${field}`)?.focus();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;

    const nextErrors = validate(draft, isCallback);
    setErrors(nextErrors);
    setServerError("");
    const firstError = Object.keys(nextErrors)[0] as Field | undefined;
    if (firstError) {
      focusField(firstError);
      return;
    }

    if (!leadEndpoint) {
      setServerError(`Онлайн-заявки пока недоступны. Позвоните нам по номеру ${phone.label}.`);
      return;
    }

    busyRef.current = true;
    setPending(true);
    const contact = { name: draft.name.trim(), phone: draft.phone };
    const body = isCallback ? contact : { ...draft, ...contact, price: Number(draft.price) };

    try {
      const response = await fetch(leadEndpoint, {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result: { ok?: boolean; error?: string; field?: Field } = await response.json();
      if (!response.ok || result.ok !== true) {
        const message = result.error || "Не удалось отправить заявку. Попробуйте ещё раз.";
        if (result.field) {
          setErrors({ [result.field]: message });
        } else {
          setServerError(message);
        }
        return;
      }

      setComplete(true);
      if (!isCallback) {
        try {
          localStorage.removeItem(draftKey);
        } catch {
          // The application was already sent.
        }
      }
    } catch {
      setServerError("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setPending(false);
      busyRef.current = false;
    }
  }

  const fieldProps = (field: Field) => ({
    id: `${prefix}-${field}`,
    name: field,
    "aria-invalid": errors[field] ? true as const : undefined,
    "aria-describedby": errors[field] ? `${prefix}-${field}-error` : undefined,
  });

  const adjustPrice = (direction: 1 | -1) => {
    const price = Number(draft.price) || 0;
    update("price", String(Math.max(100, price + direction * 100)));
  };

  return (
    <div className={isCallback ? styles.callback : styles.card}>
      {complete ? (
        <div className={styles.success} ref={completionRef} tabIndex={-1}>
          <span className={styles.checkmark} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="m5 12 5 5L19 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2>{isCallback ? "Ваши контакты отправлены" : "Заявка отправлена"}</h2>
          <p>Мы перезвоним вам в течение 10 минут.</p>
        </div>
      ) : (
        <>
          {!isCallback && (
            <div className={styles.header}>
              <span className={styles.timing}>
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                  <circle cx="8" cy="8" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.35" />
                  <path d="M8 5v3l2 1.2" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
                </svg>
                5 минут на оценку
              </span>
              <h2>Оценка стоимости авто</h2>
              <p>Укажите данные автомобиля, чтобы мы быстрее сделали предложение.</p>
            </div>
          )}
          <form onSubmit={submit} noValidate aria-busy={pending}>
            <fieldset className={styles.formFields} disabled={pending} aria-label="Данные для заявки">
              <div className={styles.grid}>
                {!isCallback && (
                  <>
                    <SearchField
                      id={`${prefix}-mark`}
                      name="mark"
                      label="Марка"
                      placeholder="Введите марку авто"
                      options={marks}
                      value={draft.mark}
                      onChange={(value) => update("mark", value)}
                      error={errors.mark}
                    />
                    <SearchField
                      key={draft.mark}
                      id={`${prefix}-model`}
                      name="model"
                      label="Модель"
                      placeholder="Укажите модель"
                      options={modelsForMark(draft.mark)}
                      value={draft.model}
                      onChange={(value) => update("model", value)}
                      error={errors.model}
                      disabled={!draft.mark}
                    />
                    <SearchField
                      id={`${prefix}-year`}
                      name="year"
                      label="Год"
                      placeholder="Введите год авто"
                      options={years}
                      value={draft.year}
                      onChange={(value) => update("year", value)}
                      error={errors.year}
                    />
                    <div className={styles.field}>
                      <label htmlFor={`${prefix}-price`}>Желаемая цена</label>
                      <div className={styles.controlWrap}>
                        <span className={styles.currency} aria-hidden="true">$</span>
                        <input
                          {...fieldProps("price")}
                          type="number"
                          min={100}
                          step="any"
                          inputMode="decimal"
                          className={styles.priceInput}
                          aria-label="Желаемая цена в долларах США"
                          required
                          value={draft.price}
                          onChange={(event) => update("price", event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                              event.preventDefault();
                              adjustPrice(event.key === "ArrowUp" ? 1 : -1);
                            }
                          }}
                        />
                        <div className={styles.priceControls}>
                          <button type="button" aria-label="Увеличить цену на 100 долларов" onClick={() => adjustPrice(1)}>
                            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                              <path d="m3 7 3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            aria-label="Уменьшить цену на 100 долларов"
                            disabled={Number(draft.price) <= 100}
                            onClick={() => adjustPrice(-1)}
                          >
                            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                              <path d="m3 5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <FieldError id={`${prefix}-price`} error={errors.price} />
                    </div>
                  </>
                )}
                {showContacts && (
                  <>
                    <div className={styles.field}>
                      <label htmlFor={`${prefix}-name`}>Ваше имя</label>
                      <input
                        {...fieldProps("name")}
                        autoComplete="name"
                        placeholder="Введите имя"
                        maxLength={120}
                        value={draft.name}
                        onChange={(event) => update("name", event.target.value)}
                      />
                      <FieldError id={`${prefix}-name`} error={errors.name} />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor={`${prefix}-phone`}>Телефон</label>
                      <input
                        {...fieldProps("phone")}
                        type="tel"
                        autoComplete="tel"
                        placeholder="+375 (29) 123 45 67"
                        required
                        value={draft.phone}
                        onChange={updatePhone}
                      />
                      <FieldError id={`${prefix}-phone`} error={errors.phone} />
                    </div>
                  </>
                )}
              </div>
              {serverError && <p className={styles.serverError} role="alert">{serverError}</p>}
              <button type="submit" className={styles.submit}>
                {pending ? "Отправляем заявку…" : "Отправить заявку"}
                {!pending && (
                  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
                    <path d="M4 10h11m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </fieldset>
          </form>
        </>
      )}
    </div>
  );
}
