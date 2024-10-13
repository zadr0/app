export const condition = {
    "warn": {
        3: {
            time: 90 * 60,
            reset: false
        },
        7: {
            time: 3 * 60 * 60,
            reset: true
        }
    },
    "mute": {
        3: 24 * 60 * 60,
        5: 3 * 24 * 60 * 60,
        7: 7 * 24 * 60 * 60,
        10: 14 * 24 * 60 * 60
    }
};
