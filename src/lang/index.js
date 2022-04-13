import { getLocale, saveLocale } from '@/utils/localStorage';
import Vue from 'vue';
import VueI18N from 'vue-i18n';
import cn from '@/lang/cn';
import en from '@/lang/en';

Vue.use(VueI18N);

let locale = getLocale();
if(!locale) {
    locale = 'cn';
    saveLocale(locale);
}

const messages = {
    cn,
    en
}

const i18n = new VueI18N({
    locale,
    messages
})

export default i18n;