import { AppCalendarType } from "../utils/AppCalendarTypes";
import { AppTranslationBase, TextDirection, TextJustifyContent } from "./appTranslation";


class FaTranslation extends AppTranslationBase {
    ShortLang: string = "fa";

    //#region Style Attributes
    fontFamily: string = `"Vazirmatn", "B Kamran", "Vazir", "Shabnam", "Samim", "Iran Sans", "Yekan", "Nazanin", "Tahoma", "Arial", sans-serif`;
    direction: TextDirection = "rtl";
    justifyContent: TextJustifyContent = "flex-end";
    textAlign: string = "right";
    float: string = "right";

    //#endregion

    //#region common UI translations

    ExamSphereTitleText: string = "---پلتفرم آزمون های آنلاین---";
    WelcomeToPlatformText: string = "به پلتفرم آزمون های آنلاین خوش آمدید!";
    YesText: string = "بله";
    NoText: string = "خیر";
    LoginText: string = "ورود";
    LoadingText: string = "در حال بارگذاری...";
    PleaseWaitText: string = "لطفا منتظر بمانید تا صفحه برای شما بارگذاری شود...";
    ProfileText: string = "پروفایل";
    DashboardText: string = "داشبورد";
    EditProfileText: string = "ویرایش پروفایل";
    ChangePasswordText: string = "تغییر رمز عبور";
    ManageUsersText: string = "مدیریت کاربران";
    AddUserText: string = "افزودن کاربر";
    SearchUsersText: string = "جستجوی کاربران";
    SearchUserText: string = "جستجوی کاربران";
    EditUserInfoText: string = "ویرایش اطلاعات کاربر";
    ChangeUserPasswordText: string = "تغییر رمز عبور کاربر";
    ManageTopicsText: string = "مدیریت موضوعات";
    AddTopicText: string = "افزودن موضوع";
    SearchTopicsText: string = "جستجوی موضوعات";
    SearchTopicText: string = "جستجوی موضوعات";
    EditTopicsText: string = "ویرایش موضوع";
    ManageCoursesText: string = "مدیریت دوره ها";
    AddCourseText: string = "افزودن دوره";
    SearchCoursesText: string = "جستجوی دوره ها";
    SearchCourseText: string = "جستجوی دوره";
    SearchExamText: string = "جستجوی آزمون ها";
    QuestionTitleText: string = "عنوان سوال";
    DescriptionText: string = "توضیحات";
    EditCourseText: string = "ویرایش دوره";
    ManageExamsText: string = "مدیریت آزمون ها";
    AddExamText: string = "افزودن آزمون";
    EditExamText: string = "ویرایش آزمون";
    SettingsText: string = "تنظیمات";
    HelpText: string = "راهنما";
    LogoutText: string = "خروج از حساب کاربری";
    CreateUserButtonText: string = "ایجاد کاربر";
    CreateTopicButtonText: string = "ایجاد موضوع";
    SaveText: string = "ذخیره";
    ParticipateText: string = "شرکت در آزمون";
    QuestionsText: string = "سوالات";
    ExamHallText: string = "سالن امتحان";
    ConfirmText: string = "تایید";
    SubmitText: string = "ثبت";
    ChosenOptionText: string = "گزینه انتخابی";
    AnswerFieldText: string = "متن پاسخ";
    OptionText: string = "گزینه";
    OptionSeparatorChar: string = ")";
    EditText: string = "ویرایش";
    UserInformationText: string = "اطلاعات کاربر";
    CourseInformationText: string = "اطلاعات دوره";
    ExamInformationText: string = "اطلاعات آزمون";
    ExamInfoText: string = "اطلاعات آزمون";
    UserInfoText: string = "اطلاعات کاربر";
    ConfirmYourAccountText: string = "حساب کاربری خود را تایید کنید";
    ConfirmChangingYourPasswordText: string = "تغییر رمز عبور خود را تایید کنید";
    ConfirmAccountText: string = "تایید حساب کاربری";
    CreateNewUserText: string = "ایجاد کاربر جدید";
    CreateNewTopicText: string = "ایجاد موضوع جدید";
    CreateNewExamText: string = "ایجاد آزمون جدید";
    CreateTopicText: string = "ایجاد موضوع";
    CreateNewCourseText: string = "ایجاد دوره جدید";
    CreateCourseText: string = "ایجاد دوره";
    CreateExamText: string = "ایجاد آزمون";
    AddNewQuestionText: string = "افزودن سوال جدید";
    DeleteTopicButtonText: string = "حذف موضوع";
    BackToExamInfoText: string = "بازگشت به اطلاعات آزمون";
    CreateCourseButtonText: string = "ایجاد دوره";
    CancelButtonText: string = "لغو";
    SendEmailToUseText: string = "ارسال ایمیل تایید به کاربر";
    ExamFinishesInText: string = "آزمون پایان می یابد در";
    ExamFinishedText: string = "آزمون پایان یافت!";

