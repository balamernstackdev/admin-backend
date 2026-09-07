"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController = __importStar(require("../controllers/task.controller"));
const adminController = __importStar(require("../controllers/admin.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
// All admin routes require auth + admin role
router.use(auth_middleware_1.authenticate, auth_middleware_1.requireAdmin);
// Analytics
router.get('/analytics', adminController.getAnalytics);
// Task Management
router.get('/tasks', taskController.getAdminTasks);
router.post('/tasks', (0, validate_middleware_1.validate)(validators_1.createTaskSchema), taskController.createTask);
router.get('/tasks/:id', taskController.getTask);
router.put('/tasks/:id', (0, validate_middleware_1.validate)(validators_1.updateTaskSchema), taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
// Task Links
router.post('/tasks/:id/links', (0, validate_middleware_1.validate)(validators_1.taskLinkSchema), taskController.addLink);
router.put('/tasks/:id/links/:linkId', taskController.updateLink);
router.delete('/tasks/:id/links/:linkId', taskController.deleteLink);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map