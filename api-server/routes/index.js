import express from "express";

const router = express.Router();

router.get("/stats", (req, res) => {
  res.send({
    msg: "stats get route",
  });
});

export { router };
