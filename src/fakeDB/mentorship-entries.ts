export let mentorship_entries: MentorshipEntryValue[] = [
  {
    subject: 'Биология',
    description: '15:30 - 16:30 пн, ср, пт. Кабинет 206. Помогу исправить твои двойки и стать гуру биологии',
    mentor_id: '',
    responses: [],
    banned: [],
    town_id: '',
    school_id: ''
  }
]

interface MentorshipEntryValue {
  subject: string,
  description: string,
  mentor_id: string,
  responses: string[],
  banned: string[],
  town_id: string,
  school_id: string
}