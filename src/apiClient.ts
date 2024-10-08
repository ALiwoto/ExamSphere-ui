
import { sha256 } from 'js-sha256';
import {
    UserApi,
    Configuration as APIConfiguration,
    LoginData,
    LoginResult,
    GetMeResult,
    UserRole,
    APIErrorCode,
    AuthResult,
    CreateUserData,
    CreateUserResult,
    SearchUserData,
    SearchUserResult,
    GetUserInfoResult,
    EditUserData,
    EditUserResult,
    TopicApi,
    CreateNewTopicData,
    CreateNewTopicResult,
    SearchTopicData,
    SearchTopicResult,
    ConfirmAccountData,
    CourseApi,
    CreateCourseData,
    CreateCourseResult,
    GetCourseInfoResult,
    EditCourseResult,
    EditCourseData,
    SearchCourseData,
    SearchCourseResult,
    CreateExamData,
    CreateExamResult,
    ExamApi,
    EditExamData,
    EditExamResult,
    GetExamInfoResult,
    SearchExamData,
    SearchExamResult,
    ParticipateExamData,
    ParticipateExamResult,
    ChangePasswordData,
    ChangePasswordResult,
    ConfirmChangePasswordData,
    GetExamQuestionsData,
    GetExamQuestionsResult,
    ExamQuestionInfo,
    CreateExamQuestionData,
    CreateExamQuestionResult,
    AnswerQuestionData,
    AnswerQuestionResult,
    EditExamQuestionData,
    EditExamQuestionResult,
    GetExamParticipantsData,
    GetExamParticipantsResult,
    SetExamScoreData,
    SetExamScoreResult,
} from './api';
import { canParseAsNumber } from './utils/textUtils';
import { SupportedTranslations } from './translations/translationSwitcher';

class ExamSphereAPIClient extends UserApi {
    /** The Client's RID parameter. Automatically generated on startup. */
    public clientRId: string;

    /** The last captcha ID received from the backend. */
    public lastCaptchaId?: string;

    /** The access token of the current user received from the backend. */
    public accessToken?: string;
    /** The refresh token of the current user received from the backend. */
    public refreshToken?: string;

    /** The current user info received from the backend. */
    public currentUserInfo?: GetMeResult;

    /** The currently logged-in user's role. */
    public role?: UserRole;
    public userLanguage?: SupportedTranslations = 'en';

    private topicApi: TopicApi;
    private courseApi: CourseApi;
    private examApi: ExamApi;

    constructor() {
        super();
        this.guessBasePath();
        this.clientRId = this.generateClientRId();
        this.readTokens();

        this.topicApi = new TopicApi(this.configuration);
        this.courseApi = new CourseApi(this.configuration);
        this.examApi = new ExamApi(this.configuration);
    }

    /**
     * Generates Client RID parameter that is used in the API calls.
     * @returns the generated Client RID.
     */
    private generateClientRId(): string {
        let rid = this.readItem('ExamSphere_clientRId');
        if (rid) {
            return rid;
        }

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = Math.floor(Math.random() * (16 - 8 + 1)) + 8;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        this.storeItem('ExamSphere_clientRId', result);
        return result;
    }

    /**
     * Tries to find out the api base path.
     */
    public guessBasePath(): void {
        // try to find out the base path
        let correctBasePath = "https://aliwoto.is-a.dev:8080";
        // let correctBasePath = "http://localhost:8080";
        const envBasePath = process.env.EXAM_SPHERE_API_URL;
        if (envBasePath) {
            correctBasePath = envBasePath;
        } else if (window.location.origin && !window.location.origin.endsWith("3000")) {
            correctBasePath = window.location.origin ?? correctBasePath;
        }

        this.basePath = correctBasePath.replace(/\/+$/, '');
        this.configuration ??= new APIConfiguration();
        this.configuration.basePath = this.basePath;
    }


    public getCurrentUserId(): string | null {
        return this.currentUserInfo?.user_id ?? null;
    }

    /**
     * Stores the access and refresh tokens in the local storage.
     * In the future, if we want to add some algorithms for token encryption
     * or security, we can add it in this method.
     */
    private storeTokens(): void {
        this.storeItem('ExamSphere_accessToken', this.accessToken!);
        this.storeItem('ExamSphere_refreshToken', this.refreshToken!);
    }

    private hash_key(value: string): string {
        return sha256(value);
    }

