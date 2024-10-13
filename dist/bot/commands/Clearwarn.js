import { bot } from "../bot.js";
import { createCommand } from "../functions/loadEb.js";
import { PunishManager } from "../task/UpdatePunish.js";
createCommand({
    name: `remove_warn`,
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
        const id = Number(argums.shift());
        if (!id) {
            await bot.sendMessage(msg.chat.id, `Не нашлось аргументов!`, {
                reply_to_message_id: msg.message_id
            });
            return;
        }
        const res = await PunishManager.ClearWarn(id);
        if (!res) {
            await bot.sendMessage(msg.chat.id, `Таких id не нашлось!`, {
                reply_to_message_id: msg.message_id
            });
            return;
        }
        ;
        await bot.sendMessage(msg.chat.id, `Предупреждение #${id} было успешно снято!`, {
            reply_to_message_id: msg.message_id
        });
    }
});
