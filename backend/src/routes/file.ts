import express from "express";
import multer from "multer";
import env from "../utils/env";

const fileRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname .split('.')
    .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
    .slice(1)
    .join('.')
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload a file
 *     tags:
 *       - File
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: http://localhost:3000/public/1700000000000.png
 *       400:
 *         description: No file uploaded
 */

fileRouter.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" });
  }

  const port = env.NODE_ENV !== 'production' ? env.PORT : env.HTTPS_PORT;
  const base = `${env.BASE_DOMAIN}:${port}/`;
  const url = base + req.file.path.replace(/\\/g, "/");

  res.status(200).send({ url });
});

export = fileRouter;
