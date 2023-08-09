export let EntryTypes = ['mentor', 'lesson', 'club'] as const
export type EntryType = typeof EntryTypes[number]
