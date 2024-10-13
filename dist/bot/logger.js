/* eslint-disable @typescript-eslint/no-explicit-any */ import chalk from 'chalk';
export var LogLevels;
(function(LogLevels) {
    LogLevels[LogLevels["Debug"] = 0] = "Debug";
    LogLevels[LogLevels["Info"] = 1] = "Info";
    LogLevels[LogLevels["Warn"] = 2] = "Warn";
    LogLevels[LogLevels["Error"] = 3] = "Error";
    LogLevels[LogLevels["Fatal"] = 4] = "Fatal";
})(LogLevels || (LogLevels = {}));
const prefixes = new Map([
    [
        0,
        'DEBUG'
    ],
    [
        1,
        'INFO'
    ],
    [
        2,
        'WARN'
    ],
    [
        3,
        'ERROR'
    ],
    [
        4,
        'FATAL'
    ]
]);
const noColor = (msg)=>msg;
const colorFunctions = new Map([
    [
        0,
        chalk.gray
    ],
    [
        1,
        chalk.cyan
    ],
    [
        2,
        chalk.yellow
    ],
    [
        3,
        (str)=>chalk.red(str)
    ],
    [
        4,
        (str)=>chalk.red.bold.italic(str)
    ]
]);
export function createLogger({ logLevel = 1, name } = {}) {
    function log(level, ...args) {
        if (level < logLevel) return;
        let color = colorFunctions.get(level);
        if (!color) color = noColor;
        const date = new Date();
        const log1 = [
            `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`,
            color(prefixes.get(level) ?? 'DEBUG'),
            name ? `${name} >` : '>',
            ...args
        ];
        switch(level){
            case 0:
                return console.debug(...log1);
            case 1:
                return console.info(...log1);
            case 2:
                return console.warn(...log1);
            case 3:
                return console.error(...log1);
            case 4:
                return console.error(...log1);
            default:
                return console.log(...log1);
        }
    }
    function setLevel(level) {
        logLevel = level;
    }
    function debug(...args) {
        log(0, ...args);
    }
    function info(...args) {
        log(1, ...args);
    }
    function warn(...args) {
        log(2, ...args);
    }
    function error(...args) {
        log(3, ...args);
    }
    function fatal(...args) {
        log(4, ...args);
    }
    return {
        log,
        setLevel,
        debug,
        info,
        warn,
        error,
        fatal
    };
}
export const logger = createLogger({
    name: 'Main'
});
export default logger;
