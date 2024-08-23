
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
} from './api';
import { canParseAsNumber } from './utils/textUtils';

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
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = Math.floor(Math.random() * (16 - 8 + 1)) + 8;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
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

    /**
     * Stores the access and refresh tokens in the local storage.
     * In the future, if we want to add some algorithms for token encryption
     * or security, we can add it in this method.
     */
    private storeTokens(): void {
        localStorage.setItem('ExamSphere_accessToken', this.accessToken!);
        localStorage.setItem('ExamSphere_refreshToken', this.refreshToken!);
    }

    /**
     * Clears the access and refresh tokens from the local storage.
     */
    public clearTokens(): void {
        localStorage.removeItem('ExamSphere_accessToken');
        localStorage.removeItem('ExamSphere_refreshToken');
        this.accessToken = undefined;
        this.refreshToken = undefined
    }

    /**
     * Reads the access and refresh tokens from the local storage.
     * In the future, if we want to add some algorithms for token decryption
     * or security, we can add it in this method.
     */
    private readTokens(): void {
        this.accessToken = localStorage.getItem('ExamSphere_accessToken') ?? undefined;
        this.refreshToken = localStorage.getItem('ExamSphere_refreshToken') ?? undefined
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

    public async confirmAccount(confirmData: ConfirmAccountData): Promise<boolean> {
        let confirmResult = (await this.confirmAccountV1(confirmData))?.data.result;
        if (confirmResult === undefined) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to confirm account");
        }

        return confirmResult;
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

        let createExamResult = (await this.examApi.createExamV1(`Bearer ${this.accessToken}`, data))?.data.result;
        if (!createExamResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to create exam");
        }

        return createExamResult;
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

    public isStudent(): boolean {
        return this.role === UserRole.UserRoleStudent;
    }

    public canCreateNewUsers(): boolean {
        return this.isOwner() || this.isAdmin();
    }

    public canSearchUser(): boolean {
        return this.isOwner() || this.isAdmin();
    }

    public canCreateTopics(): boolean {
        return this.isOwner() || this.isAdmin();
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
