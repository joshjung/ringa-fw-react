import ENGLISH_LANGUAGE_PACK from './assets/i18n/en/pack.json';
import SWEDISH_LANGUAGE_PACK from './assets/i18n/sv/pack.json';

import EN_I18N_DESCRIPTION from './assets/i18n/en/i18n.md';
import SV_I18N_DESCRIPTION from './assets/i18n/sv/i18n.md';

import EN_SCREEN_DESCRIPTION from './assets/i18n/en/screen.md';
import EN_DEBUG_INSPECTOR_DESCRIPTION from './assets/i18n/en/debugInspector.md';
import EN_THEME_DESCRIPTION from './assets/i18n/en/theme.md';
import EN_THEME_DATAGRID from './assets/i18n/en/dataGrid.md';
import EN_THEME_ALERT from './assets/i18n/en/alert.md';

const EN = 'en';
const SV = 'sv';

/**
 * The primary I18NModel instance is created in DefaultApplicationRoot. ApplicationLayout extends this and then
 * calls our setup function below. Here we add all our keys to the language pack before the application is rendered
 * so that we can then display the values immediately.
 *
 * Note: in this template we are loading all of our language data directly into our final JS artifact. For large
 * applications this is a poor strategy since we would probably want to dynamically load our language data from a DB
 * or a file stored on the server.
 */
export function setup(i18NModel) {
  // Language packs are a JSON file of multiple keys
  i18NModel.mergeLanguagePack(EN, ENGLISH_LANGUAGE_PACK);
  i18NModel.mergeLanguagePack(SV, SWEDISH_LANGUAGE_PACK);

  // addLanguageKey adds a single key at a time. This is useful if our content for the page is larger
  // than we would want in a single key in a JSON file.
  i18NModel.addLanguageKey(EN, 'i18n.description', EN_I18N_DESCRIPTION);
  i18NModel.addLanguageKey(SV, 'i18n.description', SV_I18N_DESCRIPTION);

  i18NModel.addLanguageKey(EN, 'screen.description', EN_SCREEN_DESCRIPTION);
  i18NModel.addLanguageKey(EN, 'debugInspector.description', EN_DEBUG_INSPECTOR_DESCRIPTION);
  i18NModel.addLanguageKey(EN, 'theme.description', EN_THEME_DESCRIPTION);
  i18NModel.addLanguageKey(EN, 'dataGrid.description', EN_THEME_DATAGRID);
  i18NModel.addLanguageKey(EN, 'alert.description', EN_THEME_ALERT);

  // By default the language is loaded from a cookie 'lang' on the local domain, but you could set it up to something else
  // here
  // i18NModel.language = EN;
}