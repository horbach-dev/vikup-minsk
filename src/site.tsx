import CallbackDialog from "@/components/callback-dialog";
import LeadForm from "@/components/lead-form";
import SiteIcon from "@/components/site-icon";
import { phone, siteDescription, siteName, siteTitle, siteUrl, viberUrl } from "@/lib/site";

const imageBase = `${import.meta.env.BASE_URL}images/`;

const highlights = [
  { icon: "clock", value: "От 5 минут", text: "Предварительная оценка" },
  { icon: "wallet", value: "В день сделки", text: "Расчёт за автомобиль" },
  { icon: "pin", value: "Вся Беларусь", text: "Выезд на осмотр" },
] as const;

const steps = [
  { title: "Оставьте заявку", description: "Укажите марку, модель, год выпуска и желаемую цену. Мы перезвоним, уточним состояние и договоримся о встрече." },
  { title: "Покажите автомобиль", description: "Приедем в удобное для вас место, осмотрим машину и назовём итоговую цену." },
  { title: "Получите деньги", description: "Если цена подходит, подготовим документы и рассчитаемся за автомобиль в день сделки." },
];

const examples = [
  { title: "Volkswagen T5 Caravelle", image: `${imageBase}t5-caravelle.webp`, condition: "На ходу", price: "9 000 $" },
  { title: "Honda Pilot", image: `${imageBase}honda-pilot.webp`, condition: "С дефектами", price: "4 500 $" },
  { title: "Subaru Forester", image: `${imageBase}subaru-forester.webp`, condition: "С дефектами", price: "1 900 $" },
];

const faqs = [
  { question: "Какие автомобили вы выкупаете?", answer: "Рассматриваем машины разных марок и годов выпуска, в том числе автомобили с дефектами кузова, неисправной ходовой частью и после ДТП." },
  { question: "Обязательно ли везти машину в Минск?", answer: "Мы работаем по всей Беларуси. По телефону договоримся о времени и месте осмотра. Если автомобиль не на ходу, сообщите об этом заранее." },
  { question: "Какие документы подготовить?", answer: "Подготовьте паспорт, техпаспорт и комплект ключей. Если есть документы о техосмотре и обслуживании, возьмите их с собой. Если вы не собственник автомобиля, заранее уточните по телефону, какая доверенность потребуется." },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: siteTitle,
  description: siteDescription,
  url: siteUrl.href,
  areaServed: [{ "@type": "City", name: "Минск" }, { "@type": "Country", name: "Беларусь" }],
  provider: { "@type": "Organization", name: siteName, url: siteUrl.href, telephone: phone.number, taxID: "391084896" },
};

function Brand() {
  return (
    <a className="brand" href="#top" aria-label={siteName}>
      <svg className="brand-icon" aria-hidden="true" viewBox="0 0 64 64">
        <rect width="64" height="64" rx="14" fill="currentColor" />
        <path d="m16 42 9-20h8l-9 20zm15 0 9-20h8l-9 20z" fill="#0c1219" />
      </svg>
      <span>ЛУЧШИЙ<br />ВЫКУП<span className="brand-dot">.</span></span>
    </a>
  );
}

