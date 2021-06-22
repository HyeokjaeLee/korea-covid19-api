"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const graphql_1 = __importDefault(require("./routes/graphql"));
const exp = express_1.default();
exp.listen(process.env.PORT || 8080, () => {
    console.log("Server listening on port 8080");
});
exp.use("/", graphql_1.default);
//# sourceMappingURL=app.js.map