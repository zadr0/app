import fs from "fs";
import path from "path";
import logger from "./logger.js";
export default (async function loadReq() {
    let res;
    for await (const i of [
        "/commands/",
        "/events/"
    ]){
        res = fs.readdirSync(path.join(process.cwd(), 'dist/bot', i));
        res.forEach(async (file)=>{
            await import(`.${i}/${file}`).catch((x)=>{
                logger.error(x);
            });
        });
        logger.info(`${res} from Dir ${i} Loaded!`);
    }
    ;
});
