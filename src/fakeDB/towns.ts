export let towns: Town[] = [
  {
    id: '640f4ac9145a0da782eb1a95',
    name: 'Глазов',
    schools: ['640f4af989029a9d95db4b19', '640f4af989029a9dsddb4bd3']
  },
  {
    id: '640f4ac914567da782eb1asd',
    name: 'Ижевск',
    schools: ['640f4af989029a9dsddbd34f']
  }
]

interface Town {
  id: string,
  name: string,
  schools: string[]
}