    /**
     * Stores an item in the local storage.
     * @param key The key of the item to store.
     * @param value The value of the item to store.
     */
    private storeItem(key: string, value: string): void {
        localStorage.setItem(this.hash_key(key), value);
    }

    private readItem(key: string): string | undefined {
        return localStorage.getItem(this.hash_key(key)) ?? undefined;
    }

    private removeItem(key: string): void {
        localStorage.removeItem(this.hash_key(key));
    }

    /**
     * Clears the access and refresh tokens from the local storage.
     */
    public clearTokens(): void {
        this.removeItem('ExamSphere_accessToken');
        this.removeItem('ExamSphere_refreshToken');
        this.accessToken = undefined;
        this.refreshToken = undefined
    }

    /**
     * Reads the access and refresh tokens from the local storage.
     * In the future, if we want to add some algorithms for token decryption
     * or security, we can add it in this method.
     */
    private readTokens(): void {
        this.accessToken = this.readItem('ExamSphere_accessToken');
        this.refreshToken = this.readItem('ExamSphere_refreshToken');
        this.userLanguage = this.readItem('ExamSphere_userLanguage') as SupportedTranslations ?? 'en';
    }

    /**
     * Switches the language of the app.
     * @todo Make this method send the user settings to backend.
     * @param lang The language to switch to.
     */
    public async setAppLanguage(lang: SupportedTranslations): Promise<void> {
        this.userLanguage = lang;
        this.storeItem('ExamSphere_userLanguage', lang);
    }

    /**
     * Requests a new captcha image from the backend.
     * @returns the captcha image as a base64 string.
     */
    public async getCaptchaImage(): Promise<string> {
        let captchaResult = await this.generateCaptchaV1(this.clientRId);
        if (!captchaResult?.data?.result?.captcha) {
            throw new Error("Failed to get captcha image");
        }

        this.lastCaptchaId = captchaResult?.data?.result?.captcha_id;
        return captchaResult?.data?.result?.captcha;
    }

    /**
     * Logs in the user with the given login data.
     * @param loginData the login data.
     * @returns the login result.
     */
    public async loginWithPass(loginData: LoginData): Promise<LoginResult> {
        let loginResult = (await this.loginV1(loginData))?.data.result;
        if (!loginResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to login");
        }

        this.accessToken = loginResult.access_token;
        this.refreshToken = loginResult.refresh_token;
        this.role = loginResult.role;
        this.storeTokens();
        return loginResult;
    }

    /**
     * Gets the current user's information.
     * @returns the current user info.
     */
    public async getCurrentUserInfo(noReAuth: boolean = false): Promise<GetMeResult> {
        if (!this.accessToken || !this.refreshToken) {
            throw new Error("Not logged in");
        }

        let userInfo: GetMeResult | undefined;
        try {
            userInfo = (await this.getMeV1(`Bearer ${this.accessToken}`))?.data.result;
        } catch (error: any) {
            if (noReAuth) {
                throw error;
            }

            let errorCode = error.response?.data?.error.code;
            if (errorCode === APIErrorCode.ErrCodeInvalidJWT) {
                this.refreshAuth();
                return await this.getCurrentUserInfo(noReAuth = true);
            }

            throw error;
        }

        if (!userInfo) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to get user info");
        }

