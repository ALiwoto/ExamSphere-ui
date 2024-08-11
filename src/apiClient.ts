
import { UserApi, Configuration as APIConfiguration } from './api';

const apiClient = new UserApi(new APIConfiguration({
    basePath: 'http://localhost:8080',
}))

export default apiClient;
