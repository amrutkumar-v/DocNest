import type { User } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'

import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserEmail,
  getUserFirstName,
  getUserInitials,
  getUserProviderLabel,
} from '@/lib/user'

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'ada@example.com',
    app_metadata: { provider: 'google', providers: ['google'] },
    user_metadata: {
      full_name: 'Ada Lovelace',
      avatar_url: 'https://lh3.googleusercontent.com/a/avatar',
    },
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  } as User
}

describe('getUserDisplayName', () => {
  it('prefers the Google full name', () => {
    expect(getUserDisplayName(createUser())).toBe('Ada Lovelace')
  })

  it('accepts Google accounts that only send `name`', () => {
    const user = createUser({ user_metadata: { name: 'Ada Lovelace' } })
    expect(getUserDisplayName(user)).toBe('Ada Lovelace')
  })

  it('falls back to the email address', () => {
    const user = createUser({ user_metadata: {} })
    expect(getUserDisplayName(user)).toBe('ada@example.com')
  })

  it('returns null without a user', () => {
    expect(getUserDisplayName(null)).toBeNull()
  })

  it('ignores blank metadata values', () => {
    const user = createUser({ user_metadata: { full_name: '   ', name: '' } })
    expect(getUserDisplayName(user)).toBe('ada@example.com')
  })
})

describe('getUserFirstName', () => {
  it('takes the first word of the display name', () => {
    expect(getUserFirstName(createUser())).toBe('Ada')
  })

  it('handles a single given name', () => {
    const user = createUser({ user_metadata: { full_name: 'Ada' } })
    expect(getUserFirstName(user)).toBe('Ada')
  })

  it('derives a first name from the email fallback', () => {
    const user = createUser({ user_metadata: {} })
    expect(getUserFirstName(user)).toBe('ada@example.com')
  })

  it('returns null when nothing is known', () => {
    expect(getUserFirstName(createUser({ email: '', user_metadata: {} }))).toBeNull()
  })
})

describe('getUserEmail', () => {
  it('trims and returns the address', () => {
    expect(getUserEmail(createUser({ email: '  ada@example.com ' }))).toBe('ada@example.com')
  })

  it('returns null for an empty address', () => {
    expect(getUserEmail(createUser({ email: '' }))).toBeNull()
    expect(getUserEmail(null)).toBeNull()
  })
})

describe('getUserAvatarUrl', () => {
  it('accepts both Google metadata keys', () => {
    expect(getUserAvatarUrl(createUser())).toBe('https://lh3.googleusercontent.com/a/avatar')
    expect(
      getUserAvatarUrl(createUser({ user_metadata: { picture: 'https://example.com/a.png' } })),
    ).toBe('https://example.com/a.png')
  })

  it('returns null when Google provided no picture', () => {
    expect(getUserAvatarUrl(createUser({ user_metadata: {} }))).toBeNull()
  })
})

describe('getUserInitials', () => {
  it('uses the first two words', () => {
    expect(getUserInitials(createUser())).toBe('AL')
  })

  it('uses one letter for a single-word name', () => {
    expect(getUserInitials(createUser({ user_metadata: { full_name: 'Ada' } }))).toBe('A')
  })

  it('returns null when no name is available', () => {
    expect(getUserInitials(createUser({ email: '', user_metadata: {} }))).toBeNull()
  })
})

describe('getUserProviderLabel', () => {
  it('labels Google', () => {
    expect(getUserProviderLabel(createUser())).toBe('Google')
  })

  it('does not leak unexpected provider identifiers', () => {
    const user = createUser({ app_metadata: { provider: 'internal-sso-acme' } })
    expect(getUserProviderLabel(user)).toBe('Unknown provider')
  })

  it('handles a missing provider', () => {
    expect(getUserProviderLabel(createUser({ app_metadata: {} }))).toBe('Unknown provider')
    expect(getUserProviderLabel(null)).toBe('Unknown provider')
  })
})