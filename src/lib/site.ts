export const siteName = "Лучший выкуп";
export const siteUrl = new URL(import.meta.env.VITE_SITE_URL?.trim() || "https://xn----dtbqehb7a0af8al4b.xn--90ais");
siteUrl.pathname = `${siteUrl.pathname.replace(/\/+$/, "")}/`;
siteUrl.search = "";
siteUrl.hash = "";
export const siteTitle = "Срочный выкуп авто в Минске и Беларуси";
export const siteDescription =
  "Оцените автомобиль онлайн и продайте его в день обращения. Выкупаем авто на ходу, с неисправностями и после ДТП в Минске и по всей Беларуси.";
export const phone = { label: "+375 (44) 745-26-79", number: "+375447452679" };
export const viberUrl = "viber://chat?number=%2B375447452679";
