import express from "express";
import multer from "multer";
import env from "../utils/env";

const fileRouter = express.Router();

const base = env.BASE_DOMAIN + ":" + env.PORT + "/";

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

fileRouter.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" });
  }

  const url = base + req.file.path;
  console.log("router.post(/file): " + url);

  res.status(200).send({ url });
});

export = fileRouter;
