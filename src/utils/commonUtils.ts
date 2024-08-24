import { CurrentAppTranslation } from "../translations/appTranslation";


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

