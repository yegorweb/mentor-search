export let mentorship_entries: MentorshipEntry[] = [
  {
    id: '640f4e221641898df9a277c1',
    subject: 'Биология',
    description: '15:30 - 16:30 пн, ср, пт. Кабинет 206. Помогу исправить твои двойки и стать гуру биологии',
    author_id: '640f4b30cde42820d332b0e9',
    responses: [],
    banned: [],
    town_id: '640f4ac9145a0da782eb1a95',
    school_id: '640f4af989029a9d95db4b19',
    date: 1000000
  },
  {
    id: '640f4e2216d1898df9a277c1',
    subject: 'Биология',
    description: '15:30 - 16:30 пн, ср, пт. Кабинет 206. Помогу исправить твои двойки и стать гуру биологии. Длииинный текст. Длииинный текст. Длииинный текст. Длииинный текст. Длииинный текст. Длииинный текст. Длииинный текст. Длииинный текст. Длииинный текст. Длииинный текст. Длииинный текст. Длииинный текст. Длииинный текст. Длииинный текст.',
    author_id: '640f4b30cde42820d332b0e9',
    responses: [],
    banned: [],
    town_id: '640f4ac9145a0da782eb1a95',
    school_id: '640f4af989029a9d95db4b19',
    date: 1000000
  }
]

export interface MentorshipEntry {
  id: string,
  subject: string,
  description: string,
  author_id: string,
  responses: string[],
  banned: string[],
  town_id: string,
  school_id: string,
  date: number
}