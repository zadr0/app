import schedule from "node-schedule";
import { Op } from "sequelize";
import { models } from "../../database/sequalize.js";
import { bot } from "../bot.js";
import logger from "../logger.js";
import { condition as cond } from './condition.js';
export var PunishManager;
(function(PunishManager) {
    PunishManager.jobs = new Map();
    async function Initilize() {
        const mutes = await models.ModModel.findAll({
            where: {
                punish: 'mute'
            }
        });
        mutes.forEach((mute)=>scheduleMute(mute));
    }
    PunishManager.Initilize = Initilize;
    function scheduleMute(Punish) {
        const job = schedule.scheduleJob(Punish.expired, ()=>UnmuteUser(Number(Punish.userId), Number(Punish.chatId)));
        PunishManager.jobs.set(Punish.userId, job);
    }
    PunishManager.scheduleMute = scheduleMute;
    async function UnmuteUser(id, chatId, reason = 'system') {
        try {
            await bot.restrictChatMember(chatId, id, {
                can_send_messages: true
            });
            const res = await models.ModModel.findOne({
                where: {
                    userId: id,
                    punish: 'mute',
                    expired: {
                        [Op.gt]: Date.now()
                    }
                }
            });
            if (res) {
                await res.destroy();
            }
            ;
            PunishManager.jobs.delete(id.toString());
            logger.info(`Пользователь: ${id} был размучен по причине: ${reason}`);
        } catch (x) {
            switch(x?.response?.statusCode){
                case 400:
                    PunishManager.jobs.delete(id.toString());
                    break;
                default:
                    logger.error(x);
                    break;
            }
        }
        ;
    }
    PunishManager.UnmuteUser = UnmuteUser;
    async function GetPunishes(id) {
        try {
            const mds = await models.ModModel.findAll({
                where: {
                    userId: id
                }
            });
            return mds;
        } catch (x) {
            logger.error(x);
        }
    }
    PunishManager.GetPunishes = GetPunishes;
    async function ClearWarn(id) {
        try {
            const res = await models.ModModel.destroy({
                where: {
                    EventId: id
                }
            });
            return res;
        } catch (x) {
            logger.error(x);
        }
    }
    PunishManager.ClearWarn = ClearWarn;
    async function MuteUser(id, chatId, time, reason = 'причина не указана', moderator) {
        try {
            await bot.restrictChatMember(chatId, id, {
                can_send_messages: false
            });
            const parse = new Date();
            parse.setSeconds(parse.getSeconds() + time);
            const md = await models.ModModel.create({
                userId: id,
                expired: parse,
                punish: 'mute',
                chatId: chatId,
                reason: reason,
                moderator: moderator?.id || 'system'
            });
            const res = await SaveCondition(id, 'mute', chatId);
            if (!res) {
                if (PunishManager.jobs.has(id.toString())) return;
                const job = schedule.scheduleJob(md.expired, ()=>UnmuteUser(id, chatId));
                PunishManager.jobs.set(id.toString(), job);
            }
            ;
            logger.info(`Пользователь: ${id} был замучен по причине: ${reason}`);
            return md;
        } catch (x) {
            switch(x?.response?.statusCode){
                case 400:
                    logger.warn(`Не получилось замутить указанного участника!`);
                    break;
                default:
                    logger.error(x);
                    break;
            }
            ;
        }
    }
    PunishManager.MuteUser = MuteUser;
    async function BanUser(id, chatId, until, reason = 'причина не указана') {
        try {
            await bot.banChatMember(chatId, id, {
                until_date: until
            });
            logger.info(`Пользователь: ${id} был забанен по причине: ${reason}`);
        } catch (x) {
            switch(x?.response?.statusCode){
                case 400:
                    logger.warn(`Чат не являеться группой!`);
                    break;
                default:
                    logger.error(x);
                    break;
            }
            ;
        }
        ;
    }
    PunishManager.BanUser = BanUser;
    async function WarnUser(id, chatId, time, reason = 'причина не указана', moderator) {
        logger.info(`Пользователь: ${id} получил предупреждение по причине: ${reason}`);
        const md = await models.ModModel.create({
            userId: id,
            expired: time,
            punish: 'warn',
            chatId: chatId,
            reason: reason,
            moderator: moderator?.id || `system`
        });
        const res = await SaveCondition(id, 'warn', chatId);
        return md;
    }
    PunishManager.WarnUser = WarnUser;
    async function SaveCondition(id, where, chatId) {
        const conditions = cond[where];
        const summary = await models.ModModel.findAll({
            where: {
                userId: id.toString(),
                punish: where,
                expired: {
                    [Op.gt]: new Date()
                }
            }
        });
        switch(where){
            case "warn":
                const summaryWarns = await reduxWarns(summary?.length);
                for(const condition in conditions){
                    if (Number(condition) !== summaryWarns) continue;
                    const c = conditions[summaryWarns];
                    await MuteUser(id, chatId, c.time, `#${summaryWarns} предупреждение`);
                    return true;
                }
                ;
                return false;
            case "mute":
                var until_date = Date.now();
                const summaryMutes = await reduxMutes(summary?.length);
                for(const condition in conditions){
                    if (Number(condition) !== summaryMutes) continue;
                    const c = conditions[summaryMutes];
                    await BanUser(id, chatId, until_date + c, `#${summaryMutes} мутов`);
                    return true;
                }
                ;
                return false;
            default:
                return false;
        }
        ;
    }
    PunishManager.SaveCondition = SaveCondition;
})(PunishManager || (PunishManager = {}));
async function reduxWarns(num) {
    let res = num;
    while(res > 7){
        res -= 7;
    }
    ;
    return res;
}
async function reduxMutes(num) {
    let res = num;
    while(res > 10){
        res -= 10;
    }
    ;
    return res;
}
