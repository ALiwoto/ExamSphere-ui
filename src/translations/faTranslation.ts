import { AppTranslationBase } from "./appTranslation";


class FaTranslation extends AppTranslationBase {

    //#region common UI translations

    ExamSphereTitleText: string = "---کره ی آزمون---";
    WelcomeToPlatformText: string = "به کره ی آزمون خوش آمدید!";
    LoginText: string = "ورود";
    LoadingText: string = "در حال بارگذاری...";
    ProfileText: string = "پروفایل";
    EditProfileText: string = "ویرایش پروفایل";
    ChangePasswordText: string = "تغییر رمز عبور";
    ManageUsersText: string = "مدیریت کاربران";
    AddUserText: string = "افزودن کاربر";
    EditUserInfoText: string = "ویرایش اطلاعات کاربر";
    ChangeUserPasswordText: string = "تغییر رمز عبور کاربر";
    ManageCoursesText: string = "مدیریت دوره ها";
    AddCourseText: string = "افزودن دوره";
    SearchCoursesText: string = "جستجوی دوره ها";
    EditCourseText: string = "ویرایش دوره";
    ManageExamsText: string = "مدیریت آزمون ها";
    AddExamText: string = "افزودن آزمون";
    EditExamText: string = "ویرایش آزمون";
    SettingsText: string = "تنظیمات";
    HelpText: string = "راهنما";
    LogoutText: string = "خروج از حساب کاربری";
    CreateUserButtonText: string = "ایجاد کاربر";
    SaveText: string = "ذخیره";
    EditText: string = "ویرایش";
    UserInformationText: string = "اطلاعات کاربر";
    UserNotFoundText: string = "این کاربر وجود ندارد...";
    CreateNewUserText: string = "ایجاد کاربر جدید";
    UserCreatedSuccessfullyText: string = "کاربر با موفقیت ایجاد شد";
    NoResultsFoundText: string = "نتیجه ای یافت نشد، تلاش کنید تا جستجوی خود را تغییر دهید";
    EnterSearchForEdit: string = "برای ویرایش کاربر جستجو کنید";

    //#endregion


    //#region API response fields translations

    user_id: string = "شناسه کاربری";
    full_name: string = "نام کامل";
    email: string = "ایمیل";
    password: string = "رمز عبور";
    created_at: string = "ایجاد شده در";
    updated_at: string = "به روز شده در";
    last_login: string = "آخرین ورود";
    role: string = "نقش";
    user: string = "کاربر";
    admin: string = "مدیر";

    //#endregion

};

export default FaTranslation;
