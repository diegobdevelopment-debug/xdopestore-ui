
// Language to use when detection fails
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
    // Consider "en-US","es-CO" valid if "en","es" exist in supportedLngs
    nonExplicitSupportedLngs: true,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
