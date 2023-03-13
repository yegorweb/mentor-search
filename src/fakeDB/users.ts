export let users: User[] = [
  {

  }
]

interface User {
  name: string,
  description: string,
  type: string,
  answers?: {
    question: string,
    answer: string
  }[],
  contacts: [{

  }]
}