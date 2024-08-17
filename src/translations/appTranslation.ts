
export class AppTranslationBase {

    //#region common UI translations

    ExamSphereTitleText: string = "---ExamSphere---";
    LoginText: string = "Login";
    LoadingText: string = "Loading...";
    ProfileText: string = "Profile";
    EditProfileText: string = "Edit Profile";
    ChangePasswordText: string = "Change Password";
    ManageUsersText: string = "Manage Users";
    AddUserText: string = "Add User";
    EditUserInfoText: string = "Edit User Info";
    ChangeUserPasswordText: string = "Change User Password";
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

    //#endregion


    //#region API response fields translations

    user_id: string = "User ID";
    full_name: string = "Full Name";
    email: string = "Email";
    password: string = "Password";
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
