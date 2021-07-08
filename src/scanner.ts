export class Scanner {
  public readonly blockReg: RegExp;
  public readonly indentReg: RegExp;
  private readonly brotherRegBase: string;
  private readonly childRegBase: string;
  private readonly unindentRegBase: string;

  constructor(space: string = '[ \\t]', lineBreak: string = '[\\n\\r]') {
    this.blockReg = new RegExp(`${lineBreak}{2,}(?!${space})`);
    this.indentReg = new RegExp(`(?<=${lineBreak})${space}+`);
    this.brotherRegBase = `(?<={indent}.*)${lineBreak}(?!${lineBreak}*{indent})`;
    this.childRegBase = `(?<!{indent}.*|${lineBreak})${lineBreak}(?={indent}.*)`;
    this.unindentRegBase = `(?<=${lineBreak}){indent}`;
  }

  childReg(indent: string): RegExp {
    return new RegExp(this.childRegBase.replace(/{indent}/g, indent), 'g');
  }

  brotherReg(indent: string): RegExp {
    return new RegExp(this.brotherRegBase.replace(/{indent}/g, indent), 'g');
  }

  unindentReg(indent: string): RegExp {
    return new RegExp(this.unindentRegBase.replace(/{indent}/g, indent), 'g');
  }
}