        this.role = userInfo.role;
        this.currentUserInfo = userInfo;
        return userInfo;
    }

    public async getUserInfo(userId: string): Promise<GetUserInfoResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let userInfo = (await this.getUserInfoV1(`Bearer ${this.accessToken}`, userId))?.data.result;
        if (!userInfo) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to get user info");
        }

        return userInfo
    }

    public async getExamInfo(examId: number): Promise<GetExamInfoResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let examInfo = (await this.examApi.getExamInfoV1(`Bearer ${this.accessToken}`, examId))?.data.result;
        if (!examInfo) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to get exam info");
        }

        return examInfo;
    }

    public async getExamParticipants(data: GetExamParticipantsData): Promise<GetExamParticipantsResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let examParticipants = (await this.examApi.getExamParticipantsV1(
            `Bearer ${this.accessToken}`, data))?.data.result;
        if (!examParticipants) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to get exam participants");
        }

        return examParticipants
    }

    public async getExamQuestions(data: GetExamQuestionsData): Promise<GetExamQuestionsResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        if (!this.isTeacherOrAdmin()) {
            data.pov = '';
        }

        let examQuestions = (await this.examApi.getExamQuestionsV1(`Bearer ${this.accessToken}`, data))?.data.result;
        if (!examQuestions) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to get exam questions");
        }

        return examQuestions;
    }

    /**
     * Gets the question options from the question info.
     * The question options are the options that the user can choose from.
     * @todo This method should be moved to a more appropriate place.
     * Perhaps dynamically load this from api in future?
     * @param questionInfo The question info.
     * @returns the question options.
     */
    public getQuestionOptions(questionInfo: ExamQuestionInfo): string[] {
        return [
            questionInfo.option1!,
            questionInfo.option2!,
            questionInfo.option3!,
            questionInfo.option4!,
        ];
    }

    public async getCourseInfo(courseId: number): Promise<GetCourseInfoResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let courseInfo = (await this.courseApi.getCourseInfoV1(`Bearer ${this.accessToken}`, courseId))?.data.result;
        if (!courseInfo) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to get course info");
        }

        return courseInfo;
    }

    /**
     * Checks if a certain field from a user can be edited or not.
     * @param fieldName The field name that we want to check.
     * @returns True if the field can be edited, false otherwise.
     */
    public canUserFieldBeEdited(fieldName: string): boolean {
        return fieldName !== "user_id" &&
            fieldName !== "role" &&
            fieldName !== "course_id";
    }

    public async editUser(newUserData: EditUserData): Promise<EditUserResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let createUserResult = (await this.editUserV1(`Bearer ${this.accessToken}`, newUserData))?.data.result;
        if (!createUserResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to create user");
        }

        return createUserResult;
    }

    public async changePassword(changePassData: ChangePasswordData): Promise<ChangePasswordResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let changePassResult = (await this.changePasswordV1(`Bearer ${this.accessToken}`, changePassData))?.data.result;
        if (!changePassResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to change password");
        }

        return changePassResult;
    }

    public async editCourse(courseData: EditCourseData): Promise<EditCourseResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        courseData.course_id = parseInt(courseData.course_id as any);
        if (isNaN(courseData.course_id)) {
            throw new Error("Invalid course ID");
        }

        courseData.topic_id = parseInt(courseData.topic_id as any);
        if (isNaN(courseData.topic_id)) {
            throw new Error("Invalid topic ID");
        }

        let editCourseResult = (await this.courseApi.editCourseV1(`Bearer ${this.accessToken}`, courseData))?.data.result;
        if (!editCourseResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to edit course");
        }

        return editCourseResult;
    }

    public async editExam(examData: EditExamData): Promise<EditExamResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        examData.exam_id = parseInt(examData.exam_id as any);
        if (isNaN(examData.exam_id)) {
            throw new Error("Invalid exam ID");
        }

        let editExamResult = (await this.examApi.editExamV1(`Bearer ${this.accessToken}`, examData))?.data.result;
        if (!editExamResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to edit exam");
        }

        return editExamResult;
    }

    public async participateExam(data: ParticipateExamData): Promise<ParticipateExamResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let participateExamResult = (await this.examApi.participateExamV1(
            `Bearer ${this.accessToken}`, data))?.data.result;
        if (!participateExamResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to participate exam");
        }

        return participateExamResult;
    }

    public async setExamScore(data: SetExamScoreData): Promise<SetExamScoreResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let setExamScoreResult = (await this.examApi.setExamScoreV1(
            `Bearer ${this.accessToken}`, data))?.data.result;
        if (!setExamScoreResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to set exam score");
        }

        return setExamScoreResult;
    }

    public async confirmAccount(confirmData: ConfirmAccountData): Promise<boolean> {
        let confirmResult = (await this.confirmAccountV1(confirmData))?.data.result;
        if (confirmResult === undefined) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to confirm account");
        }

        return confirmResult;
    }

    public async confirmChangePassword(confirmData: ConfirmChangePasswordData): Promise<boolean> {
        let confirmResult = (await this.confirmChangePasswordV1(confirmData))?.data.result;
        if (confirmResult === undefined) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to confirm change password");
        }

        return confirmResult
    }

    /**
     * Refreshes the access token using the refresh token.
     * @returns the auth result.
     */
    public async refreshAuth(): Promise<AuthResult> {
        let authResult = (await this.reAuthV1(`Bearer ${this.accessToken}`))?.data.result;
        if (!authResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to refresh auth");
        }

        this.accessToken = authResult.access_token;
        this.refreshToken = authResult.refresh_token;
        this.storeTokens();
        return authResult;
    }

    public async createNewUser(newUserData: CreateUserData): Promise<CreateUserResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        } else if (!this.canCreateTargetRole(newUserData.role ?? UserRole.UserRoleStudent)) {
            throw new Error("Cannot create this user");
        }

        let createUserResult = (await this.createUserV1(`Bearer ${this.accessToken}`, newUserData))?.data.result;
        if (!createUserResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to create user");
        }

        return createUserResult;
    }

    public async searchUser(searchUserData: SearchUserData): Promise<SearchUserResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let searchUserResult = (await this.searchUserV1(`Bearer ${this.accessToken}`, searchUserData))?.data.result;
        if (!searchUserResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to search user");
        }

        return searchUserResult;
    }

    public async searchCourse(searchCourseData: SearchCourseData): Promise<SearchCourseResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let searchCourseResult = (await this.courseApi.searchCourseV1(`Bearer ${this.accessToken}`, searchCourseData))?.data.result;
        if (!searchCourseResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to search course");
        }

        return searchCourseResult;
    }

    public async searchExam(searchExamData: SearchExamData): Promise<SearchExamResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let searchExamResult = (await this.examApi.searchExamV1(`Bearer ${this.accessToken}`, searchExamData))?.data.result;
        if (!searchExamResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to search exam");
        }

        return searchExamResult;
    }

    public async createNewTopic(data: CreateNewTopicData): Promise<CreateNewTopicResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let createTopicResult = (await this.topicApi.createTopicV1(`Bearer ${this.accessToken}`, data))?.data.result;
        if (!createTopicResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to create topic");
        }

        return createTopicResult;
    }

    public async searchTopic(data: SearchTopicData): Promise<SearchTopicResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let searchTopicResult = (await this.topicApi.searchTopicV1(`Bearer ${this.accessToken}`, data))?.data.result;
        if (!searchTopicResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to search topic");
        }

        return searchTopicResult;
    }

    public async deleteTopic(topicId: number): Promise<boolean> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        let deleteTopicResult = (await this.topicApi.deleteTopicV1(`Bearer ${this.accessToken}`, topicId))?.data.result;
        if (!deleteTopicResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to delete topic");
        }

        return deleteTopicResult;
    }

    public async createCourse(data: CreateCourseData): Promise<CreateCourseResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        if (typeof data.topic_id !== 'number') {
            if (canParseAsNumber(data.topic_id)) {
                data.topic_id = parseInt(data.topic_id as any);
            } else {
                throw new Error("Invalid topic ID");
            }
        }

        let createCourseResult = (await this.courseApi.createCourseV1(`Bearer ${this.accessToken}`, data))?.data.result;
        if (!createCourseResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to create course");
        }

        return createCourseResult;
    }

    public async createExam(data: CreateExamData): Promise<CreateExamResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        if (typeof data.course_id !== 'number') {
            if (canParseAsNumber(data.course_id)) {
                data.course_id = parseInt(data.course_id as any);
            } else {
                throw new Error("Invalid course ID");
            }
        }

        if (typeof data.duration !== 'number') {
            if (canParseAsNumber(data.duration)) {
                data.duration = parseInt(data.duration as any);
            } else {
                throw new Error("Invalid course ID");
            }
        }

        let createExamResult = (await this.examApi.createExamV1(
            `Bearer ${this.accessToken}`, data))?.data.result;
        if (!createExamResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to create exam");
        }

        return createExamResult;
    }

    public async createExamQuestion(data: CreateExamQuestionData): Promise<CreateExamQuestionResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        if (typeof data.exam_id !== 'number') {
            if (canParseAsNumber(data.exam_id)) {
                data.exam_id = parseInt(data.exam_id as any);
            } else {
                throw new Error("Invalid exam ID");
            }
        }

        let createExamQuestionResult = (await this.examApi.createExamQuestionV1(
            `Bearer ${this.accessToken}`, data))?.data.result;
        if (!createExamQuestionResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to create exam question");
        }

        return createExamQuestionResult;
    }

    public async answerExamQuestion(data: AnswerQuestionData): Promise<AnswerQuestionResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        if (typeof data.exam_id !== 'number') {
            if (canParseAsNumber(data.exam_id)) {
                data.exam_id = parseInt(data.exam_id as any);
            } else {
                throw new Error(`Invalid exam ID: ${data.exam_id}`);
            }
        }

        let answerQuestionResult = (await this.examApi.answerExamQuestionV1(
            `Bearer ${this.accessToken}`, data))?.data.result;
        if (!answerQuestionResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to answer question");
        }

        return answerQuestionResult;
    }

    public async editExamQuestion(data: EditExamQuestionData): Promise<EditExamQuestionResult> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        if (typeof data.exam_id !== 'number') {
            if (canParseAsNumber(data.exam_id)) {
                data.exam_id = parseInt(data.exam_id as any);
            } else {
                throw new Error("Invalid exam ID");
            }
        }

        if (typeof data.question_id !== 'number') {
            if (canParseAsNumber(data.question_id)) {
                data.question_id = parseInt(data.question_id as any);
            } else {
                throw new Error("Invalid question ID");
            }
        }

        let editExamQuestionResult = (await this.examApi.editExamQuestionV1(
            `Bearer ${this.accessToken}`, data))?.data.result;
        if (!editExamQuestionResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to edit exam question");
        }

        return editExamQuestionResult;
    }

    /**
     * Returns true if we are considered as "logged in" by the API client,
     * This method only checks if the access token is present, it doesn't
     * guarantee that the token is still valid, in case of token being invalid,
     * the client will first try to refresh the token, if it failed, the page itself 
     * should try to redirect the user to the login page.
     * @returns True if the user is logged in, false otherwise.
     */
    public isLoggedIn(): boolean {
        return this.accessToken !== undefined &&
            (this.accessToken?.length > 0 ?? false) &&
            this.refreshToken !== undefined &&
            (this.refreshToken?.length > 0 ?? false);
    }

    public isFieldEnum(fieldName: string): boolean {
        return fieldName === "role";
    }

    public isFieldDate(fieldName: string): boolean {
        return fieldName.endsWith("_at") || fieldName.endsWith("_date");
    }

    /**
     * Checks if the current logged-in user is the owner of the platform.
     * @returns True if the user is the owner of the platform.
     */
    public isOwner(): boolean {
        return this.role === UserRole.UserRoleOwner;
    }

    public isAdmin(): boolean {
        return this.role === UserRole.UserRoleAdmin;
    }

    public isTeacher(): boolean {
        return this.role === UserRole.UserRoleTeacher;
    }

    public isTeacherOrAdmin(): boolean {
        return this.isTeacher() || this.isOwner() || this.isAdmin();
    }

    public isStudent(): boolean {
        return this.role === UserRole.UserRoleStudent;
    }

    public canCreateNewUsers(): boolean {
        return this.isOwner() || this.isAdmin();
    }

    public canEditUserInfo(): boolean {
        return this.isOwner() || this.isAdmin();
    }

    public canChangeOthersPassword(): boolean {
        return this.isOwner() || this.isAdmin();
    }

    public canTryUsingPovExamFeature(): boolean {
        return this.isTeacherOrAdmin();
    }

    public canViewExamQuestionAnswers(examInfo: GetExamInfoResult | null | undefined): boolean {
        if (!examInfo) {
            return false;
        }

        return this.isAdmin() || this.isOwner() ||
            examInfo.created_by === this.getCurrentUserId();
    }

    public canSetExamScore(examInfo: GetExamInfoResult | null | undefined): boolean {
        if (!examInfo) {
            return false;
        }
        
        return this.isAdmin() || this.isOwner() ||
            examInfo.created_by === this.getCurrentUserId();
    }

    public canSearchUser(): boolean {
        return this.isOwner() || this.isAdmin();
    }

    public canCreateTopics(): boolean {
        return this.isOwner() || this.isAdmin();
    }

    public canCreateExams(): boolean {
        return this.isTeacherOrAdmin();
    }

    public canViewExamInfo(): boolean {
        return this.isLoggedIn();
    }

    public canSearchTopics(): boolean {
        return this.isLoggedIn();
    }

    public canCreateTargetRole(targetRole: UserRole): boolean {
        if (targetRole === UserRole.UserRoleOwner ||
            UserRole.UserRoleUnknown) {
            return false;
        }

        if (this.isOwner()) {
            // the owner can create any role
            return true;
        }

        if (this.isAdmin()) {
            return targetRole !== UserRole.UserRoleAdmin;
        }

        return false;
    }

    public logout(): void {
        this.clearTokens();
    }
}

const apiClient = new ExamSphereAPIClient();

export default apiClient;
