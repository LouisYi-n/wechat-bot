"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config.js");
const wechaty_1 = require("wechaty");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
function onScan(qrcode, status) {
    if (status === wechaty_1.ScanStatus.Waiting || status === wechaty_1.ScanStatus.Timeout) {
        const qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(qrcode),
        ].join('');
        wechaty_1.log.info('StarterBot', 'onScan: %s(%s) - %s', wechaty_1.ScanStatus[status], status, qrcodeImageUrl);
        qrcode_terminal_1.default.generate(qrcode, { small: true }); // show qrcode on console
    }
    else {
        wechaty_1.log.info('StarterBot', 'onScan: %s(%s)', wechaty_1.ScanStatus[status], status);
    }
}
function onLogin(user) {
    wechaty_1.log.info('StarterBot', '%s login', user);
}
function onLogout(user) {
    wechaty_1.log.info('StarterBot', '%s logout', user);
}
function onMessage(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        wechaty_1.log.info('StarterBot', msg.toString());
        if (msg.text() === 'ding') {
            yield msg.say('dong');
        }
    });
}
const bot = wechaty_1.WechatyBuilder.build({
    name: 'ding-dong-bot',
});
bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);
bot.start()
    .then(() => wechaty_1.log.info('StarterBot', 'Starter Bot Started.'))
    .catch(e => wechaty_1.log.error('StarterBot', e));
