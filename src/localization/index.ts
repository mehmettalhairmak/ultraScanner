import RNLanguageDetector from "@os-team/i18next-react-native-language-detector";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import tr from "./tr.json";
import fr from "./fr.json";
import es from "./es.json";
import de from "./de.json";
import zh from "./zh.json";

i18next
  .use(RNLanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources: { en, tr, fr, es, de, zh },
    react: { useSuspense: false },
  });

export default i18next;