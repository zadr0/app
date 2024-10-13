export const commands = new Map();
export function createCommand(cmd) {
    commands.set(cmd.name, {
        execute: cmd.execute.bind(cmd),
        mod: cmd.moderation || false
    });
}
