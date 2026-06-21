"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

// ⬇️ REEMPLAZA esto con tu Form ID real de Formspree (los 8 caracteres
// que te dan en https://formspree.io/f/XXXXXXXX). Solo cambia esta linea.
const FORMSPREE_ID = "TU_FORM_ID_AQUI";

const INTEREST_OPTIONS = ["Comprar", "Vender", "Rentar", "Otro"];

export default function ContactForm({
  defaultInterest = "Comprar",
}: {
  defaultInterest?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm border border-stone-200 bg-white p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-50">
          <Check size={28} className="text-accent-600" />
        </div>
        <h3 className="mt-5 font-display text-2xl text-stone-900">
          ¡Mensaje enviado!
        </h3>
        <p className="mt-3 font-body text-sm text-stone-500">
          Gracias por contactar a Duparc Realty. Te responderemos a la brevedad.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-body text-sm font-semibold uppercase tracking-[0.12em] text-accent-600 hover:text-accent-700"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-stone-200 bg-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre completo" htmlFor="nombre">
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            className="form-input"
            placeholder="Tu nombre"
          />
        </Field>

        <Field label="Teléfono" htmlFor="telefono">
          <input
            id="telefono"
            name="telefono"
            type="tel"
            className="form-input"
            placeholder="+52 ..."
          />
        </Field>

        <Field label="Correo electrónico" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            className="form-input"
            placeholder="tucorreo@ejemplo.com"
          />
        </Field>

        <Field label="¿Qué te interesa?" htmlFor="interes">
          <select id="interes" name="interes" className="form-input" defaultValue={defaultInterest}>
            {INTEREST_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Mensaje" htmlFor="mensaje">
          <textarea
            id="mensaje"
            name="mensaje"
            rows={5}
            required
            className="form-input resize-none"
            placeholder="Cuéntanos qué estás buscando..."
          />
        </Field>
      </div>

      {status === "error" && (
        <p className="mt-4 font-body text-sm text-accent-700">
          Hubo un problema al enviar. Intenta de nuevo o escríbenos por WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent-600 px-6 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent-700 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar mensaje"
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.1em] text-stone-500"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
