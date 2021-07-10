import { Scanner } from './scanner';
import { TokenBase, Token } from './token';
import { noTransform, TokenTransformer } from './transformer';

export function lexRaw(
  text: string,
  scanner: Scanner = new Scanner()
): Token[] {
  return lex<Token>(text, scanner, noTransform);
}

export function lex<T extends TokenBase<T>>(
  text: string,
  scanner: Scanner = new Scanner(),
  transformer: TokenTransformer<T>
): T[] {
  const result: T[] = [];

  if (!text) {
    return [];
  }

  for (const block of text.split(scanner.blockReg)) {
    const children: TokenBase<TokenBase<T>>[] = [];
    const indentMatches = scanner.indentReg.exec(block) || [''];
    const indent = indentMatches[0];

    const brotherReg = scanner.brotherReg(indent);
    const childReg = scanner.childReg(indent);
    const unindentReg = scanner.unindentReg(indent);

    const indentLength = indent.length;
    const brothers = block.split(brotherReg);

    for (const brother of brothers) {
      const [parent, child] = brother.split(childReg, 2);
      const unindentedChild = child
        ?.substring(indentLength)
        .replace(unindentReg, '');

      children.push({
        content: parent,
        children: lex<T>(unindentedChild, scanner, transformer),
      });
    }

    result.push(transformer(children));
  }

  return result;
}
