// Start Here: five paths. These pages only point to other pages, so they make no teaching claims of their own.
export interface Pick { href: string; label: string; why: string }
export interface Path { id: string; label: string; blurb: string; intro: string[]; picks: Pick[] }

const mary: Pick = { href: '/myths/worship-mary-and-saints/', label: 'Catholics worship Mary and the saints', why: 'The line between honor and worship, and where Protestants still disagree.' };
const father: Pick = { href: '/myths/call-no-man-father/', label: 'Why do Catholics call priests "Father"?', why: 'A short look at one verse and what the rest of the New Testament does with the word.' };
const pope: Pick = { href: '/myths/papal-infallibility/', label: 'What papal infallibility covers', why: 'What the 1870 definition says, and what it leaves out.' };
const mass: Pick = { href: '/mass/', label: 'The Mass, step by step', why: 'What happens and why, with the postures explained.' };
const daily: Pick = { href: '/daily/', label: 'Daily Bread', why: 'A short reading and one question a day. It takes five minutes.' };
const gloss: Pick = { href: '/glossary/', label: 'Glossary', why: 'Plain definitions of the words you will keep running into.' };

export const PATHS: Path[] = [
  { id: 'protestant', label: 'I am Protestant', blurb: 'You know the Bible well and have questions about what Catholics add to it.',
    intro: ['These entries begin with the questions Protestants ask most often. Each one states your side the way your own best writers would put it, and then says what the Church teaches and why.', 'You will not be asked to agree with anything.'],
    picks: [mary, father, pope, mass] },
  { id: 'orthodox', label: 'I am Orthodox', blurb: 'You share a great deal with Catholics and disagree on a few large things.',
    intro: ['Orthodox and Catholic Christians share the early councils, the sacraments and the veneration of Mary and the saints. The main disagreements are about the pope. Start there.', 'More comparison pages are on the way.'],
    picks: [pope, mary, mass] },
  { id: 'no-faith', label: 'I have no religion', blurb: 'You are curious, or a friend or family member is Catholic.',
    intro: ['You do not need any background. A good first step is to see what actually happens at a Mass, or to read one short passage and one question a day.', 'Words you do not know are underlined, and a definition appears when you hover over or tap them.'],
    picks: [mass, daily, gloss] },
  { id: 'lapsed', label: 'I was raised Catholic', blurb: 'You left, drifted, or never really knew what you were given.',
    intro: ['Many people leave with a child\'s picture of the faith. These pages give the adult version, with sources, and say plainly where the Church\'s teaching ends and local habit begins.', 'Sit in the back if you like. Nobody is counting.'],
    picks: [mass, daily, mary, pope] },
  { id: 'curious', label: 'I am just curious', blurb: 'You are not sure what you are looking for yet.',
    intro: ['Take a look around. Today has one small task, the Library on the home page lists everything, and the Learn menu is always at the top.'],
    picks: [daily, mass, mary, gloss] },
];
