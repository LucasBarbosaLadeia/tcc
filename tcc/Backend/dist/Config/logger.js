"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_loki_1 = __importDefault(require("winston-loki"));
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        }),
        new winston_loki_1.default({
            host: 'http://loki:3100',
            labels: { service: "backend" },
            json: true,
            format: winston_1.default.format.json(),
            replaceTimestamp: true,
            onConnectionError: (error) => console.error(error),
        })
    ]
});
exports.logger = logger;
//# sourceMappingURL=logger.js.map