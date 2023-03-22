export let users: User[] = [
  {
    id: '640f4b30cde42820d332b0e9',
    name: 'Булдаков Ярослав',
    description: 'Увлекаюсь воркаутом и немного паркуром',
    avatar_url: 'https://ss.sport-express.ru/userfiles/materials/177/1776648/large.jpg',
    ranks: ['знаток'],
    achievements: [{
      achievement: 'миска рис',
      forever: false,
      duration: 100000000,
      date: 1679230369000
    }],
    answers: [{
      question: '',
      answer: ''
    }],
    roles: ['student', 'mentor'],
    contacts: [{
      name: 'Telegram',
      link: 'https://t.me/HeT_Ha3BaHuya'
    }],
    grade: 8,
    town_id: '640f4ac9145a0da782eb1a95',
    school_id: '640f4af989029a9d95db4b19'
  },
  {
    id: '640f4b30cde42820d332b0d1',
    name: 'Данила Васильев',
    description: 'Ты кто?',
    avatar_url: 'https://ss.sport-express.ru/userfiles/materials/177/1776648/large.jpg',
    ranks: [],
    achievements: [],
    answers: [{
      question: '',
      answer: ''
    }],
    roles: ['student', 'mentor'],
    contacts: [{
      name: 'ВК',
      link: 'https://vk.com/danya'
    }],
    grade: 9,
    town_id: '640f4ac9145a0da782eb1a95',
    school_id: '640f4af989029a9dsddb4bd3'
  },
]

interface User {
  id: string,
  name: string,
  description: string,
  avatar_url: string,
  ranks: string[],
  achievements: {
    achievement: string,
    forever: boolean,
    duration?: number,
    date: number
  }[],
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

// ROLES: 
// student, mentor, school-admin, global-admin