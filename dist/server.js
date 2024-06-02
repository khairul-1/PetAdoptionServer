"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
let server;
function main() {
    server = app_1.default.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    });
}
main();
