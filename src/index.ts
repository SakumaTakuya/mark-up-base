export class Scanner {
  public readonly blockReg: RegExp;
  public readonly indentReg: RegExp;
  private readonly brotherRegBase: string;
  private readonly childRegBase: string;
  private readonly unindentRegBase: string;

  constructor(space: string = '[ \t]', lineBreak: string = '[\n\r]') {
    this.blockReg = new RegExp(`${lineBreak}{2,}(?!${space})`);
    this.indentReg = new RegExp(`(?<=${lineBreak})${space}+`);
    this.brotherRegBase = `(?<={indent}.*)${lineBreak}(?!${lineBreak}*{indent})`;
    this.childRegBase = `(?<!{indent}.*|${lineBreak})${lineBreak}(?={indent}.*)`;
    this.unindentRegBase = `(?<=${lineBreak}){indent}`;
  }

  childReg(indent: string): RegExp {
    return new RegExp(this.childRegBase.replace('{indent}', indent), 'g');
  }

  brotherReg(indent: string): RegExp {
    return new RegExp(this.brotherRegBase.replace('{indent}', indent), 'g');
  }

  unindentReg(indent: string): RegExp {
    return new RegExp(this.unindentRegBase.replace('{indent}', indent), 'g');
  }
}

type TokenType = 'root' | 'block' | 'text';

export type Token = {
  type: TokenType;
  children: string | Token[];
};

function lexInner(text: string, scanner: Scanner = new Scanner()): Token[] {
  const result: Token[] = [];
  for (const block of text.split(scanner.blockReg)) {
    const indentMatches = scanner.indentReg.exec(block);
    const children: Token[] = [];

    if (indentMatches === null) {
      children.push({
        type: 'text',
        children: block,
      });
      continue;
    }

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
        type: 'block',
        children: [
          {
            type: 'text',
            children: innerChildren[0],
          },
          ...lexInner(newBlock || '', scanner),
        ],
      });
    }

    result.push({
      type: 'block',
      children: children,
    });
  }

  return result;
}

export function lex(text: string, scanner: Scanner = new Scanner()): Token {
  return {
    type: 'root',
    children: lexInner(text, scanner),
  };
}
