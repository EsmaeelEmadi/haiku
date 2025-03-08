import json5 from "json5";
import {
  DefaultExport,
  DefaultImport,
  type ExtractResult,
  NamedExport,
  NamedImport,
} from "./helperClasses";

export const internalCreateStory = async (extractResult: ExtractResult) => {
  let tmpl = `
	    import type { Meta, StoryObj } from '@storybook/react';
	    import { fn } from '@storybook/test';
	`;

  if (extractResult.props) {
    for (const [_, value] of Object.entries(extractResult.props)) {
      if (value instanceof DefaultExport || value instanceof DefaultImport) {
        tmpl += `import ${value.name} from "${value.pathWithoutExtention}"; \n`;
      }

      if (value instanceof NamedExport || value instanceof NamedImport) {
        tmpl += `import {${value.name}} from "${value.pathWithoutExtention}"; \n`;
      }
    }
  }

  if (
    extractResult.component instanceof DefaultExport ||
    extractResult.component instanceof DefaultImport
  ) {
    tmpl += `import ${extractResult.component.name} from "${extractResult.component.pathWithoutExtention}"; \n`;
  }

  if (
    extractResult.component instanceof NamedExport ||
    extractResult.component instanceof NamedImport
  ) {
    tmpl += `import {${extractResult.component.name}} from "${extractResult.component.pathWithoutExtention}"; \n`;
  }

  let tmplMeta = `const meta = {
	                   title: 'Examples/${extractResult.component.name}',
	                   component: ${extractResult.component.name},
	                   parameters: {
	                     layout: 'centered',
	                     // query: --json5.stringify(parameters.query)
	                   },
	 `;

  tmplMeta += `} satisfies Meta<typeof ${extractResult.component.name}>; \n`;

  tmpl += tmplMeta;

  tmpl += "export default meta; \n";

  tmpl += "type Story = StoryObj<typeof meta>; \n";

  let tmplMain = "export const Main: Story = {";

  const keysNotToShow = extractResult.props
    ? Object.keys(extractResult.props).filter((key) => key.startsWith("$_"))
    : null;

  const args: Record<string, unknown> = {};
  if (extractResult.props) {
    for (const [key, value] of Object.entries(extractResult.props)) {
      if (!key.startsWith("$_")) {
        args[key] = value;
      }
    }
  }

  let tmplArgTypes = "argTypes: {";
  if (keysNotToShow?.length) {
    for (const key of keysNotToShow) {
      tmplArgTypes += `${key.replace("$_", "")}: {table: {disable: true}},`;
    }
  }
  tmplArgTypes += "},";

  let tmplArgs = "args: {";

  if (extractResult.props) {
    for (const [k, v] of Object.entries(extractResult.props)) {
      if (!v.type) {
        tmplArgs += `${k.replace("$_", "")} : ${json5.stringify(v)},`;
      } else {
        if (v.type === "JSXIdentifier") {
          tmplArgs += `${k.replace("$_", "")} : <${v.name} />,`;
        } else {
          tmplArgs += `${k.replace("$_", "")} : ${v.name},`;
        }
      }
    }
  }

  tmplArgs += "},";

  tmplMain += tmplArgs;
  tmplMain += tmplArgTypes;

  tmplMain += "} \n";

  tmpl += tmplMain;

  return tmpl;
};
