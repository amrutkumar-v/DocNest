import { Clock, LogOut, ShieldCheck, type LucideIcon } from 'lucide-react'

import { GoogleMark } from '@/components/auth/GoogleMark'
import { UserAvatar } from '@/components/auth/UserAvatar'
import { SettingsRow } from '@/components/SettingsRow'
import { SettingsSection } from '@/components/SettingsSection'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { APP_NAME, APP_TAGLINE, APP_VERSION } from '@/lib/constants'
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
    <span className="flex items-center justify-end gap-2 truncate text-sm font-medium text-foreground sm:justify-start">
      {children}
    </span>
  )
}

function ThemeOption({
  label,
  selected,
  disabled,
}: {
  label: string
  selected?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected ?? false}
      disabled={disabled}
      className={cn(
        'rounded-[0.4375rem] px-3 py-1.5 text-sm font-medium transition-colors',
        selected && 'bg-surface text-foreground shadow-xs',
        !selected && !disabled && 'text-muted-foreground',
        disabled && 'cursor-not-allowed text-subtle-foreground opacity-70',
      )}
    >
      {label}
    </button>
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
        description="Manage your account, security and preferences. Each section unlocks as that part of DocNest ships."
      />

      <div className="grid gap-4 lg:gap-5">
        <SettingsSection
          icon={SettingsSectionIcons.account}
          title="Account"
          description="Your DocNest account, managed through your Google sign-in."
        >
          <div className="flex items-center gap-3.5 p-5">
            <UserAvatar user={user} />
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
              <span className="flex items-center justify-end gap-2 text-sm font-medium text-foreground sm:justify-start">
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
                  <p role="alert" className="max-w-56 text-xs leading-relaxed text-foreground">
                    {error}
                  </p>
                ) : null}
              </div>
            }
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
            control={<Switch label="App Lock" />}
          />
          <SettingsRow
            label="Session Management"
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
            label="Expiry Reminders"
            description="Get a heads-up before a document's expiry date."
            control={<Switch label="Expiry Reminders" />}
          />
          <SettingsRow
            label="Reminder Preferences"
            description="Choose how far in advance you want to be reminded."
            control={<Unavailable icon={Clock}>Not configured</Unavailable>}
          />
        </SettingsSection>

        <SettingsSection
          icon={SettingsSectionIcons.appearance}
          title="Appearance"
          description="Choose how DocNest looks on this device."
        >
          <SettingsRow
            label="Theme"
            description="Light is active. Dark mode tokens are in place, but not yet switchable."
            control={
              <div
                role="radiogroup"
                aria-label="Theme"
                className="inline-flex rounded-lg border border-border bg-surface-muted p-0.5"
              >
                <ThemeOption label="Light" selected />
                <ThemeOption label="Dark" disabled />
              </div>
            }
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