'use strict';

var localizer = {
    localization : {
        en: {
            HIGHLIGHT_LABEL: "Turn number highlighting on",
            HELP: "Help"
        }/*,
        ar: {
            HIGHLIGHT_LABEL: "تشغيل تمييز الأرقام",
            HELP: "تعليمات"
        },
        bg: {
            HIGHLIGHT_LABEL: "Включване на осветяването на номерата",
            HELP: "Помощ"
        },
        br: {
            HIGHLIGHT_LABEL: "Ativar a opção de realçar número",
            HELP: "Ajuda"
        },
        ca: {
            HIGHLIGHT_LABEL: "Activa els números destacats",
            HELP: "Ajuda"
        },
        cs: {
            HIGHLIGHT_LABEL: "Zapnout zvýrazňování čísel",
            HELP: "Nápověda"
        },
        da: {
            HIGHLIGHT_LABEL: "Aktivér fremhævning af numre",
            HELP: "Hjælp"
        },
        de: {
            HIGHLIGHT_LABEL: "Hervorheben der Telefonnummern aktivieren",
            HELP: "Hilfe"
        },
        el: {
            HIGHLIGHT_LABEL: "Ενεργοποίηση επισήμανσης αριθμών",
            HELP: "Βοήθεια"
        },
        es: {
            HIGHLIGHT_LABEL: "Activar resaltado de números",
            HELP: "Ayuda"
        },
        et: {
            HIGHLIGHT_LABEL: "Lülita numbri esiletõst sisse",
            HELP: "Abi"
        },
        fi: {
            HIGHLIGHT_LABEL: "Ota numeroiden korostus käyttöön",
            HELP: "Ohje"
        },
        fr: {
            HIGHLIGHT_LABEL: "Activer la mise en surbrillance des numéros",
            HELP: "Aide"
        },
        he: {
            HIGHLIGHT_LABEL: "הפעל סימון מספרים",
            HELP: "עזרה"
        },
        hr: {
            HIGHLIGHT_LABEL: "Uključi označavanje broja",
            HELP: "Pomoć"
        },
        hu: {
            HIGHLIGHT_LABEL: "A számok kiemelésének bekapcsolása",
            HELP: "Súgó"
        },
        id: {
            HIGHLIGHT_LABEL: "Aktifkan penyorotan nomor",
            HELP: "Bantuan"
        },
        it: {
            HIGHLIGHT_LABEL: "Abilita evidenziazione numeri",
            HELP: "Aiuto"
        },
        ja: {
            HIGHLIGHT_LABEL: "番号をハイライト表示する",
            HELP: "ヘルプ"
        },
        ko: {
            HIGHLIGHT_LABEL: "숫자 강조 기능 켜기",
            HELP: "도움말"
        },
        lt: {
            HIGHLIGHT_LABEL: "Aktyvinkite numerio paryškinimo funkciją",
            HELP: "Žinynas"
        },
        lv: {
            HIGHLIGHT_LABEL: "Ieslēgt numuru izcelšanu",
            HELP: "Palīdzība"
        },
        nl: {
            HIGHLIGHT_LABEL: "Nummermarkering inschakelen",
            HELP: "Help"
        },
        no: {
            HIGHLIGHT_LABEL: "Slå på utheving av numre",
            HELP: "Hjelp"
        },
        pl: {
            HIGHLIGHT_LABEL: "Włącz wyróżnianie numerów",
            HELP: "Pomoc"
        },
        pt: {
            HIGHLIGHT_LABEL: "Ativar o realce dos números",
            HELP: "Ajuda"
        },
        ro: {
            HIGHLIGHT_LABEL: "Activare evidențiere numere",
            HELP: "Ajutor"
        },
        ru: {
            HIGHLIGHT_LABEL: "Включить выделение номеров",
            HELP: "Справка"
        },
        sk: {
            HIGHLIGHT_LABEL: "Zapnúť zvýrazňovanie čísel",
            HELP: "Pomocník"
        },
        sl: {
            HIGHLIGHT_LABEL: "Vklopi označevanje številk",
            HELP: "Pomoč"
        },
        sr: {
            HIGHLIGHT_LABEL: "Uključi isticanje brojeva",
            HELP: "Pomoć"
        },
        sv: {
            HIGHLIGHT_LABEL: "Aktivera nummermarkering",
            HELP: "Hjälp"
        },
        th: {
            HIGHLIGHT_LABEL: "เปิดการเน้นหมายเลขโทรศัพท์",
            HELP: "วิธีใช้"
        },
        tr: {
            HIGHLIGHT_LABEL: "Numara vurgulamayı etkinleştir",
            HELP: "Yardım"
        },
        uk: {
            HIGHLIGHT_LABEL: "Увімкнути підсвічування номера",
            HELP: "Довідка"
        },
        vi: {
            HIGHLIGHT_LABEL: "Bật tô sáng số",
            HELP: "Trợ giúp"
        },
        zh: {
            HIGHLIGHT_LABEL: "启用高亮显示号码功能",
            HELP: "帮助"
        },
        tw: {
            HIGHLIGHT_LABEL: "啟用號碼醒目顯示",
            HELP: "說明"
        }*/
    },

    loadLocalizedResources: function () {
        var chosenLanguage = "en"; // Default

        // Get the browser language e.g. en-US
        var browserLanguage = navigator.language || navigator.userLanguage;

        // Check if we support the browser language
        if(browserLanguage) {
            var parts = browserLanguage.split('-');
            if(parts.length > 0)
            {
                if(browserLanguage === "zh-TW") {
                    chosenLanguage = "tw";
                }
                else if(browserLanguage === "pt-BR") {
                    chosenLanguage = "br";
                }
                else if (this.localization[parts[0]] != null) {
                    chosenLanguage = parts[0];
                }
            }
        }

        var localizedPhrases = this.localization[chosenLanguage];
        if(!localizedPhrases)
        {
            chosenLanguage = "en";
            localizedPhrases = this.localization[chosenLanguage];
        }

        document.getElementById('switchHighlightLabel').textContent = localizedPhrases.HIGHLIGHT_LABEL;

        return localizedPhrases;
    }
}