
export class AppTranslationBase {

    //#region common UI translations

    ExamSphereTitleText: string = "---ExamSphere---";
    WelcomeToPlatformText: string = "Welcome to ExamSphere!";
    LoginText: string = "Login";
    LoadingText: string = "Loading...";
    ProfileText: string = "Profile";
    EditProfileText: string = "Edit Profile";
    ChangePasswordText: string = "Change Password";
    ManageUsersText: string = "Manage Users";
    AddUserText: string = "Add User";
    SearchUsersText: string = "Search Users";
    EditUserInfoText: string = "Edit User Info";
    ChangeUserPasswordText: string = "Change User Password";
    ManageCoursesText: string = "Manage Courses";
    AddCourseText: string = "Add Course";
    SearchCoursesText: string = "Search Courses";
    EditCourseText: string = "Edit Course";
    ManageExamsText: string = "Manage Exams";
    AddExamText: string = "Add Exam";
    EditExamText: string = "Edit Exam";
    SettingsText: string = "Settings";
    HelpText: string = "Help";
    LogoutText: string = "Logout";
    CreateUserButtonText: string = "Create User";
    SaveText: string = "Save";
    EditText: string = "Edit";
    UserInformationText: string = "User Information";
    UserNotFoundText: string = "This user doesn't seem to exist...";
    CreateNewUserText: string = "Create New User";
    UserCreatedSuccessfullyText: string = "User created successfully";
    NoResultsFoundText: string = "No results found, try changing your search query";
    EnterSearchForEdit: string = "Enter search query to edit the user";

    //#endregion


    //#region API response fields translations

    user_id: string = "User ID";
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

}

export var CurrentAppTranslation = new AppTranslationBase();

export function setAppTranslation(translation: AppTranslationBase) {
    CurrentAppTranslation = translation;
}
