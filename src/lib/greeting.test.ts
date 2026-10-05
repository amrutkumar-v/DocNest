import { afterEach, describe, expect, it, vi } from 'vitest'

import { getDashboardGreeting, getGreeting } from '@/lib/greeting'

function at(hour: number) {
  return new Date(2026, 0, 1, hour, 30)
}

afterEach(() => {
  vi.useRealTimers()
})

describe('getGreeting', () => {
  it('greets in the morning', () => {
    expect(getGreeting(at(0))).toBe('Good morning')
    expect(getGreeting(at(11))).toBe('Good morning')
  })

  it('greets in the afternoon', () => {
    expect(getGreeting(at(12))).toBe('Good afternoon')
    expect(getGreeting(at(17))).toBe('Good afternoon')
  })

  it('greets in the evening', () => {
    expect(getGreeting(at(18))).toBe('Good evening')
    expect(getGreeting(at(23))).toBe('Good evening')
  })
})

describe('getDashboardGreeting', () => {
  it('personalises the greeting with the first name', () => {
    expect(getDashboardGreeting('Ada', at(9))).toBe('Good morning, Ada')
  })

  it('stays anonymous when no name is known', () => {
    expect(getDashboardGreeting(null, at(9))).toBe('Good morning')
    expect(getDashboardGreeting('', at(9))).toBe('Good morning')
  })

  it('never renders a double comma for an empty name', () => {
    expect(getDashboardGreeting(null, at(20))).not.toContain(',,')
  })
})