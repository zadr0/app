import { bot } from "../bot.js";
import { createCommand } from "../functions/loadEb.js";
import { PunishManager } from "../task/UpdatePunish.js";
import logger from "../logger.js";
createCommand({
    name: `mod_log`,
    description: ``,
    moderation: true,
    async execute (msg, argums) {
        if (!msg.from) {
            await bot.sendMessage(msg.chat.id, `Вы кто?`, {
                reply_to_message_id: msg.message_id
            });
            return;
        }
        ;
        var target = msg.reply_to_message?.from;
        if (!target) {
            try {
                target = (await bot.getChatMember(msg.chat.id, Number(argums?.[0]))).user;
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
        const punishes = await PunishManager.GetPunishes(target.id);
        if (!punishes) {
            await bot.sendMessage(msg.chat.id, `Не нашлось настоящих записей!`, {
                reply_to_message_id: msg.message_id
            });
            return;
        }
        const warns = punishes.filter((push)=>push.punish === 'warn');
        const mutes = punishes.filter((push)=>push.punish === 'mute');
        var warnsString = warns.length > 0 ? `${warns.length} - Предупреждения \n\n` + warns.map((warn, index)=>`${index + 1} - Предупреждение \n- EventId: ${warn.EventId} \n- Причина: ${warn.reason}`).join('\n') : 'Предупреждений не нашлось!';
        var mutesString = mutes.length > 0 ? `${mutes.length} - Муты \n\n` + mutes.map((mute, index)=>`${index + 1} - Мут \n- EventId: ${mute.EventId}\n- Причина: ${mute.reason} `).join('\n') : 'Мутов не нашлось!';
        await bot.sendMessage(msg.chat.id, warnsString + '\n\n' + mutesString, {
            reply_to_message_id: msg.message_id
        });
    }
});
