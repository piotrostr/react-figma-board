import { default as hashit } from "hash-it";

export const hash = (input: string): string => String(hashit(input));
