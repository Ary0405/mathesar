export type RuleTermOperator = 'eq' | 'neq' | 'lt' | 'gt' | 'lte' | 'gte';

export interface RuleTerm {
  id: string,
  op: RuleTermOperator,
  value: unknown,
}

export interface RuleTermCombination {
  combination: 'and' | 'or',
  terms: Rule[]
}

export type Rule = RuleTerm | RuleTermCombination;

function combine(
  combination: RuleTermCombination['combination'],
  term1: boolean,
  term2: boolean,
): boolean {
  if (combination === 'and') {
    return term1 && term2;
  }
  return term1 || term2;
}

function executureTerm(
  term: RuleTerm,
  values: Record<RuleTerm['id'], unknown>,
): boolean {
  const termValue = values[term.id];
  switch (term.op) {
    case 'eq':
      return termValue === term.value;
    case 'neq':
      return termValue !== term.value;
    case 'gt':
      return termValue > term.value;
    case 'gte':
      return termValue >= term.value;
    case 'lt':
      return termValue < term.value;
    case 'lte':
      return termValue <= term.value;
    default:
      return false;
  }
}

export function executeRule(
  rule: Rule,
  values: Record<RuleTerm['id'], unknown>,
): boolean {
  if ('combination' in rule) {
    let isSuccess = false;
    rule.terms.forEach((term) => {
      isSuccess = combine(
        rule.combination,
        isSuccess,
        executeRule(term, values),
      );
    });
    return isSuccess;
  }
  return executureTerm(rule, values);
}
