export default async function loadTranslations(locale: string) {
    const translations = await import(`@/lib/i18n/lang/${locale}.json`);
    return translations.default;
}