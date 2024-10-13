import { bot } from "../bot.js";
import { createCommand } from "../functions/loadEb.js";
import logger from "../logger.js";
import { PunishManager } from "../task/UpdatePunish.js";
createCommand({
    name: `unmute`,
    description: ``,
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
        var target = msg.reply_to_message?.from;
        var reason = argums.slice(0);
        if (!target) {
            try {
                const member = await bot.getChatMember(msg.chat.id, Number(argums[0]));
                if (member.can_send_messages) {
                    return await bot.sendMessage(msg.chat.id, `Пользователь не в муте!`, {
                        reply_to_message_id: msg.message_id
                    });
                }
                ;
                target = member.user;
                reason = argums.slice(1);
            } catch (x) {
                if (x?.response?.statusCode === 400) {
                    return await bot.sendMessage(msg.chat.id, `Не нашлось пользователя!`, {
                        reply_to_message_id: msg.message_id
                    });
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
            await bot.sendMessage(msg.chat.id, `Пользователь являеться ботом!`, {
                reply_to_message_id: msg.message_id
            });
            return;
        }
        ;
        const strReason = reason.join(' ') || "Причина не указана";
        const res = await PunishManager.UnmuteUser(target.id, msg.chat.id, strReason);
        await bot.sendMessage(msg.chat.id, ` Пользователь был размьючен на по причине: ${strReason}`, {
            reply_to_message_id: msg.message_id
        });
    }
});
