import * as express from "express";
import middleware from "../middlewares";
import {
    jobController,
    jobCancelController,
    jobDeleteController,
    jobGetController,
    jobsGetController,
    jobReportGetController,
    jobDownloadGetController
} from "../controllers";

const router = express.Router();

router.post("/v1/job/", middleware.authMiddleware, jobController);
router.post("/v1/job/:jobId/cancel/", middleware.authMiddleware, jobCancelController);
router.post("/v1/job/:jobId/delete/", middleware.authMiddleware, jobDeleteController);

router.get("/v1/job/", middleware.authMiddleware, jobsGetController);
router.get("/v1/job/:jobId", middleware.authMiddleware, jobGetController);
router.get("/v1/job/:jobId/:runId/download", middleware.authMiddleware, jobDownloadGetController);
router.get("/v1/job/:jobId/report", middleware.authMiddleware, jobReportGetController);

export default router;
