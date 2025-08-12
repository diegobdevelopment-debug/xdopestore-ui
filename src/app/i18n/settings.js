export const fallbackLng = "es";
// Only EN, ES
export const languages = ["es", "en"];
export const defaultNS = "translation";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    // preload: languages,
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
