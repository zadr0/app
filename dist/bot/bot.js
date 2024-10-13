import Teleg from "node-telegram-bot-api";
import "dotenv/config";
import loader from "./loader.js";
import schedule from "node-schedule";
import { PunishManager } from "./task/UpdatePunish.js";
export const bot = new Teleg(process.env.BOT_TOKEN, {
    polling: true
});
(async ()=>{
    await loader();
    await PunishManager.Initilize();
})();
process.on('SIGINT', ()=>{
    schedule.gracefulShutdown().then(()=>{
        process.exit(0);
    });
});
