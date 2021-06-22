"use strict";
const express_1 = require("express");
const router = express_1.Router();
router.get("/", (req, res, next) => {
    res.send("tests");
});
module.exports = router;
//# sourceMappingURL=index.js.map