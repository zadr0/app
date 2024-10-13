import { bot } from "../bot.js";
import logger from "../logger.js";
import { commands } from "../functions/loadEb.js";
import "node-telegram-bot-api";
bot.on('text', async (ctx)=>{
    const res = ctx.text;
    if (!res) return;
    try {
        const args = res.split(/ /g);
        const member = await bot.getChatMember(ctx.chat.id, ctx.from?.id);
        switch(true){
            case res.startsWith("/"):
                {
                    const commandString = args.shift()?.toLowerCase().slice(1);
                    const command = commands.get(commandString || "");
                    if (!command) return;
                    if (command.mod && ![
                        'creator',
                        'administrator'
                    ].includes(member.status)) {
                        logger.info(member);
                        return;
                    }
                    ;
                    await command.execute(ctx, args);
                    break;
                }
                ;
            case ctx?.is_automatic_forward:
                {
                    await bot.sendMessage(ctx.chat.id, `Незнание <a href="https://telegra.ph/Pravila-Its-Bro-chata-10-09">правил</a> не освобождает от наказания!`, {
                        reply_to_message_id: ctx.message_id,
                        parse_mode: 'HTML'
                    });
                    break;
                }
                ;
            default:
                {
                    if (ctx.entities?.find((val)=>val.type === 'url') && ![
                        'creator',
                        'administator'
                    ].includes(member.status)) {
                        logger.info(`Пользователь ${ctx.from?.id} попался на ссылка!`);
                        try {
                            await bot.deleteMessage(ctx.chat.id, ctx.message_id);
                        } catch (x) {
                            logger.warn(`Не удалось удалить сообщение!`);
                        }
                        ;
                    }
                    break;
                }
                ;
        }
    } catch (x) {
        switch(x.response.code){
            case 400:
                {
                    logger.warn(`Не нашлось сообщения/пользователя или не удалось удалить!`);
                    break;
                }
            default:
                {
                    logger.error(x);
                    break;
                }
        }
    }
});
