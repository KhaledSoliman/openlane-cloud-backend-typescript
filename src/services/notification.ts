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
                user: "no-reply@openlane-cloud.com",
                pass: process.env.MAILER_PASS
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
            from: "no-reply@openlane-cloud.com",
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
