import { Mail, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/contact-form";

const PHONE = "+529381502013";
const PHONE_DIGITS = "529381502013";
const EMAIL = "asistente@duparcrealty.com";

export const metadata = {
  title: "Contacto | Duparc Realty",
};

export default function ContactoPage() {
  return (
    <main className="bg-stone-50 px-6 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <span className="mb-4 inline-flex items-center gap-3 font-body text-xs font-semibold uppercase tracking-[0.25em] text-accent-600">
            <span className="h-px w-7 bg-accent-300" />
            Estamos para servirte
          </span>
          <h1 className="font-display text-4xl text-stone-900 sm:text-5xl">
            Contacto
          </h1>
          <p className="mt-4 font-body text-base leading-relaxed text-stone-600">
            Cuéntanos qué buscas y un asesor de Duparc Realty te atenderá
            personalmente. También puedes escribirnos directo por WhatsApp.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Formulario */}
          <ContactForm />

          {/* Contacto directo */}
          <aside className="flex flex-col gap-4">
            <a
              href={`https://wa.me/${PHONE_DIGITS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-sm border border-stone-200 bg-white p-6 transition-colors hover:border-accent-600"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="font-display text-lg text-stone-900">WhatsApp</p>
                <p className="mt-1 font-body text-sm text-stone-500">
                  Respuesta rápida. Escríbenos ahora.
                </p>
                <p className="mt-2 font-body text-sm font-semibold text-accent-600">
                  {PHONE}
                </p>
              </div>
            </a>

            <a
              href={`tel:${PHONE}`}
              className="group flex items-start gap-4 rounded-sm border border-stone-200 bg-white p-6 transition-colors hover:border-accent-600"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                <Phone size={20} />
              </div>
              <div>
                <p className="font-display text-lg text-stone-900">Teléfono</p>
                <p className="mt-1 font-body text-sm text-stone-500">
                  Llámanos en horario de oficina.
                </p>
                <p className="mt-2 font-body text-sm font-semibold text-accent-600">
                  {PHONE}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="group flex items-start gap-4 rounded-sm border border-stone-200 bg-white p-6 transition-colors hover:border-accent-600"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-display text-lg text-stone-900">Correo</p>
                <p className="mt-1 font-body text-sm text-stone-500">
                  Escríbenos cuando gustes.
                </p>
                <p className="mt-2 break-all font-body text-sm font-semibold text-accent-600">
                  {EMAIL}
                </p>
              </div>
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}
