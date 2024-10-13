import { bot } from "../bot.js";
import parseDuration from "../functions/parseTime.js";
import { createCommand } from "../functions/loadEb.js";
import logger from "../logger.js";
import { PunishManager } from "../task/UpdatePunish.js";
createCommand({
    name: `warn`,
    description: `кома`,
    moderation: true,
    async execute (msg, argums) {
        if (!argums) {
            await bot.sendMessage(msg.chat.id, `Не нашлось аргументов!`, {
                reply_to_message_id: msg.message_id
            });
            return;
        }
        ;
        if (!msg.from) {
            await bot.sendMessage(msg.chat.id, `Вы кто?`, {
                reply_to_message_id: msg.message_id
            });
            return;
        }
        ;
        var time = argums[0];
        var target = msg.reply_to_message?.from;
        var reason = argums.slice(1);
        const options = {
            reply_to_message_id: msg.message_id
        };
        if (!time) {
            await bot.sendMessage(msg.chat.id, `Ошибка аргумента времени!`, options);
            return;
        }
        ;
        if (!target) {
            try {
                target = (await bot.getChatMember(msg.chat.id, Number(argums[1]))).user;
                reason = argums.slice(2);
            } catch (x) {
                if (x?.response?.statusCode === 400) {
                    return await bot.sendMessage(msg.chat.id, `Не нашлось пользователя!`, options);
                } else {
                    logger.error(x);
                    return;
                }
                ;
            }
            ;
        }
        ;
        if (target.is_bot) {
            await bot.sendMessage(msg.chat.id, `Пользователь являеться ботом!`, options);
            return;
        }
        ;
        time = parseDuration(time);
        if (!time || Number.isNaN(time)) {
            await bot.sendMessage(msg.chat.id, `Ошибка парсивования времени!`, options);
            return;
        }
        ;
        const parse = new Date();
        parse.setSeconds(parse.getSeconds() + time);
        const strReason = reason.join(' ') || "Причина не указана";
        const md = await PunishManager.WarnUser(target.id, msg.chat.id, parse, strReason, msg.from);
        await bot.sendMessage(msg.chat.id, `#${md?.EventId} Пользователю @${target?.username} успешно выдано предупреждение на: ${time} sec, по причине: ${strReason}`, {
            reply_to_message_id: msg.message_id
        });
    }
});
