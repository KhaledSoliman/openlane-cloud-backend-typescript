import * as nodeMailer from "nodemailer";
import { MicroService, logger } from "../utils";

export default class Notification extends MicroService {
    public static notification;
    private transporter: nodeMailer.Transporter;

    constructor() {
        super();
        this.transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: "kingsonlineforsoftware@gmail.com",
                pass: "Walid112358@"
            }
        });

    }

    public static async getInstance(): Promise<Notification> {
        if (!this.notification) {
            this.notification = new Notification();
            await this.notification.init("notification", ["notification-out"], ["notification-in"]);
            return this.notification;
        }
        return this.notification;
    }


    sendMail(receiver, subject, body) {
        const mailOptions = {
            from: "khaledsoli111@gmail.com",
            to: receiver,
            subject: subject,
            text: body
        };
        this.transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error(error);
            } else {
                logger.info("Email sent: " + info.response);
            }
        });
    }

    sendPushNotification(title, body, token) {
        // const message = {
        //     notification: {
        //         title: title,
        //         body: body
        //     },
        //     token: token
        // };
        // admin.messaging().send(message)
        //     .then((response) => {
        //         logger.info('Successfully sent message:', response);
        //     })
        //     .catch((error) => {
        //         logger.error('Error sending message:', error);
        //     });
    }

}
