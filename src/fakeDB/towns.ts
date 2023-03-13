export let towns: Town[] = [
  {
    id: '640f4ac9145a0da782eb1a95',
    name: 'Глазов',
    schools: ['640f4af989029a9d95db4b19']
  }
]

interface Town {
  id: string,
  name: string,
  schools: string[]
}