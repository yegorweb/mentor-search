export let schools: School[] = [
  {
    id: '640f4af989029a9d95db4b19',
    name: 'МБОУ Гимназия №8',
    town_id: '640f4ac9145a0da782eb1a95'
  },
  {
    id: '640f4af989029a9dsddb4bd3',
    name: 'ФМЛ',
    town_id: '640f4ac9145a0da782eb1a95'
  },
]

interface School {
  id: string,
  name: string,
  town_id: string
}