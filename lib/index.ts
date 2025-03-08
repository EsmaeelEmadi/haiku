#!/usr/bin/env node

import chalk from "chalk";
import ora from "ora";
import { Command } from "commander";
import { store } from "./store";
export { $CreateStory } from "./createStory";
import type { IGenenrateStorybook } from "./types";

const program = new Command();

program
  .name("generateStorybook")
  .description("create story book")
  .version("0.1.0")
  .option("-o, --output-directory <type>", "output directory")
  .option("-s, --src-directory <type>", "source directory")
  .action(async (options: Partial<IGenenrateStorybook>) => {
    store.hostDirectory = process.cwd();

    // check arguments
    { 
      const spinner = ora("Check arguments").start(); 
      if (!options.outputDirectory) {
        spinner.fail(chalk.red("Output directiry is required"));
        return;
      }

      store.outputDirectory = options.outputDirectory;

      spinner.succeed(chalk.green("Incoming args are OK"));
    }
  });

program.parseAsync();
