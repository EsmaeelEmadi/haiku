import type { Node, NodePath } from "@babel/traverse";
import {
  type CallExpression,
  type File,
  isObjectMethod,
  isObjectProperty,
} from "@babel/types";
import { P, match } from "ts-pattern";
import { extractArray } from "./extractArray";
import { extractComponentPath } from "./extractComponentPath";
import { extractIdentifier } from "./extractIdentifier";

// @ts-ignore
export const extract = (
  ast: File,
  value: Node,
  filePath: string,
  path: NodePath<CallExpression>,
) => {
  return (
    match(value)
      .with(
        {
          type: P.union(
            "StringLiteral",
            "NumericLiteral",
            "BooleanLiteral",
            "DecimalLiteral",
            "BigIntLiteral",
          ),
        },
        (v) => {
          return v.value;
        },
      )
      .with({ type: "NullLiteral" }, () => {
        return null;
      })
      .with({ type: "RegExpLiteral" }, (v) => {
        return v.pattern;
      })
      .with({ type: "TemplateLiteral" }, () => {
        // TODO: it is return an array of nodes, deal with it
        //return v.quasis;
        return null;
      })
      .with({ type: "ArrayExpression" }, (node) => {
        return extractArray(ast, node, filePath, path);
      })
      .with({ type: "Identifier" }, (node) => {
        return extractIdentifier(ast, node, filePath, path);
      })
      .with({ type: "VariableDeclarator" }, (node) => {
        if (node.init === null) return null;
        if (node.init === undefined) return undefined;

        let value: unknown = extract(ast, node.init, filePath, path);

        for (const statement of ast.program.body) {
          if (
            statement.type === "ExpressionStatement" &&
            statement.expression.type === "AssignmentExpression" &&
            statement.expression.left.type === "Identifier" &&
            // FIXME:
            // @ts-ignore
            statement.expression.left.name === node.id.name
          ) {
            value = extract(ast, statement.expression.right, filePath, path);
          }
        }

        return value;
      })
      .with({ type: "ObjectExpression" }, (node) => {
        const output: Record<string | number | symbol, unknown> = {};
        for (const prop of node.properties) {
          if (isObjectProperty(prop) || isObjectMethod(prop)) {
            const value = extract(ast, prop, filePath, path);
            // FIXME:
            // @ts-ignore
            output[prop.key.name] = value;
          } else {
            throw new Error(`undexpected type ${prop.type}`);
          }
        }

        return output;
      })
      // FIXME:
      // @ts-ignore
      .with({ type: "ObjectProperty" }, (node) => {
        const value: unknown = extract(ast, node.value, filePath, path);
        return value;
      })
      .with({ type: "JSXElement" }, (n) => {
        if (
          n.openingElement.type === "JSXOpeningElement" &&
          n.openingElement.name.type === "JSXIdentifier"
        ) {
          const cp = extractComponentPath(
            n.openingElement.name.name,
            filePath,
            path,
            n.openingElement.name.type,
          );
          return cp;
        }
      })
      .otherwise((prop) => {
        throw new Error(`undexpected type ${prop.type}`);
      })
  );
};
