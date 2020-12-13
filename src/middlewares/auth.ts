import { logger, statusCode } from "../utils";
import { Firebase } from "../services";

const authMiddleware = (req, res, next) => {
    return Firebase.getInstance().admin.auth().verifyIdToken(req.headers.authorization)
        .then(function (decodedToken) {
            req.userUUID = decodedToken.uid;
            return next();
        }).catch(function (error) {
            logger.info(error);
            return res.status(statusCode.UNAUTHORIZED_401).send("Failed to authenticate your request");
        });

};

export default authMiddleware;
