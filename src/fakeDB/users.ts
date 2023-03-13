export let users: User[] = [
  {
    id: '640f4b30cde42820d332b0e9',
    name: 'Булдаков Ярослав',
    description: 'Увлекаюсь воркаутом и немного паркуром',
    type: 'Наставник',
    answers: [{
      question: '',
      answer: ''
    }],
    roles: ['student', 'mentor'],
    contacts: [{
      name: 'Telegram',
      link: 't.me/HeT_Ha3BaHuya'
    }],
    grade: 8,
    town_id: '640f4ac9145a0da782eb1a95',
    school_id: '640f4af989029a9d95db4b19'
  },
]

interface User {
  id: string,
  name: string,
  description: string,
  type: string, // можно "Учитель" или "Автор"
  answers?: {
    question: string,
    answer: string
  }[],
  roles: string[],
  contacts: {
    name: string,
    link: string
  }[],
  grade: number,
  town_id: string,
  school_id: string
}