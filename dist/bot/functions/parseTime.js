import logger from "../logger.js";
export default function parseDuration(duration) {
    const units = {
        'д': 86400,
        'ч': 3600,
        'м': 60,
        'с': 1
    };
    let seconds = 0;
    const regex = /(\d+)\s*([дчмс])/gi;
    let match;
    while((match = regex.exec(duration)) !== null){
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        if (!units[unit]) {
            logger.error(`Error parse time ${unit}`);
        }
        ;
        seconds += value * units[unit];
    }
    return seconds;
}
