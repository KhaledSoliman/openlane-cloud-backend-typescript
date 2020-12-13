import * as admin from "firebase-admin";
import { app } from "firebase-admin/lib/firebase-namespace-api";

export default class Firebase {
    public static firebase;
    private readonly _admin: app.App;

    constructor() {
        this._admin = admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    }

    public static getInstance(): Firebase {
        if (!this.firebase) {
            this.firebase = new Firebase();
            return this.firebase;
        }
        return this.firebase;
    }


    get admin(): app.App {
        return this._admin;
    }
}