export default function Site() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }} />
      <a href="#main" className="skip-link">К содержанию</a>
      <header className="site-header" id="top">
        <div className="container header-inner">
          <Brand />
          <nav aria-label="Основная навигация" className="main-nav">
            <a href="#estimate">Оценка</a>
            <a href="#process">Как это работает</a>
            <a href="#examples">Примеры</a>
          </nav>
          <a href={`tel:${phone.number}`} className="header-phone">
            <SiteIcon name="phone" size={17} />
            {phone.label}
          </a>
        </div>
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-photo" aria-hidden="true">
            <img src={`${imageBase}hero.webp`} alt="" width={1536} height={1024} fetchPriority="high" />
          </div>
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow"><span className="status-dot" /> МИНСК И ВСЯ БЕЛАРУСЬ</p>
              <h1 id="hero-title">Срочный выкуп<br /> <span>авто в Минске</span></h1>
              <p className="hero-description">Оценим ваш автомобиль и выкупим его в день обращения. Рассмотрим авто на ходу, с неисправностями и после ДТП.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#estimate">Оценить автомобиль <SiteIcon name="arrow" /></a>
                <CallbackDialog className="button button-outline">Заказать звонок</CallbackDialog>
              </div>
            </div>
          </div>
        </section>

        <section className="highlights" aria-label="Условия выкупа">
          <ul className="container highlights-list">
            {highlights.map(({ icon, value, text }) => (
              <li key={value}>
                <div className="highlight-icon"><SiteIcon name={icon} /></div>
                <div><strong>{value}</strong><span>{text}</span></div>
              </li>
            ))}
          </ul>
        </section>

        <section id="estimate" className="section estimate">
          <div className="container estimate-layout">
            <div className="estimate-copy">
              <p className="eyebrow section-kicker"><span>01</span> / ОНЛАЙН-ОЦЕНКА</p>
              <h2>Сколько стоит<br className="desktop-break" /> ваш автомобиль?</h2>
              <p className="section-description">Расскажите о машине и укажите желаемую цену. Мы свяжемся с вами и обсудим предложение.</p>
              <ul className="check-list" aria-label="Какие машины мы выкупаем">
                <li><SiteIcon name="check" size={16} /> В хорошем состоянии</li>
                <li><SiteIcon name="check" size={16} /> С неисправностями</li>
                <li><SiteIcon name="check" size={16} /> После ДТП</li>
              </ul>
            </div>
            <LeadForm />
          </div>
        </section>

        <section id="process" className="section process">
          <div className="container">
            <p className="eyebrow section-kicker"><span>02</span> / КАК ЭТО РАБОТАЕТ</p>
            <h2>От заявки до сделки</h2>
            <ol className="steps">
              {steps.map(({ title, description }, index) => (
                <li key={title}>
                  <div className="step-marker"><span>0{index + 1}</span><SiteIcon name="diagonal" size={17} /></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="examples" className="section examples">
          <div className="container">
            <p className="eyebrow section-kicker"><span>03</span> / ПРИМЕРЫ</p>
            <div className="section-heading">
              <h2>Какие авто мы выкупили</h2>
              <a className="text-link" href="#estimate">Предложить свой автомобиль <SiteIcon name="diagonal" size={18} /></a>
            </div>
            <div className="example-grid">
              {examples.map(({ title, image, condition, price }) => (
                <article className="example-card" key={title}>
                  <div className="example-photo">
                    <img src={image} alt={title} loading="lazy" decoding="async" />
                    <span className="condition">{condition}</span>
                  </div>
                  <div className="example-info">
                    <h3>{title}</h3>
                    <p>{price}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section faq">
          <div className="container faq-layout">
            <div>
              <p className="eyebrow section-kicker"><span>04</span> / ВОПРОСЫ</p>
              <h2>Перед сделкой</h2>
              <p className="section-description">Если нужно уточнить детали, <a href={`tel:${phone.number}`}>позвоните нам</a>.</p>
            </div>
            <div className="faq-list">
              {faqs.map(({ question, answer }) => (
                <details key={question}>
                  <summary>{question}<span aria-hidden="true" className="plus" /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contacts">
        <div className="container">
          <div className="footer-top">
            <div>
              <Brand />
              <p>Выкуп автомобилей в Минске и по всей Беларуси</p>
            </div>
            <div className="footer-contact">
              <a className="footer-phone" href={`tel:${phone.number}`}>{phone.label}</a>
              <a className="text-link" href={viberUrl}>Написать в Viber <SiteIcon name="diagonal" size={15} /></a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>УНП 391084896</span>
            <span>Информация на сайте носит справочный характер и не является публичной офертой.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
