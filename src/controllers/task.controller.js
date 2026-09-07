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
exports.deleteLink = exports.updateLink = exports.addLink = exports.deleteTask = exports.updateTask = exports.createTask = exports.completeTask = exports.getTask = exports.getAdminTasks = exports.getTasks = void 0;
const taskService = __importStar(require("../services/task.service"));
const getTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const result = await taskService.getTasks({
            page, limit,
            search: req.query.search,
            platform: req.query.platform,
            status: req.query.status,
            sort: req.query.sort,
            order: req.query.order,
            adminView: false,
        });
        return res.json({ success: true, ...result });
    }
    catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
exports.getTasks = getTasks;
const getAdminTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const result = await taskService.getTasks({
            page, limit,
            search: req.query.search,
            platform: req.query.platform,
            status: req.query.status,
            sort: req.query.sort,
            order: req.query.order,
            adminView: true,
        });
        return res.json({ success: true, ...result });
    }
    catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
exports.getAdminTasks = getAdminTasks;
const getTask = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        return res.json({ success: true, data: task });
    }
    catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
exports.getTask = getTask;
const completeTask = async (req, res) => {
    try {
        const { anonymousSessionId, ipHash, userAgentHash } = req.body;
        if (!anonymousSessionId) {
            return res.status(400).json({ success: false, message: 'anonymousSessionId is required' });
        }
        await taskService.completeTask(req.params.id, anonymousSessionId, ipHash, userAgentHash);
        return res.json({ success: true, message: 'Task completed successfully' });
    }
    catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
exports.completeTask = completeTask;
const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body, req.user.id);
        return res.status(201).json({ success: true, data: task });
    }
    catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);
        return res.json({ success: true, data: task });
    }
    catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        await taskService.deleteTask(req.params.id);
        return res.json({ success: true, message: 'Task deleted' });
    }
    catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
exports.deleteTask = deleteTask;
const addLink = async (req, res) => {
    try {
        const link = await taskService.addTaskLink(req.params.id, req.body);
        return res.status(201).json({ success: true, data: link });
    }
    catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
exports.addLink = addLink;
const updateLink = async (req, res) => {
    try {
        const link = await taskService.updateTaskLink(req.params.linkId, req.body);
        return res.json({ success: true, data: link });
    }
    catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
exports.updateLink = updateLink;
const deleteLink = async (req, res) => {
    try {
        await taskService.deleteTaskLink(req.params.linkId);
        return res.json({ success: true, message: 'Link deleted' });
    }
    catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
exports.deleteLink = deleteLink;
//# sourceMappingURL=task.controller.js.map