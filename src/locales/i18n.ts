import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";
// 작성된 마크업을 불러옵니다. import 를 간소화하기 위해 *를 사용했습니다.
import * as en from "./en";
import * as ko from "./ko";
import * as jp from "./jp";
import * as ch1 from "./ch-1";
import * as ch2 from "./ch-2";
import * as vt from "./vt";

const resources: Resource = {
  "en-US": {
    ...en // 비구조화 할당을 통해 간소화했습니다.
  },
  "ko-KR": {
    ...ko
  },
  "jp-JP" : {...jp},
  "ch-CH-1": {...ch1},
  "ch-CH-2" :{...ch2},
  "vt-VT": {...vt}
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng:  localStorage.getItem("lang") || "en-US", // 초기 설정 언어
  fallbackLng: "en-US",
  debug: true,
  keySeparator: false,
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});

export default i18n;
