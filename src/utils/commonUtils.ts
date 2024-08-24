import { CurrentAppTranslation } from "../translations/appTranslation";


export function hexDecode(hexString: string): string {
    const bytes = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    return new TextDecoder().decode(bytes);
}

export function getFieldOf(obj: any, fieldName: string): any {
    return obj[fieldName] ?? undefined;
}

export function autoSetWindowTitle(): void {
    switch (window.location.pathname) {
        case '/confirmAccountRedirect':
            document.title = CurrentAppTranslation.ConfirmAccountText;
            break;
        case '/createCourse':
            document.title = CurrentAppTranslation.CreateCourseText;
            break;
        case '/createExam':
            document.title = CurrentAppTranslation.CreateExamText;
            break;
        case '/createTopic':
            document.title = CurrentAppTranslation.CreateTopicText;
            break;
        case '/dashboard':
            document.title = CurrentAppTranslation.DashboardText;
            break;
        case '/searchCourse':
            document.title = CurrentAppTranslation.SearchCourseText;
            break;
        case '/searchTopic':
            document.title = CurrentAppTranslation.SearchTopicText;
            break;
        case '/searchUser':
            document.title = CurrentAppTranslation.SearchUserText;
            break;
        case '/searchExam':
            document.title = CurrentAppTranslation.SearchExamText;
            break;
        case '/examInfo':
            document.title = CurrentAppTranslation.ExamInfoText;
            break;
        case '/userInfo':
            document.title = CurrentAppTranslation.UserInfoText;
            break;
        default:
            break;
    }
}

