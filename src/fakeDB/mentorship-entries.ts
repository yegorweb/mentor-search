export let mentorship_entries: MentorshipEntry[] = [
  {
    subject: 'Биология',
    description: '15:30 - 16:30 пн, ср, пт. Кабинет 206. Помогу исправить твои двойки и стать гуру биологии',
    author_id: '640f4b30cde42820d332b0e9',
    responses: [],
    banned: [],
    town_id: '640f4ac9145a0da782eb1a95',
    school_id: '640f4af989029a9d95db4b19'
  }
]

interface MentorshipEntry {
  subject: string,
  description: string,
  author_id: string,
  responses: string[],
  banned: string[],
  town_id: string,
  school_id: string
}