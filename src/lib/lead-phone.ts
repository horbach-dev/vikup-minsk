export function getLeadPhoneError(phone: string): string | undefined {
  if (!phone.trim()) return "Введите номер телефона";

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 12) return "Номер введен не полностью";
  if (digits.length > 12) return "Введите номер в формате +375 (XX) XXX XX XX";
  if (!/^375(?:29|33|44|17|24|25)/.test(digits)) {
    return "Ошибка в коде оператора";
  }
}
