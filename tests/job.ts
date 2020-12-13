// Import the dependencies for testing
import * as chai from "chai";
// @ts-ignore
import chaiHttp from "chai-http";
import "mocha";

// Configure chai
chai.use(chaiHttp);

import app from "../src/server";

describe("Job API", () => {
    describe("POST v1/job/", () => {
        it("should start a job and trigger the microservices to work on the job", (done) => {
            chai.request(app)
                .post("v1/job/")
                .type("form")
                .send({
                    "_method": "post",
                    "job": {
                        "designName": "spm"
                    }
                }).end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    // describe("GET v1/beer/:userid", () => {
    //     it("should instantiate a beer order so that the Montroyashi knows who gets drunk", (done) => {
    //         chai.request(app)
    //             .get(`v1/beer/${userid}`)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 // res.body.should.be.a('object');
    //                 done();
    //             });
    //     });
    // });
});
