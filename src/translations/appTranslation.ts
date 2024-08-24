import { AppCalendarType } from "../utils/AppCalendarTypes";

export class AppTranslationBase {
    ShortLang: string = "en";

    //#region Style Attributes
    direction: "ltr" | "rtl" = "ltr";
    textAlign: string = "left";
    float: string = "left";
    
    //#endregion

    //#region common UI translations

    ExamSphereTitleText: string = "---ExamSphere---";
    WelcomeToPlatformText: string = "Welcome to ExamSphere!";
    YesText: string = "Yes";
    NoText: string = "No";
    LoginText: string = "Login";
    LoadingText: string = "Loading...";
    PleaseWaitText: string = "Please wait while we load the page for you...";
    ProfileText: string = "Profile";
    DashboardText: string = "Dashboard";
    EditProfileText: string = "Edit Profile";
    ChangePasswordText: string = "Change Password";
    ManageUsersText: string = "Manage Users";
    AddUserText: string = "Add User";
    SearchUsersText: string = "Search Users";
    SearchUserText: string = "Search Users";
    EditUserInfoText: string = "Edit User Info";
    ChangeUserPasswordText: string = "Change User Password";
    ManageTopicsText: string = "Manage Topics";
    AddTopicText: string = "Add Topic";
    SearchTopicsText: string = "Search Topics";
    SearchTopicText: string = "Search Topics";
    EditTopicsText: string = "Edit Topic";
    ManageCoursesText: string = "Manage Courses";
    AddCourseText: string = "Add Course";
    SearchCoursesText: string = "Search Course";
    SearchCourseText: string = "Search Courses";
    EditCourseText: string = "Edit Course";
    ManageExamsText: string = "Manage Exams";
    AddExamText: string = "Add Exam";
    EditExamText: string = "Edit Exam";
    SettingsText: string = "Settings";
    HelpText: string = "Help";
    LogoutText: string = "Logout";
    CreateUserButtonText: string = "Create User";
    CreateTopicButtonText: string = "Create Topic";
    CreateCourseButtonText: string = "Create Course";
    SaveText: string = "Save";
    ConfirmText: string = "Confirm";
    EditText: string = "Edit";
    UserInformationText: string = "User Information";
    CourseInformationText: string = "Course Information";
    ExamInfoText: string = "Exam Info";
    UserInfoText: string = "User Info";
    ConfirmYourAccountText: string = "Confirm Your Account";
    ConfirmAccountText: string = "Confirm Account";
    CreateNewUserText: string = "Create New User";
    CreateNewTopicText: string = "Create New Topic";
    CreateNewExamText: string = "Create New Exam";
    CreateTopicText: string = "Create Topic";
    CreateNewCourseText: string = "Create New Course";
    CreateCourseText: string = "Create Course";
    CreateExamText: string = "Create Exam";
    DeleteTopicButtonText: string = "Delete Topic";
    CancelButtonText: string = "Cancel";
    SendEmailToUseText: string = "Send email confirmation to user";

    // System messages
    AreYouSureDeleteTopicText: string = "Are you sure you want to delete this topic?";
    DeleteTopicDescriptionText: string = "This action cannot be undone! All courses and exams related to this topic will be deleted as well.";
    TopicDeletedSuccessfullyText: string = "Topic deleted successfully!";
    ConfirmationSuccessText: string = "Confirmation was successful!";
    PasswordsDoNotMatchText: string = "Passwords do not match!";
    FailedToConfirmAccountCreationText: string = "Failed to confirm account creation";
    UserNotFoundText: string = "This user doesn't seem to exist...";
    CourseNotFoundText: string = "This course doesn't seem to exist...";
    UserCreatedSuccessfullyText: string = "User created successfully";
    TopicCreatedSuccessfullyText: string = "Topic created successfully";
    ExamCreatedSuccessfullyText: string = "Exam created successfully";
    CourseCreatedSuccessfullyText: string = "Course created successfully";
    NoResultsFoundText: string = "No results found, try changing your search query";
    SearchSomethingForTopicsText: string = "Search a query or enter empty to list all topics";
    EnterSearchForEdit: string = "Enter search query to edit the user";
    CopyrightText: string = "ALiwoto. All rights reserved.";

    //#endregion


    //#region API response fields translations

    setup_completed: string = "Send email confirmation to user";
    is_public: string = "Is Public";
    exam_date: string = "Exam Date";
    duration: string = "Duration (minutes)";
    price: string = "Price";
    exam_description: string = "Exam Description";
    exam_title: string = "Exam Title";
    course_description: string = "Course Description";
    course_id: string = "Course ID";
    course_name: string = "Course Name";
    topic_name: string = "Topic Name";
    topic_id: string = "Topic ID";
    exam_id: string = "Exam ID";
    user_id: string = "User ID";
    new_password: string = "New Password";
    repeat_password: string = "Repeat Password";
    full_name: string = "Full Name";
    email: string = "Email";
    password: string = "Password";
    phone_number: string = "Phone Number";
    user_address: string = "Address";
    created_at: string = "Created At";
    updated_at: string = "Updated At";
    last_login: string = "Last Login";
    role: string = "Role";
    user: string = "User";
    admin: string = "Admin";

    //#endregion

    //#region System Behaviors
    CalendarType: AppCalendarType = "gregorian";

    //#endregion

}

export var CurrentAppTranslation = new AppTranslationBase();

export function setAppTranslation(translation: AppTranslationBase) {
    CurrentAppTranslation = translation;
}
