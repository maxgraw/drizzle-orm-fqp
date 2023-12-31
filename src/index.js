import { Lexer } from "chevrotain";
import { QueryParser } from "./parser.js";
import { allTokens } from "./lexer.js";

/**
 * @typedef {object} QueryResult
 * @property {any} value
 * @property {import("chevrotain").ILexingError[]} lexErrors
 * @property {import("chevrotain").IRecognitionException[]} parseErrors
 */

const parser = new QueryParser();

const lexer = new Lexer([...Object.values(allTokens)], {
  ensureOptimizations: true,
});

/**
 * Parse a query string and return the corresponding drizzle filter function
 * @description 
 * This function is a wrapper around the parser and lexer that will return the 
 * parsed value, lexing errors, and parsing errors
 * @param {string} text - The query string to parse
 * @param {object} type - Drizzle Model to use for the query
 * @returns {QueryResult} - The parsed value, lexing errors, and parsing errors
 * @example
 * const { value, lexErrors, parseErrors } = parseQueryString("eq(id, 1)", user);
 * console.log(value); // eq(user.id, 1)
 */
export const parseQueryString = (text, type) => {
  const lexResult = lexer.tokenize(text);

  parser.input = lexResult.tokens;

  const result = parser.base(type);

  return {
    value: result,
    lexErrors: lexResult.errors,
    parseErrors: parser.errors,
  };
};