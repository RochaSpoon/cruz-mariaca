export const AUTHORITY_LABELS = {
  dogma: {
    name: 'Dogma',
    text: 'Taught by the Church as revealed by God. Catholics are bound to hold it. The Trinity is an example.',
  },
  definitive: {
    name: 'Definitive doctrine',
    text: 'Taught as certainly true and to be held firmly, because it is closely tied to what was revealed.',
  },
  authoritative: {
    name: 'Authoritative teaching',
    text: 'The ordinary teaching of the pope and the bishops. Catholics are asked to give it a respectful assent, and it can be refined over time.',
  },
  discipline: {
    name: 'Discipline',
    text: 'Church law and custom. It can change. Abstaining from meat on Fridays is an example.',
  },
  opinion: {
    name: 'Theological opinion',
    text: 'A view that theologians hold and argue about. Catholics are free to disagree.',
  },
} as const;

export type AuthorityLevel = keyof typeof AUTHORITY_LABELS;
