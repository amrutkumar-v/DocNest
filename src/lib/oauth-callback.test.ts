import { describe, expect, it } from 'vitest'

import {
  describeOAuthCallbackError,
  getAuthRedirectUrl,
  parseCallbackParams,
} from '@/lib/oauth-callback'

describe('parseCallbackParams', () => {
  it('reads provider errors from the query string', () => {
    const params = parseCallbackParams(
      '?error=access_denied&error_description=The+user+denied+your+request',
      '',
    )

    expect(params.get('error')).toBe('access_denied')
    expect(params.get('error_description')).toBe('The user denied your request')
  })

  it('reads OAuth results from the fragment', () => {
    const params = parseCallbackParams('', '#access_token=abc&expires_in=3600&token_type=bearer')

    expect(params.get('access_token')).toBe('abc')
    expect(params.get('token_type')).toBe('bearer')
  })

  it('merges fragment and query string', () => {
    const params = parseCallbackParams('?error=server_error', '#error_description=Google+is+down')

    expect(params.get('error')).toBe('server_error')
    expect(params.get('error_description')).toBe('Google is down')
  })

  it('returns an empty set when the URL is clean', () => {
    expect(parseCallbackParams('', '').has('error')).toBe(false)
  })
})

describe('describeOAuthCallbackError', () => {
  it('returns null when there is no error', () => {
    expect(describeOAuthCallbackError(null)).toBeNull()
  })

  it('explains a cancelled consent screen', () => {
    expect(describeOAuthCallbackError({ code: 'access_denied', description: null })).toContain(
      'cancelled',
    )
  })

  it('explains a provider outage', () => {
    expect(describeOAuthCallbackError({ code: 'server_error', description: null })).toContain(
      'try again in a moment',
    )
    expect(
      describeOAuthCallbackError({ code: 'temporarily_unavailable', description: null }),
    ).toContain('try again in a moment')
  })

  it('falls back to a generic message for unknown codes', () => {
    expect(describeOAuthCallbackError({ code: 'something_new', description: 'raw provider text' })).toBe(
      "We couldn't complete sign-in with Google. Please try again.",
    )
  })

  it('never leaks the raw provider description to the user', () => {
    const message = describeOAuthCallbackError({
      code: 'unexpected',
      description: 'OAuth state mismatch for tenant acme-internal',
    })

    expect(message).not.toContain('acme-internal')
  })
})

describe('getAuthRedirectUrl', () => {
  it('returns the app root', () => {
    expect(getAuthRedirectUrl()).toBe(`${window.location.origin}/`)
  })
})