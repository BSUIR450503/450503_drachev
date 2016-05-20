'use strict';

var localization = {
    en: {
        CALL: 'Call',
        CALL_VIA_SKYPE: 'Call using Skype',
        SEND_SMS: 'Send SMS',
        ADD_TO_SKYPE: 'Add to Skype',
        CALL_WITH_SKYPE_CREDITS: 'You\'ll need Skype Credit',
        FREE_VIA_SKYPE: 'Free via Skype',
        NO_CREDIT_REQUIRED: 'No Skype credit required',
        FREE: 'FREE',
        PUSH_TO_MOBILE: 'Call from mobile',
        LAUNCH_SKYPE: 'Launch Skype',
        SHARE_ON_SKYPE: 'Share on Skype',
        SHARE_ON_SKYPE_WINDOW_TITLE: 'Share on Skype'
    }/*,
    ar: {
        CALL: "اتصال",
        CALL_VIA_SKYPE: "الاتصال باستخدام Skype",
        SEND_SMS: "إرسال رسالة SMS",
        ADD_TO_SKYPE: "إضافة إلى Skype",
        CALL_WITH_SKYPE_CREDITS: "ستحتاج إلى رصيد Skype",
        FREE_VIA_SKYPE: "مجاناً عبر Skype",
        NO_CREDIT_REQUIRED: "رصيد Skype غير مطلوب",
        FREE: "مجاني",
        HOW_TO_USE: "التعرف على المزيد"
    },
    bg: {
        CALL: "Обаждане",
        CALL_VIA_SKYPE: "Обаждайте се със Skype",
        SEND_SMS: "Изпращане на SMS",
        ADD_TO_SKYPE: "Добавяне в Skype",
        CALL_WITH_SKYPE_CREDITS: "Ще ви е нужен кредит за Skype",
        FREE_VIA_SKYPE: "Безплатно по Skype",
        NO_CREDIT_REQUIRED: "Не се изисква кредит за Skype",
        FREE: "БЕЗПЛАТНО",
        HOW_TO_USE: "Научете повече"
    },
    br: {
        CALL: "Iniciar chamada",
        CALL_VIA_SKYPE: "Chamar usando o Skype",
        SEND_SMS: "Enviar SMS",
        ADD_TO_SKYPE: "Adicionar ao Skype",
        CALL_WITH_SKYPE_CREDITS: "Você vai precisar de Crédito Skype",
        FREE_VIA_SKYPE: "Grátis pelo Skype",
        NO_CREDIT_REQUIRED: "Não é preciso ter Crédito Skype",
        FREE: "GRÁTIS",
        HOW_TO_USE: "Saiba mais"
    },
    ca: {
        CALL: "Truca",
        CALL_VIA_SKYPE: "Truca amb Skype",
        SEND_SMS: "Envia un SMS",
        ADD_TO_SKYPE: "Afegeix a Skype",
        CALL_WITH_SKYPE_CREDITS: "Necessitareu crèdit de Skype",
        FREE_VIA_SKYPE: "Gratuït mitjançant Skype",
        NO_CREDIT_REQUIRED: "No cal crèdit de Skype",
        FREE: "GRATUÏT",
        HOW_TO_USE: "Més informació"
    },
    cs: {
        CALL: "Volání",
        CALL_VIA_SKYPE: "Volat pomocí Skype",
        SEND_SMS: "Poslat SMS",
        ADD_TO_SKYPE: "Přidat do programu Skype",
        CALL_WITH_SKYPE_CREDITS: "Budete potřebovat kredit Skype",
        FREE_VIA_SKYPE: "Zdarma přes Skype",
        NO_CREDIT_REQUIRED: "Není vyžadován žádný kredit Skype",
        FREE: "ZDARMA",
        HOW_TO_USE: "Další informace"
    },
    da: {
        CALL: "Opkald",
        CALL_VIA_SKYPE: "Opkald med Skype",
        SEND_SMS: "Send sms",
        ADD_TO_SKYPE: "Føj til Skype",
        CALL_WITH_SKYPE_CREDITS: "Du mangler Skype-kredit",
        FREE_VIA_SKYPE: "Gratis via Skype",
        NO_CREDIT_REQUIRED: "Du behøver ikke Skype-kredit",
        FREE: "GRATIS",
        HOW_TO_USE: "Læs mere"
    },
    de: {
        CALL: "Anruf",
        CALL_VIA_SKYPE: "Anruf per Skype",
        SEND_SMS: "SMS senden",
        ADD_TO_SKYPE: "Zu Skype hinzufügen",
        CALL_WITH_SKYPE_CREDITS: "Sie benötigen Skype-Guthaben",
        FREE_VIA_SKYPE: "Per Skype kostenlos",
        NO_CREDIT_REQUIRED: "Kein Skype-Guthaben erforderlich",
        FREE: "KOSTENLOS",
        HOW_TO_USE: "Weitere Informationen"
    },
    el: {
        CALL: "Κλήση",
        CALL_VIA_SKYPE: "Κλήση με χρήση του Skype",
        SEND_SMS: "Αποστολή SMS",
        ADD_TO_SKYPE: "Προσθήκη στο Skype",
        CALL_WITH_SKYPE_CREDITS: "Θα χρειαστείτε Πίστωση Skype",
        FREE_VIA_SKYPE: "Δωρεάν μέσω Skype",
        NO_CREDIT_REQUIRED: "Δεν απαιτείται Πίστωση Skype",
        FREE: "ΔΩΡΕΑΝ",
        HOW_TO_USE: "Μάθετε περισσότερα"
    },
    es: {
        CALL: "Llamar",
        CALL_VIA_SKYPE: "Llamar con Skype",
        SEND_SMS: "Enviar SMS",
        ADD_TO_SKYPE: "Añadir a Skype",
        CALL_WITH_SKYPE_CREDITS: "Necesitarás crédito de Skype",
        FREE_VIA_SKYPE: "Gratis con Skype",
        NO_CREDIT_REQUIRED: "Crédito de Skype no requerido",
        FREE: "GRATIS",
        HOW_TO_USE: "Más información"
    },
    et: {
        CALL: "Helista",
        CALL_VIA_SKYPE: "Helista Skype’iga",
        SEND_SMS: "Saada SMS",
        ADD_TO_SKYPE: "Lisa Skype’i",
        CALL_WITH_SKYPE_CREDITS: "Vaja läheb Skype’i krediiti",
        FREE_VIA_SKYPE: "Skype’i kaudu tasuta",
        NO_CREDIT_REQUIRED: "Skype’i krediiti pole vaja",
        FREE: "TASUTA",
        HOW_TO_USE: "Uuri lähemalt"
    },
    fi: {
        CALL: "Puhelu",
        CALL_VIA_SKYPE: "Soita Skypellä",
        SEND_SMS: "Lähetä tekstiviesti",
        ADD_TO_SKYPE: "Lisää Skypeen",
        CALL_WITH_SKYPE_CREDITS: "Tarvitset Skype-saldoa",
        FREE_VIA_SKYPE: "Ilmainen Skypen kautta",
        NO_CREDIT_REQUIRED: "Skype-saldoa ei tarvita",
        FREE: "ILMAINEN",
        HOW_TO_USE: "Lisätietoja"
    },
    fr: {
        CALL: "Appeler",
        CALL_VIA_SKYPE: "Appeler à l’aide de Skype",
        SEND_SMS: "Envoyer un SMS",
        ADD_TO_SKYPE: "Ajouter à Skype",
        CALL_WITH_SKYPE_CREDITS: "Crédit Skype nécessaire",
        FREE_VIA_SKYPE: "Gratuit avec Skype",
        NO_CREDIT_REQUIRED: "Aucun crédit Skype nécessaire.",
        FREE: "GRATUIT",
        HOW_TO_USE: "En savoir plus"
    },
    he: {
        CALL: "התקשר",
        CALL_VIA_SKYPE: "התקשר באמצעות Skype",
        SEND_SMS: "שלח SMS",
        ADD_TO_SKYPE: "הוסף ל- Skype",
        CALL_WITH_SKYPE_CREDITS: "תזדקק לנקודות זכות של Skype",
        FREE_VIA_SKYPE: "ללא תשלום דרך Skype",
        NO_CREDIT_REQUIRED: "אין צורך בנקודות זכות של Skype",
        FREE: "ללא תשלום",
        HOW_TO_USE: "למד עוד"
    },
    hr: {
        CALL: "Zovi",
        CALL_VIA_SKYPE: "Zovi putem Skypea",
        SEND_SMS: "Pošalji SMS",
        ADD_TO_SKYPE: "Dodaj u Skype",
        CALL_WITH_SKYPE_CREDITS: "Trebat će vam kredit za Skype",
        FREE_VIA_SKYPE: "Besplatno putem Skypea",
        NO_CREDIT_REQUIRED: "Kredit za Skype nije potreban",
        FREE: "BESPLATNO",
        HOW_TO_USE: "Saznajte više"
    },
    hu: {
        CALL: "Hívás",
        CALL_VIA_SKYPE: "Hívás a Skype használatával",
        SEND_SMS: "SMS küldése",
        ADD_TO_SKYPE: "Felvétel a Skype-partnerlistára",
        CALL_WITH_SKYPE_CREDITS: "Skype-egyenlegre van szükség",
        FREE_VIA_SKYPE: "A Skype használatával ingyenes",
        NO_CREDIT_REQUIRED: "Nem szükséges Skype-egyenleg",
        FREE: "INGYENES",
        HOW_TO_USE: "További információ"
    },
    id: {
        CALL: "Panggil",
        CALL_VIA_SKYPE: "Panggil menggunakan Skype",
        SEND_SMS: "Kirim SMS",
        ADD_TO_SKYPE: "Tambahkan ke Skype",
        CALL_WITH_SKYPE_CREDITS: "Anda akan memerlukan Kredit Skype",
        FREE_VIA_SKYPE: "Gratis via Skype",
        NO_CREDIT_REQUIRED: "Tak perlu Kredit Skype",
        FREE: "GRATIS",
        HOW_TO_USE: "Info"
    },
    it: {
        CALL: "Chiama",
        CALL_VIA_SKYPE: "Chiama con Skype",
        SEND_SMS: "Invia SMS",
        ADD_TO_SKYPE: "Aggiungi a Skype",
        CALL_WITH_SKYPE_CREDITS: "È necessario il Credito Skype",
        FREE_VIA_SKYPE: "Gratuito via Skype",
        NO_CREDIT_REQUIRED: "Non è necessario il Credito Skype",
        FREE: "GRATIS",
        HOW_TO_USE: "Altre informazioni"
    },
    ja: {
        CALL: "通話",
        CALL_VIA_SKYPE: "Skypeを使って通話する",
        SEND_SMS: "SMSを送信",
        ADD_TO_SKYPE: "Skypeに追加",
        CALL_WITH_SKYPE_CREDITS: "Skypeクレジットが必要です",
        FREE_VIA_SKYPE: "Skypeでは、無料で通話ができます",
        NO_CREDIT_REQUIRED: "Skypeクレジットは必要ありません",
        FREE: "無料",
        HOW_TO_USE: "詳細"
    },
    ko: {
        CALL: "통화",
        CALL_VIA_SKYPE: "Skype로 통화하기",
        SEND_SMS: "SMS 전송",
        ADD_TO_SKYPE: "Skype에 추가",
        CALL_WITH_SKYPE_CREDITS: "Skype 크레딧 필요",
        FREE_VIA_SKYPE: "Skype 이용 시 무료",
        NO_CREDIT_REQUIRED: "Skype 크레딧 필요 없음",
        FREE: "무료",
        HOW_TO_USE: "자세히 보기"
    },
    lt: {
        CALL: "Skambinti",
        CALL_VIA_SKYPE: "Skambinti naudojant „Skype“",
        SEND_SMS: "Siųsti SMS žinutę",
        ADD_TO_SKYPE: "Pridėti prie „Skype“",
        CALL_WITH_SKYPE_CREDITS: "Jums reikės „Skype“ kreditų",
        FREE_VIA_SKYPE: "Nemokamai naudojant „Skype“",
        NO_CREDIT_REQUIRED: "„Skype“ kreditai nereikalingi",
        FREE: "NEMOKAMAI",
        HOW_TO_USE: "Sužinokite daugiau"
    },
    lv: {
        CALL: "Zvanīt",
        CALL_VIA_SKYPE: "Zvanīt ar Skype",
        SEND_SMS: "Sūtīt īsziņu",
        ADD_TO_SKYPE: "Pievienot pakalpojumam Skype",
        CALL_WITH_SKYPE_CREDITS: "Jums vajadzīgs Skype kredīts",
        FREE_VIA_SKYPE: "Bez maksas ar Skype",
        NO_CREDIT_REQUIRED: "Nav vajadzīgs Skype kredīts",
        FREE: "BEZ MAKSAS",
        HOW_TO_USE: "Uzziniet vairāk"
    },
    nl: {
        CALL: "Bellen",
        CALL_VIA_SKYPE: "Bellen met Skype",
        SEND_SMS: "Sms'en",
        ADD_TO_SKYPE: "Toevoegen aan Skype",
        CALL_WITH_SKYPE_CREDITS: "U hebt Skypetegoed nodig",
        FREE_VIA_SKYPE: "Gratis via Skype",
        NO_CREDIT_REQUIRED: "Geen Skypetegoed vereist",
        FREE: "GRATIS",
        HOW_TO_USE: "Meer info"
    },
    no: {
        CALL: "Ring",
        CALL_VIA_SKYPE: "Ring ved hjelp av Skype",
        SEND_SMS: "Send SMS",
        ADD_TO_SKYPE: "Legg til i Skype",
        CALL_WITH_SKYPE_CREDITS: "Du trenger Skype-kredit",
        FREE_VIA_SKYPE: "Kostnadsfritt via Skype",
        NO_CREDIT_REQUIRED: "Krever ikke Skype-kredit",
        FREE: "KOSTNADSFRITT",
        HOW_TO_USE: "Lær mer"
    },
    pl: {
        CALL: "Zadzwoń",
        CALL_VIA_SKYPE: "Zadzwoń przez Skype'a",
        SEND_SMS: "Wyślij SMS-a",
        ADD_TO_SKYPE: "Dodaj do Skype'a",
        CALL_WITH_SKYPE_CREDITS: "Musisz mieć środki na koncie Skype",
        FREE_VIA_SKYPE: "Bezpłatnie przez Skype'a",
        NO_CREDIT_REQUIRED: "Nie musisz mieć środków na koncie Skype",
        FREE: "BEZPŁATNIE",
        HOW_TO_USE: "Dowiedz się więcej"
    },
    pt: {
        CALL: "Chamada",
        CALL_VIA_SKYPE: "Ligar através do Skype",
        SEND_SMS: "Enviar SMS",
        ADD_TO_SKYPE: "Adicionar ao Skype",
        CALL_WITH_SKYPE_CREDITS: "Precisa de Crédito Skype",
        FREE_VIA_SKYPE: "Grátis através do Skype",
        NO_CREDIT_REQUIRED: "Não é necessário Crédito Skype",
        FREE: "GRÁTIS",
        HOW_TO_USE: "Saiba mais"
    },
    ro: {
        CALL: "Apelare",
        CALL_VIA_SKYPE: "Apelare folosind Skype",
        SEND_SMS: "Trimitere SMS",
        ADD_TO_SKYPE: "Adăugare la Skype",
        CALL_WITH_SKYPE_CREDITS: "Aveți nevoie de credit Skype",
        FREE_VIA_SKYPE: "Gratuit pe Skype",
        NO_CREDIT_REQUIRED: "Nu aveți nevoie de credit Skype",
        FREE: "GRATUIT",
        HOW_TO_USE: "Aflați mai multe"
    },
    ru: {
        CALL: "Позвонить",
        CALL_VIA_SKYPE: "Позвонить через Skype",
        SEND_SMS: "Отправить SMS-сообщение",
        ADD_TO_SKYPE: "Добавить в Skype",
        CALL_WITH_SKYPE_CREDITS: "Требуются средства на счете в Skype",
        FREE_VIA_SKYPE: "Бесплатно через Skype",
        NO_CREDIT_REQUIRED: "Средства на счете в Skype не требуются",
        FREE: "БЕСПЛАТНО",
        HOW_TO_USE: "Подробнее"
    },
    sk: {
        CALL: "Zavolať",
        CALL_VIA_SKYPE: "Zavolať cez Skype",
        SEND_SMS: "Odoslať SMS",
        ADD_TO_SKYPE: "Pridať do Skypeu",
        CALL_WITH_SKYPE_CREDITS: "Treba kredit Skype",
        FREE_VIA_SKYPE: "Bezplatne cez Skype",
        NO_CREDIT_REQUIRED: "Netreba žiaden kredit Skype",
        FREE: "BEZPLATNÉ",
        HOW_TO_USE: "Ďalšie informácie"
    },
    sl: {
        CALL: "Pokliči",
        CALL_VIA_SKYPE: "Pokliči s programom Skype",
        SEND_SMS: "Pošlji SMS",
        ADD_TO_SKYPE: "Dodaj v program Skype",
        CALL_WITH_SKYPE_CREDITS: "Potrebujete dobropis Skype",
        FREE_VIA_SKYPE: "Skype – brezplačno",
        NO_CREDIT_REQUIRED: "Ne potrebujete dobropisa Skype",
        FREE: "BREZPLAČNO",
        HOW_TO_USE: "Več o tem"
    },
    sr: {
        CALL: "Pozovi",
        CALL_VIA_SKYPE: "Pozovi pomoću Skypea",
        SEND_SMS: "Pošalji SMS",
        ADD_TO_SKYPE: "Dodaj na Skype",
        CALL_WITH_SKYPE_CREDITS: "Potreban vam je Skype kredit",
        FREE_VIA_SKYPE: "Besplatno putem Skypea",
        NO_CREDIT_REQUIRED: "Nije potreban Skype kredit",
        FREE: "BESPLATNO",
        HOW_TO_USE: "Saznajte više"
    },
    sv: {
        CALL: "Ring",
        CALL_VIA_SKYPE: "Ringa med Skype",
        SEND_SMS: "Skicka SMS",
        ADD_TO_SKYPE: "Lägg till i Skype",
        CALL_WITH_SKYPE_CREDITS: "Du behöver Skype-kredit",
        FREE_VIA_SKYPE: "Kostnadsfritt med Skype",
        NO_CREDIT_REQUIRED: "Ingen Skype-kredit krävs",
        FREE: "KOSTNADSFRITT",
        HOW_TO_USE: "Läs mer"
    },
    th: {
        CALL: "โทร",
        CALL_VIA_SKYPE: "โทรผ่าน Skype",
        SEND_SMS: "ส่ง SMS",
        ADD_TO_SKYPE: "เพิ่มใน Skype",
        CALL_WITH_SKYPE_CREDITS: "คุณจำเป็นต้องมีเครดิต Skype",
        FREE_VIA_SKYPE: "โทรฟรีผ่าน Skype",
        NO_CREDIT_REQUIRED: "ไม่จำเป็นต้องมีเครดิต Skype",
        FREE: "ฟรี",
        HOW_TO_USE: "เรียนรู้เพิ่มเติม"
    },
    tr: {
        CALL: "Çağrı Yapın",
        CALL_VIA_SKYPE: "Skype kullanarak çağrı yapın",
        SEND_SMS: "SMS gönderin",
        ADD_TO_SKYPE: "Skype'a ekle",
        CALL_WITH_SKYPE_CREDITS: "Skype Kontörü gerekiyor",
        FREE_VIA_SKYPE: "Skype ile Ücretsiz",
        NO_CREDIT_REQUIRED: "Skype Kontörü gerekmez",
        FREE: "ÜCRETSİZ",
        HOW_TO_USE: "Daha fazla bilgi edinin"
    },
    uk: {
        CALL: "Виклик",
        CALL_VIA_SKYPE: "Виклик за допомогою Skype",
        SEND_SMS: "Надіслати SMS",
        ADD_TO_SKYPE: "Додати до Skype",
        CALL_WITH_SKYPE_CREDITS: "Потрібні кошти на рахунку Skype",
        FREE_VIA_SKYPE: "Безкоштовно у Skype",
        NO_CREDIT_REQUIRED: "Кошти на рахунку Skype не потрібні",
        FREE: "БЕЗКОШТОВНО",
        HOW_TO_USE: "Дізнатися більше"
    },
    vi: {
        CALL: "Gọi điện",
        CALL_VIA_SKYPE: "Gọi bằng Skype",
        SEND_SMS: "Gửi SMS",
        ADD_TO_SKYPE: "Thêm vào Skype",
        CALL_WITH_SKYPE_CREDITS: "Bạn sẽ cần Skype Credit",
        FREE_VIA_SKYPE: "Miễn phí qua Skype",
        NO_CREDIT_REQUIRED: "Không yêu cầu Skype Credit",
        FREE: "MIỄN PHÍ",
        HOW_TO_USE: "Tìm hiểu thêm"
    },
    zh: {
        CALL: "通话",
        CALL_VIA_SKYPE: "使用Skype拨打电话",
        SEND_SMS: "发送短信",
        ADD_TO_SKYPE: "添加到Skype",
        CALL_WITH_SKYPE_CREDITS: "您需要Skype点数",
        FREE_VIA_SKYPE: "通过Skype免费拨打",
        NO_CREDIT_REQUIRED: "不需要Skype点数",
        FREE: "免费",
        HOW_TO_USE: "了解详情"
    },
    tw: {
        CALL: "撥號",
        CALL_VIA_SKYPE: "使用 Skype 通話",
        SEND_SMS: "傳送手機簡訊",
        ADD_TO_SKYPE: "新增至 Skype",
        CALL_WITH_SKYPE_CREDITS: "您將需要 Skype 點數",
        FREE_VIA_SKYPE: "透過 Skype 免費通話",
        NO_CREDIT_REQUIRED: "不需要 Skype 點數",
        FREE: "免費",
        HOW_TO_USE: "瞭解詳情"
    }*/
};

// Holds localized user visible display strings
var localizedPhrases;

/**
* The method returns the language used for localization and
* loads the localized resources in that language.
*/
/*eslint no-unused-vars: [2, { "varsIgnorePattern": "loadLocalizedResources" }]*/
function loadLocalizedResources() {
    var chosenLanguage = 'en'; // Default

    // Get the browser language e.g. en-US
    var browserLanguage = navigator.language || navigator.userLanguage;

    // Check if we support the browser language
    if (browserLanguage) {
        var parts = browserLanguage.split('-');
        if (parts.length > 0)
        {
            /* eslint max-depth: [2, 3]*/
            if (browserLanguage === 'zh-TW') {
                chosenLanguage = 'tw';
            }
            else if (browserLanguage === 'pt-BR') {
                chosenLanguage = 'br';
            }
            else if (localization[parts[0]] != null) {
                chosenLanguage = parts[0];
            }
        }
    }

    localizedPhrases = localization[chosenLanguage];
    if (!localizedPhrases)
    {
        chosenLanguage = 'en';
        localizedPhrases = localization[chosenLanguage];
    }

    return chosenLanguage;
}
