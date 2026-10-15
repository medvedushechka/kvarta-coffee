import { z } from "zod";

export const kinds = ["subscription", "order", "question"] as const;

export function normalizeBelarusPhone(input: string): string | null {
  const value = input.replace(/[\s()\-]/g, "");
  if (!/^\+?\d+$/.test(value)) return null;
  const digits = value.replace(/^\+/, "");
  let local: string;
  if (digits.startsWith("375") && digits.length === 12) local = digits.slice(3);
  else if (digits.startsWith("80") && digits.length === 11) local = digits.slice(2);
  else if (digits.length === 9) local = digits;
  else return null;
  if (!/^(?:25|29|33|44)\d{7}$/.test(local)) return null;
  return `+375${local}`;
}

const shortText = z.string().trim();
const attribution = z.object({
  landingPage: z.string().max(2048).optional().default(""),
  submissionPage: z.string().max(2048).optional().default(""),
  referrer: z.string().max(2048).optional().default(""),
  utm_source: z.string().max(200).optional(), utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(), utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(), gclid: z.string().max(500).optional(),
  yclid: z.string().max(500).optional(), fbclid: z.string().max(500).optional(),
}).strict();
export const leadSchema = z.object({
  name: shortText.min(2, "Укажите имя — минимум 2 символа").max(100),
  phone: z.string().min(1).max(40).refine(v => normalizeBelarusPhone(v) !== null, "Укажите белорусский номер, например +375 29 123-45-67"),
  interest: z.enum(kinds),
  comment: shortText.max(2000).default(""),
  attribution: attribution.optional().default({landingPage:"", submissionPage:"", referrer:""}),
}).strict();
export type LeadInput = z.infer<typeof leadSchema>;
