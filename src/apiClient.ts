
import { 
    UserApi, 
    Configuration as APIConfiguration,
    UserHandlersLoginData as LoginData,
    UserHandlersLoginResult as LoginResult,
    UserHandlersMeResult as GetMeResult,
} from './api';

class ExamSphereAPIClient extends UserApi {
    public clientRId: string;
    public lastCaptchaId: string | undefined = undefined;

    public accessToken: string | undefined = undefined;
    public refreshToken: string | undefined = undefined;

    constructor() {
        super();
        this.guessBasePath();
        this.clientRId = this.generateClientRId();

        this.accessToken = localStorage.getItem('ExamSphere_accessToken') ?? undefined;
        this.refreshToken = localStorage.getItem('ExamSphere_refreshToken') ?? undefined;
    }

    private generateClientRId(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = Math.floor(Math.random() * (16 - 8 + 1)) + 8;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    public guessBasePath() {
        // try to find out the base path
        let correctBasePath = "http://localhost:8080";
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

    public async getCaptchaImage() : Promise<string> {
        let captchaResult = await this.generateCaptchaV1(this.clientRId);
        if (!captchaResult?.data?.result?.captcha) {
            throw new Error("Failed to get captcha image");
        }

        this.lastCaptchaId = captchaResult?.data?.result?.captcha_id;
        return captchaResult?.data?.result?.captcha;
    }

    public async loginWithPass(loginData: LoginData) : Promise<LoginResult> {
        let loginResult = (await this.loginV1(loginData))?.data.result;
        if (!loginResult) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to login");
        }

        this.accessToken = loginResult.access_token;
        this.refreshToken = loginResult.refresh_token;
        localStorage.setItem('ExamSphere_accessToken', this.accessToken!);
        localStorage.setItem('ExamSphere_refreshToken', this.refreshToken!);
        return loginResult;
    }

    // Gets the current user's information
    public async getCurrentUserInfo(): Promise<GetMeResult> {
        let userInfo = (await this.getMeV1(`Bearer ${this.accessToken}`))?.data.result;
        if (!userInfo) {
            // we shouldn't reach here, because if there is an error somewhere,
            // it should have already been thrown by the API client
            throw new Error("Failed to get user info");
        }

        return userInfo;
    }
}

const apiClient = new ExamSphereAPIClient();

export default apiClient;
