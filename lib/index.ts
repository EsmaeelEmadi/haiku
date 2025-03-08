#!/usr/bin/env node

import { executeCreateStory } from "./executeCreateStory";
export { $CreateStory } from "./createStory";
import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { findCreateStoryCalls } from "./findCreateStoryCalls";
import { findFiles } from "./findFiles";
import { store } from "./store";
import type { IGenenrateStorybook } from "./types";

const program = new Command();

program
  .name("generateStorybook")
  .description("create story book")
  .version("0.1.0")
  .option("-o, --output-directory <type>", "output directory")
  .option("-s, --src-directory <type>", "source directory")
  .action(async (options: Partial<IGenenrateStorybook>) => {
    let directoryPath: string | undefined;

    store.hostDirectory = process.cwd();

    // check arguments
    {
      const spinner = ora("Check arguments").start(); // Start the spinner
      if (!options.outputDirectory) {
        spinner.fail(chalk.red("Output directiry is required"));
        return;
      }

      store.outputDirectory = options.outputDirectory;

      spinner.succeed(chalk.green("Incoming args are OK"));
    }

    {
      directoryPath = path.join(store.hostDirectory, options.outputDirectory);

      const spinner = ora("Check output path");

      const stats = fs.statSync(directoryPath);

      if (!stats.isDirectory()) {
        fs.mkdirSync(directoryPath);
      }
      spinner.succeed(chalk.green("Check output path done"));
    }

    {
      const sourcePath = options.srcDirectory
        ? path.join(store.hostDirectory, options.srcDirectory)
        : store.hostDirectory;

      const files = findFiles(sourcePath, directoryPath);

      const results = files
        ?.filter((file) => file !== null)
        .flatMap((file) => findCreateStoryCalls(file));

      if (!results) {
        chalk.yellow("unable to find any $CreateStory");
        return;
      }

      for (const { filePath, sourceFile } of results) {
        await executeCreateStory(filePath, sourceFile);
      }
    }
  });

program.parseAsync();
