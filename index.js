const { program } = require('commander');
const chalk = require('chalk');

// Your command-line program setup here
program
  .version('1.0.0')
  .description('Content Commander - A CLI tool to manage your content ideas')
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);

const options = program.opts();

if (options.debug) console.log('Debug mode is on');
if (options.small) console.log('- small pizza size');
if (options.pizzaType) console.log(`- ${options.pizzaType} pizza`);
