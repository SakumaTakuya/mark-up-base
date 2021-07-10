export interface TokenBase<Child> {
  content: string;
  children: Child[];
}

export interface Token extends TokenBase<Token> {
  content: string;
  children: Token[];
}
