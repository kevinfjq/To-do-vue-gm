export const priorities = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
  critical: 'Critical',
}

export type Priority = keyof typeof priorities;
