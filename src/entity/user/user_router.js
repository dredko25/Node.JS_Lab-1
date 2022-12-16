import { findById, createUser } from './user_controller.js';

class UserRouter {
    GET(...args) {
        return findById(...args);
    }
    POST(...args) {
        console.log(args);
        return createUser(...args);
    }
}

export default new UserRouter();