    // System messages
    ExamParticipationSuccessText: string = "عملیات شرکت در آزمون با موفقیت انجام شد!";
    LanguageChangedSuccessfullyText: string = "زبان با موفقیت تغییر یافت";
    ExamHasNoQuestionsYetText: string = "این آزمون هنوز سوالی ندارد!";
    PasswordChangedSuccessfullyText: string = "رمز عبور با موفقیت تغییر یافت";
    EmailForPassWilLBeSentText: string = "ایمیلی برای تغییر رمز عبور به شما ارسال خواهد شد";
    UserUpdatedSuccessfullyText: string = "کاربر با موفقیت ویرایش شد";
    EmailSentForPasswordChangeText: string = "ایمیلی برای تغییر رمز عبور ارسال شد";
    AreYouSureDeleteTopicText: string = "آیا مطمئن هستید که می خواهید این موضوع را حذف کنید؟";
    DeleteTopicDescriptionText: string = "این عملیات قابل بازگشت نیست! تمام دوره ها و آزمون های مرتبط با این موضوع نیز حذف خواهند شد.";
    TopicDeletedSuccessfullyText: string = "موضوع با موفقیت حذف شد!";
    ConfirmationSuccessText: string = "تایید با موفقیت انجام شد!";
    PasswordsDoNotMatchText: string = "رمز عبور ها یکسان نیستند!";
    FailedToConfirmAccountCreationText: string = "تایید ایجاد حساب کاربری ناموفق بود";
    UserNotFoundText: string = "این کاربر وجود ندارد...";
    ExamNotFoundText: string = "این آزمون وجود ندارد...";
    CourseNotFoundText: string = "این دوره وجود ندارد...";
    UserCreatedSuccessfullyText: string = "کاربر با موفقیت ایجاد شد";
    TopicCreatedSuccessfullyText: string = "موضوع با موفقیت ایجاد شد";
    ExamCreatedSuccessfullyText: string = "آزمون با موفقیت ایجاد شد";
    CourseCreatedSuccessfullyText: string = "دوره با موفقیت ایجاد شد";
    NoResultsFoundText: string = "نتیجه ای یافت نشد، تلاش کنید تا جستجوی خود را تغییر دهید";
    SearchSomethingForTopicsText: string = "برای جستجو یک کلمه وارد کنید یا خالی بگذارید تا همه موضوعات لیست شوند";
    EnterSearchForEdit: string = "برای ویرایش، ابتدا جستجو کنید";
    CopyrightText: string = "ALiwoto. تمامی حقوق محفوظ است.";

    //#endregion


    //#region API response fields translations

    has_started: string = "شروع شده";
    has_finished: string = "پایان یافته";
    has_participated: string = "شرکت کرده";
    setup_completed: string = "ارسال ایمیل تایید به کاربر";
    is_public: string = "عمومی";
    exam_date: string = "تاریخ آزمون";
    duration: string = "مدت زمان (دقیقه)";
    price: string = "هزینه";
    exam_description: string = "توضیحات آزمون";
    exam_title: string = "عنوان آزمون";
    course_description: string = "توضیحات دوره";
    course_id: string = "شناسه دوره";
    course_name: string = "نام دوره";
    topic_name: string = "نام موضوع";
    topic_id: string = "شناسه موضوع";
    exam_id: string = "شناسه آزمون";
    user_id: string = "شناسه کاربری";
    new_password: string = "رمز عبور جدید";
    repeat_password: string = "تکرار رمز عبور";
    full_name: string = "نام کامل";
    email: string = "ایمیل";
    lang: string = "زبان";
    password: string = "رمز عبور";
    phone_number: string = "تلفن همراه";
    user_address: string = "آدرس";
    created_at: string = "ایجاد شده در";
    updated_at: string = "به روز شده در";
    last_login: string = "آخرین ورود";
    role: string = "نقش";
    user: string = "کاربر";
    admin: string = "مدیر";
    owner: string = "مالک";
    student: string = "دانشجو";
    teacher: string = "استاد";

    //#endregion

    //#region System Behaviors
    CalendarType: AppCalendarType = "jalali";

    //#endregion
};

export default FaTranslation;
