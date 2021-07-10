import { TokenBase, Token } from './token';

export type TokenTransformer<T extends TokenBase<T>> = (
  children: TokenBase<TokenBase<T>>[]
) => T;

export function noTransform(children: TokenBase<TokenBase<Token>>[]): Token {
  return {
    content: '',
    children: children,
  };
}
