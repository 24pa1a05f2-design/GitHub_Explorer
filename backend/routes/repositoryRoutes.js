import express from "express";
import { details, issues, languages, search } from "../controllers/repositoryController.js";

const router = express.Router();

router.get("/search", search);
router.get("/:owner/:repo/languages", languages);
router.get("/:owner/:repo/issues", issues);
router.get("/:owner/:repo", details);

export default router;

