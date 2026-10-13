/**
 * Commercial WhatsApp (Cristiano). Every "agendar demonstração" button on the site opens a chat with this number,
 * with the message already written, so the visitor only has to fill in a few words and press send.
 *
 * The message is written the way the customer would write it, and it asks for what the commercial team needs to
 * qualify the lead (who, what business, what to solve first) so the first reply can already be useful.
 */
const WHATSAPP_NUMBER = "554196081781"; // +55 41 9608-1781

const QUALIFY = [
  "• Meu nome:",
  "• Meu negócio (clínica, ótica, franquia…):",
  "• O que quero resolver primeiro (atendimento, cobrança, retorno de clientes…):",
  "",
  "Quais horários vocês têm para esta semana?",
].join("\n");

const build = (intro: string) => `${intro}\n\n${QUALIFY}`;

/** Default for every demo button. */
export const DEMO_MESSAGE = build("Olá! Vim pelo site da Its Time e quero agendar uma demonstração.");

/** Used by the button at the end of the "um dia de operação" slide: the visitor has just seen it working. */
export const DAY_MESSAGE = build(
  "Olá! Vi no site a Its Time cuidando de um dia inteiro da operação e quero ver isso funcionando no meu negócio.",
);

export const whatsappLink = (message: string = DEMO_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** Spread on an <a>: opens WhatsApp in a new tab without giving the new page access to this one. */
export const whatsappLinkProps = (message?: string) => ({
  href: whatsappLink(message),
  target: "_blank",
  rel: "noopener noreferrer",
});
