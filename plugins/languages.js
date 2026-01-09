const defAvailableLanguages = process.env.DEFAULT_AVAILABLE_LANGUAGES;
const defLang = process.env.DEFAULT_LANGUAGE;
export default async (context,inject) => {
    var currentLanguage = context.route.fullPath.split("/")[1];
    currentLanguage = currentLanguage.length == 2 ? currentLanguage : defLang;
    var availableLanguages = defAvailableLanguages.split(",");
    context.store.commit("languages/setCurrentLanguage",currentLanguage);
    context.store.commit("languages/setAvailableLanguages",availableLanguages);
    context.store.commit("languages/setDefaultLanguage",defLang);
}