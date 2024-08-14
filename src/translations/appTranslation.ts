
export class AppTranslationBase {
    Login: string = "Login";
    LoadingText: string = "Loading...";
}

export var CurrentAppTranslation = new AppTranslationBase();

export function setAppTranslation(translation: AppTranslationBase) {
    CurrentAppTranslation = translation;
}
