import { AppTranslationBase, setAppTranslation } from './appTranslation';
import FaTranslation from './faTranslation';

export type SupportedTranslations = 'fa' | 'en';

export function switchAppTranslation(to: SupportedTranslations) {
    switch (to) {
        case 'fa':
            setAppTranslation(new FaTranslation());
            return;
        case 'en':
            setAppTranslation(new AppTranslationBase());
            return;
        default:
            setAppTranslation(new AppTranslationBase());
            return;
    }
}

