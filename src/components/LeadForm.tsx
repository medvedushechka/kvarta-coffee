"use client";
import { useEffect, useState, type FormEvent } from "react";
import { normalizeBelarusPhone } from "@/lib/lead";
import styles from "./LeadForm.module.css";

type Tracking = Record<string, string>;
const params = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","yclid","fbclid"];
const key = "kvarta_attribution_v1";
function getTracking(): Tracking {
  if (typeof window === "undefined") return {};
  let initial: Tracking = {};
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(key) || "{}");
    if (saved && typeof saved === "object" && !Array.isArray(saved)) {
      initial = Object.fromEntries(Object.entries(saved).filter(([k,v]) =>
        [...params, "landingPage", "referrer"].includes(k) && typeof v === "string"
      )) as Tracking;
    }
  } catch { /* storage might be disabled */ }
  const query = new URLSearchParams(window.location.search);
  const fresh: Tracking = {};
  params.forEach(k => {
    const value = query.get(k);
    if (value) fresh[k] = value.slice(0, k.startsWith("utm_") ? 200 : 500);
  });
  // First-touch campaign details are retained throughout the tab session.
  const result = {
    ...fresh, ...initial,
    landingPage: initial.landingPage || window.location.href.slice(0, 2048),
    referrer: initial.referrer || document.referrer.slice(0, 2048),
  };
  try { sessionStorage.setItem(key, JSON.stringify(result)); } catch { /* privacy mode */ }
  return result;
}

export default function LeadForm() {
  const [interest, setInterest] = useState("subscription");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  useEffect(() => { getTracking(); }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError("");
    if (name.trim().length < 2) { setError("Введите имя — не менее двух символов."); return; }
    if (!normalizeBelarusPhone(phone)) { setError("Введите белорусский номер: +375 29 123-45-67."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/lead", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ name, phone, interest, comment, attribution:{...getTracking(),submissionPage:window.location.href.slice(0,2048)} }) });
      const json: {error?:string;message?:string} = await response.json();
      if (!response.ok) throw new Error(json.error || "Ошибка отправки. Повторите попытку.");
      setDone(json.message || "Заявка получена.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить заявку.");
    } finally { setBusy(false); }
  }
  return <section id="request" className={styles.section} aria-labelledby="request-title">
    <div className={styles.container}>
      <div className={styles.intro}><span className="eyebrow eyebrowLight">НА СВЯЗИ</span><h2 id="request-title">Начнём<br/><em>с чашки?</em></h2><p>Оставьте номер. Мы перезвоним, поможем выбрать зерно и договоримся о доставке. Никаких корзин и лишних шагов.</p><span className={styles.note}>Минск · С заботой о хорошем кофе</span></div>
      <div className={styles.panel}>
        {done ? <div className={styles.success} role="status"><span aria-hidden="true" className={styles.successIcon}>✓</span><h3>До скорой встречи!</h3><p>{done}</p><button type="button" onClick={() => {setDone("");setName("");setPhone("");setComment("");}} className={styles.again}>Оставить другую заявку ↗</button></div> :
        <form onSubmit={submit} noValidate>
          <p className={styles.formTitle}>Расскажите, что вам интересно</p>
          <fieldset className={styles.choices}><legend>Тип заявки</legend><label><input type="radio" name="interest" value="subscription" checked={interest === "subscription"} onChange={e=>setInterest(e.target.value)}/><span>Подписка</span></label><label><input type="radio" name="interest" value="order" checked={interest === "order"} onChange={e=>setInterest(e.target.value)}/><span>Разовый заказ</span></label><label><input type="radio" name="interest" value="question" checked={interest === "question"} onChange={e=>setInterest(e.target.value)}/><span>Вопрос</span></label></fieldset>
          <div className={styles.two}><label>Ваше имя<input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={100} placeholder="Как к вам обращаться"/></label><label>Телефон<input type="tel" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} required maxLength={40} placeholder="+375 29 123-45-67"/></label></div>
          <label className={styles.comment}>Комментарий <span>(необязательно)</span><textarea value={comment} onChange={e=>setComment(e.target.value)} maxLength={2000} rows={3} placeholder="Например, люблю кофе с кислинкой"/></label>
          {error && <p role="alert" className={styles.error}>{error}</p>}
          <button className={styles.submit} disabled={busy} type="submit">{busy ? "Отправляем…" : "Отправить заявку"}<span aria-hidden="true">↗</span></button>
          <p className={styles.disclaimer}>Нажимая кнопку, вы соглашаетесь на обработку указанных данных для связи по вашей заявке.</p>
        </form>}
      </div>
    </div>
  </section>;
}
