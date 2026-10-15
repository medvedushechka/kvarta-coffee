import CoffeeBuilder from "@/components/CoffeeBuilder";
import LeadForm from "@/components/LeadForm";
import MotionEffects from "@/components/MotionEffects";
import styles from "./page.module.css";

const coffees = [
  { name: "Эфиопия", origin: "Иргачеффе", notes: "Цветочный · бергамот", roast: "Светлая обжарка", price: "32", shade: "ethiopia", mark: "ETH" },
  { name: "Колумбия", origin: "Уила", notes: "Карамель · красное яблоко", roast: "Сбалансированный вкус", price: "29", shade: "colombia", mark: "COL" },
  { name: "Бразилия", origin: "Серрадо", notes: "Орех · шоколад", roast: "Для эспрессо", price: "26", shade: "brazil", mark: "BRA" },
  { name: "Дрип-пакеты", origin: "Ассорти", notes: "10 пакетиков", roast: "Заварите где угодно", price: "18", shade: "drip", mark: "DRIP" },
];

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  return (
    <main id="top">
      <MotionEffects />
      <div className={styles.announcement}>
        <span>ЧЕТВЕРГ — ДЕНЬ ОБЖАРКИ</span>
        <span className={styles.inlineDivider} aria-hidden="true" />
        <span>ДОСТАВКА ПО МИНСКУ ПО ПЯТНИЦАМ</span>
      </div>

      <header className={styles.header}>
        <a className={styles.logo} href="#top" aria-label="Кварта — на главную">
          кварта<span>●</span>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#coffee">Наш кофе</a>
          <a href="#story">Обжарка</a>
          <a href="#subscription">Подписка</a>
          <a href="#delivery">Доставка</a>
        </nav>
        <a className={styles.navButton} href="#request">
          Оставить заявку <Arrow />
        </a>
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroText}>
          <div className={styles.heroEyebrow}>
            <span className={styles.dot} /> НЕБОЛЬШАЯ ОБЖАРКА В МИНСКЕ <span>С 2019</span>
          </div>
          <h1 id="hero-title">
            Свежесть,<br />которую <em>пьют.</em>
          </h1>
          <p className={styles.heroLead}>
            Обжариваем маленькими партиями по четвергам, чтобы уже в пятницу ваш кофе был действительно свежим.
          </p>
          <div className={styles.heroButtons}>
            <a href="#coffee" className={styles.buttonSolid}>
              Выбрать кофе <Arrow />
            </a>
            <a href="#story" className={styles.textLink}>
              Как мы обжариваем <span>↓</span>
            </a>
          </div>
          <div className={styles.heroFacts}>
            <div>
              <b>5 кг</b>
              <span>одна партия</span>
            </div>
            <div>
              <b>1–3 дня</b>
              <span>после обжарки</span>
            </div>
            <div>
              <b>Минск</b>
              <span>локальное производство</span>
            </div>
          </div>
        </div>

        <CoffeeBuilder />
      </section>

      <div className={styles.ticker} aria-label="Преимущества">
        <span>КОФЕ ИЗ СВЕЖЕЙ ОБЖАРКИ</span>
        <i className={styles.tickerDivider} aria-hidden="true" />
        <span>ЧЕСТНЫЙ ВКУС</span>
        <i className={styles.tickerDivider} aria-hidden="true" />
        <span>МАЛЕНЬКИЕ ПАРТИИ</span>
        <i className={styles.tickerDivider} aria-hidden="true" />
        <span>ДОСТАВКА ПО МИНСКУ</span>
      </div>

      <section id="coffee" className={styles.catalog} aria-labelledby="coffee-title">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.kicker}>КОЛЛЕКЦИЯ</span>
            <h2 id="coffee-title">
              Ваш кофе.<br />
              <em>Ваш ритм.</em>
            </h2>
          </div>
          <p>От ярких цветочных нот до глубокого шоколада. Найдите зерно, к которому захочется возвращаться.</p>
        </div>
        <div className={styles.products}>
          {coffees.map((coffee) => (
            <article key={coffee.name} className={styles.product}>
              <div className={`${styles.productVisual} ${styles[coffee.shade]}`}>
                <div className={styles.productGraphic} aria-hidden="true">
                  <span>к.</span>
                  <strong>{coffee.mark}</strong>
                  <small>{coffee.name === "Дрип-пакеты" ? "10 DRIP BAGS" : "250 G · FRESH ROAST"}</small>
                </div>
                <span className={styles.productVisualCaption}>КВАРТА / МИНСК</span>
              </div>
              <div className={styles.productTitle}>
                <div>
                  <h3>{coffee.name}</h3>
                  <span>{coffee.origin}</span>
                </div>
                <strong>
                  {coffee.price} <small>BYN</small>
                </strong>
              </div>
              <p className={styles.productNotes}>
                {coffee.notes} <span>· {coffee.roast}</span>
              </p>
              <a className={styles.productAction} href="#request">
                Заказать <Arrow />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="story" className={styles.story}>
        <div className={styles.storyTop}>
          <span className={styles.kicker}>НАША ФИЛОСОФИЯ</span>
          <span>С 2019 ГОДА</span>
        </div>
        <div className={styles.storyBody}>
          <h2>
            Ничего лишнего.<br />
            <em>Только хороший кофе.</em>
          </h2>
          <div>
            <p>Мы — Аня и Дмитрий, бывшие бариста. Когда-то готовили кофе за стойкой, а теперь обжариваем его сами.</p>
            <p>Каждый четверг — небольшие партии по 5 кг. Чтобы вы почувствовали вкус свежего зерна, а не долгого хранения.</p>
            <a href="#delivery" className={styles.storyLink}>
              От обжарки до чашки <Arrow />
            </a>
          </div>
        </div>
        <div className={styles.storyMetrics}>
          <div>
            <strong>2019</strong>
            <span>начало истории</span>
          </div>
          <div>
            <strong>
              5 <small>кг</small>
            </strong>
            <span>одна партия</span>
          </div>
          <div>
            <strong>ЧТ</strong>
            <span>день обжарки</span>
          </div>
        </div>
      </section>

      <section id="subscription" className={styles.subscription}>
        <div className={styles.subscriptionLabel}>ПОДПИСКА НА КОФЕ</div>
        <div className={styles.subscriptionGrid}>
          <div className={styles.subscriptionVisual} aria-hidden="true">
            <span className={styles.bigSymbol}>к.</span>
            <span className={styles.rotatingNote}>КАЖДЫЙ МЕСЯЦ · СВЕЖИЙ КОФЕ</span>
          </div>
          <div className={styles.subscriptionText}>
            <span className={styles.kicker}>ПРОСТО ХОРОШАЯ ПРИВЫЧКА</span>
            <h2>
              Кофе<br />без <em>пауз.</em>
            </h2>
            <p>Две пачки свежего зерна по 250 г каждый месяц. Доставка по Минску — за наш счёт.</p>
            <div className={styles.subBottom}>
              <div>
                <strong>54 BYN</strong>
                <span>/ месяц</span>
              </div>
              <a href="#request" className={styles.subCta}>
                Оформить подписку <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="delivery" className={styles.delivery}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.kicker}>ВСЁ ПРОСТО</span>
            <h2>
              От ростера<br />
              <em>до двери.</em>
            </h2>
          </div>
          <p>Без складов и долгого ожидания. Зерно приезжает к вам на 1–3 день после обжарки.</p>
        </div>
        <div className={styles.timeline}>
          <article>
            <span>ЧЕТВЕРГ</span>
            <h3>Обжариваем</h3>
            <p>Партиями по 5 кг, уделяя внимание каждому зерну.</p>
          </article>
          <article>
            <span>ПЯТНИЦА</span>
            <h3>Привозим</h3>
            <p>Доставка по Минску. Бесплатно при заказе от 50 BYN.</p>
          </article>
          <article>
            <span>ВАША ЧАШКА</span>
            <h3>Завариваете</h3>
            <p>И наслаждаетесь кофе, который не успел залежаться.</p>
          </article>
        </div>
        <div className={styles.pickup}>
          <div>
            <span className={styles.kicker}>САМОВЫВОЗ</span>
            <h3>Минск, ул. Короля, 9</h3>
          </div>
          <p>
            Пн–пт 8:00–20:00
            <br />Сб–вс 10:00–18:00
          </p>
          <a href="https://www.google.com/maps/search/?api=1&query=Минск+Короля+9" target="_blank" rel="noreferrer">
            Открыть карту <Arrow />
          </a>
        </div>
      </section>

      <LeadForm />

      <footer className={styles.footer}>
        <div className={styles.footerMain}>
          <a className={styles.footerLogo} href="#top">
            кварта<span>●</span>
          </a>
          <p>Кофе, который хочется пить каждый день.</p>
          <a href="#top">Наверх ↑</a>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} КВАРТА. МИНСК</span>
          <span>СВЕЖАЯ ОБЖАРКА КАЖДЫЙ ЧЕТВЕРГ</span>
        </div>
      </footer>
    </main>
  );
}
