import chalk from "chalk";

const success = (...args: any[]) => {
  return console.log(chalk.green(JSON.stringify(args.length === 1 ? args[0] : args, null, 2)));
};

const warning = (...args: any[]) => {
  return console.log(chalk.yellow(JSON.stringify(args.length === 1 ? args[0] : args, null, 2)));
};

const error = (...args: any[]) => {
  return console.log(chalk.red(JSON.stringify(args.length === 1 ? args[0] : args, null, 2)));
};

const info = (...args: any[]) => {
  return console.log(chalk.cyan(JSON.stringify(args.length === 1 ? args[0] : args, null, 2)));
};

const log = {
  success,
  warning,
  error,
  info,
};

export default log;