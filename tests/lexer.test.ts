import { lexRaw } from '../src/lexer';
import { Token } from '../src/token';
import { Scanner } from '../src/scanner';

jest.mock('../src/scanner');
const ScannerMock = Scanner as jest.Mock;

const text = '# h1\n\n## h2\n\n> cite\n  cite inner';

describe('lexer test', () => {
  beforeAll(() => {
    ScannerMock.mockImplementation(() => {
      return {
        blockReg: /\n{2,}(?! )/,
        indentReg: /(?<=\n) +/,
        childReg: (indent: string) =>
          new RegExp(`(?<!${indent}.*|\\n)\\n(?=${indent}.*)`, 'g'),
        brotherReg: (indent: string) =>
          new RegExp(`(?<=${indent}.*)\\n(?!\\n*${indent})`, 'g'),
        unindentReg: (indent: string) => new RegExp(`(?<=\\n)${indent}`, 'g'),
      };
    });
  });

  test('scanner mock test', () => {
    const scanner = new Scanner();
    expect(ScannerMock).toHaveBeenCalled();
    expect(scanner.blockReg.source).toBe('\\n{2,}(?! )');
    expect(scanner.indentReg.source).toBe('(?<=\\n) +');
  });

  test('raw lex test', () => {
    expect(lexRaw(text, new Scanner())).toEqual<Token[]>([
      {
        content: '',
        children: [
          {
            content: '# h1',
            children: [],
          },
        ],
      },
      {
        content: '',
        children: [
          {
            content: '## h2',
            children: [],
          },
        ],
      },
      {
        content: '',
        children: [
          {
            content: '> cite',
            children: [
              {
                content: '',
                children: [
                  {
                    content: 'cite inner',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });
});
