import i18n from "i18next";

import moment from "moment";

export const langOptions = [
    {
        code: "en-US",
        name: "English"
    },
    {
        code: "es-ES",
        name: "Español"
    },
    {
        code: "hi-IN",
        name: "Hindī"
    },
    {
        code: "id-ID",
        name: "Bahasa Indonesia"
    },
    {
        code: "pt-PT",
        name: "Português"
    },
    {
        code: "sr-CS",
        name: "Srpski"
    },
    {
        code: "fi-FI",
        name: "Suomi"
    }
];

const enUs = require("./locales/en-US.json");
const fiFI = require("./locales/fi-FI.json");
const esES = require("./locales/es-ES.json");
const hiIN = require("./locales/hi-IN.json");
const idID = require("./locales/id-ID.json");
const ptPT = require("./locales/pt-PT.json");
const srCS = require("./locales/sr-CS.json");

const resources = {
    ["en-US"]: {
        translation: enUs
    },
    ["fi-FI"]: {
        translation: fiFI
    },
    ["es-ES"]: {
        translation: esES
    },
    ["hi-IN"]: {
        translation: hiIN
    },
    ["id-ID"]: {
        translation: idID
    },
    ["pt-PT"]: {
        translation: ptPT
    },
    ["sr-CS"]: {
        translation: srCS
    }
};

i18n.init({
    resources,
    fallbackLng: "en-US",
    interpolation: {
        escapeValue: false
    },
})

i18n.on("languageChanged", function (lang) {
    moment.locale(lang);
});

export const _t = (k: string, args = {}) => {
    return i18n.t(k, args);
};
