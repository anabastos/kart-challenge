import chalk from 'chalk';
const log = console.log;

const bgYellow = text => log(chalk.white.bgYellow.bold(text));
const error = text => log(chalk.red.bold(text));
const keyValueLog = (key, value) => log(chalk`{bold ${key}}: {yellow ${value}}`)

export {
  bgYellow,
  keyValueLog,
  error
}