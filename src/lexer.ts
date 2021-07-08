import { Scanner } from './scanner';
import { Token } from './token';

function lexChildren(block: string, scanner: Scanner = new Scanner()): Token[] {
  const indentMatches = scanner.indentReg.exec(block);
  if (indentMatches === null) {
    return [
      {
        content: block,
      },
    ];
  }

  const children: Token[] = [];
  const indent = indentMatches[0];
  const brotherReg = scanner.brotherReg(indent);
  const childReg = scanner.childReg(indent);
  const unindentReg = scanner.unindentReg(indent);

  const indentLength = indent.length;
  const brothers = block.split(brotherReg);

  for (const brother of brothers) {
    const innerChildren = brother.split(childReg);

    const newBlock = innerChildren[1]
      ?.substring(indentLength)
      .replace(unindentReg, '');

    children.push({
      content: innerChildren[0],
      children: [...lexChildren(newBlock || '', scanner)],
    });
  }

  return children;
}

export function lex(text: string, scanner: Scanner = new Scanner()): Token {
  const result: Token[] = [];
  for (const block of text.split(scanner.blockReg)) {
    result.push({
      children: lexChildren(block, scanner),
    });
  }

  return {
    children: result,
  };
}
