import { Clock, LogOut, Monitor, Moon, ShieldCheck, Sun, type LucideIcon } from 'lucide-react'

import { GoogleMark } from '@/components/auth/GoogleMark'
import { UserAvatar } from '@/components/auth/UserAvatar'
import { InlineAlert } from '@/components/InlineAlert'
import { SettingsRow } from '@/components/SettingsRow'
import { SettingsSection } from '@/components/SettingsSection'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTheme } from '@/hooks/useTheme'
import { APP_NAME, APP_TAGLINE, APP_VERSION } from '@/lib/constants'
import type { ThemePreference } from '@/context/theme-context'
import { SettingsSectionIcons } from '@/lib/icons'
import { getUserDisplayName, getUserEmail, getUserProviderLabel } from '@/lib/user'
import { cn } from '@/lib/utils'

/** Read-only value used where a setting exists but its feature does not yet. */
function Unavailable({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <span className="flex items-center gap-2 text-sm text-subtle-foreground">
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      {children}
    </span>
  )
}

/** Read-only value drawn from the authenticated session. */
function ReadOnlyValue({ children }: { children: string }) {
  return (
    <span className="truncate text-sm font-medium text-foreground">{children}</span>
  )
}

const THEME_OPTIONS: {
  value: ThemePreference
  label: string
  icon: LucideIcon
}[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

/** Segmented theme picker. Real radios, so arrow keys work as expected. */
function ThemePicker() {
  const { preference, setPreference } = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex rounded-control border border-border bg-surface-muted p-0.5"
    >
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
        const selected = preference === value

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setPreference(value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[0.4375rem] px-2.5 py-1.5 text-[0.8125rem] font-medium',
              'transition-[background-color,color,box-shadow] duration-[140ms]',
              selected
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon aria-hidden="true" className="size-3.5" />
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default function Settings() {
  usePageTitle('Settings')

  const { user, signOut, isSigningOut, error } = useAuth()

  const displayName = getUserDisplayName(user)
  const email = getUserEmail(user)
  const provider = getUserProviderLabel(user)

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account, appearance and preferences."
      />

      <div className="grid gap-4 lg:gap-5">
        <SettingsSection
          icon={SettingsSectionIcons.account}
          title="Account"
          description="Your DocNest account, managed through your Google sign-in."
        >
          <div className="flex items-center gap-3.5 px-5 py-4">
            <UserAvatar user={user} className="size-11" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {displayName ?? 'DocNest user'}
              </p>
              <p className="truncate text-sm text-muted-foreground">{email ?? 'No email on file'}</p>
            </div>
          </div>

          <SettingsRow
            label="Name"
            description="Taken from your Google profile."
            control={<ReadOnlyValue>{displayName ?? 'Not provided by Google'}</ReadOnlyValue>}
          />
          <SettingsRow
            label="Email"
            description="Your DocNest sign-in address."
            control={<ReadOnlyValue>{email ?? 'Not provided by Google'}</ReadOnlyValue>}
          />
          <SettingsRow
            label="Authentication"
            description="How you sign in to DocNest."
            control={
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <GoogleMark className="size-4" />
                {provider ?? 'Unknown provider'}
              </span>
            }
          />
          <SettingsRow
            label="Sign out"
            description="Ends this session on this device. You will need to sign in again."
            control={
              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                <Button
                  variant="secondary"
                  onClick={() => void signOut()}
                  disabled={isSigningOut}
                  aria-busy={isSigningOut}
                >
                  <LogOut aria-hidden="true" />
                  {isSigningOut ? 'Signing out…' : 'Sign out'}
                </Button>
                {/* On success the session is cleared and RequireAuth redirects
                    to /login, so any error here is a sign-out failure. */}
                {error ? (
                  <InlineAlert className="sm:max-w-56">{error}</InlineAlert>
                ) : null}
              </div>
            }
          />
        </SettingsSection>

        <SettingsSection
          icon={SettingsSectionIcons.appearance}
          title="Appearance"
          description="Choose how DocNest looks on this device."
        >
          <SettingsRow
            label="Theme"
            description="Follows your system setting unless you pick light or dark."
            control={<ThemePicker />}
          />
        </SettingsSection>

        <SettingsSection
          icon={SettingsSectionIcons.security}
          title="Security"
          description="Extra protection for a vault that holds sensitive documents."
          badge="Planned"
        >
          <SettingsRow
            label="App Lock"
            description="Require a PIN or biometric unlock each time DocNest opens."
            control={<Switch label="App Lock" description="Not available yet" disabled />}
          />
          <SettingsRow
            label="Session management"
            description="Review and sign out of active sessions on your other devices."
            control={<Unavailable icon={ShieldCheck}>Not available yet</Unavailable>}
          />
        </SettingsSection>

        <SettingsSection
          icon={SettingsSectionIcons.notifications}
          title="Notifications"
          description="Stay ahead of documents that are about to expire."
          badge="Planned"
        >
          <SettingsRow
            label="Expiry reminders"
            description="Get a heads-up before a document's expiry date."
            control={
              <Switch
                label="Expiry reminders"
                description="Not available yet"
                disabled
              />
            }
          />
          <SettingsRow
            label="Reminder preferences"
            description="Choose how far in advance you want to be reminded."
            control={<Unavailable icon={Clock}>Not configured</Unavailable>}
          />
        </SettingsSection>

        <SettingsSection
          icon={SettingsSectionIcons.about}
          title="About"
          description="Build information for this app."
        >
          <SettingsRow
            label={APP_NAME}
            description={APP_TAGLINE}
            control={
              <span className="text-sm font-medium text-foreground">Version {APP_VERSION}</span>
            }
          />
        </SettingsSection>
      </div>
    </div>
  )
}
