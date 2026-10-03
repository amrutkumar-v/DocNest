import { Clock, Lock, Mail, User } from 'lucide-react'

import { SettingsRow } from '@/components/SettingsRow'
import { SettingsSection } from '@/components/SettingsSection'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { usePageTitle } from '@/hooks/usePageTitle'
import { APP_NAME, APP_TAGLINE, APP_VERSION } from '@/lib/constants'
import { SettingsSectionIcons } from '@/lib/icons'
import { cn } from '@/lib/utils'

const disabledFieldClass =
  'bg-surface-muted text-subtle-foreground disabled:cursor-not-allowed disabled:opacity-100'

/** Read-only value used where a setting exists but its feature does not yet. */
function Unavailable({ icon: Icon, children }: { icon: typeof Lock; children: string }) {
  return (
    <span className="flex items-center gap-2 text-sm text-subtle-foreground">
      <Icon aria-hidden="true" className="size-4 shrink-0" />
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
          description="Sign-in is not available yet, so these details cannot be edited."
          badge="Coming soon"
        >
          <SettingsRow
            label="Profile"
            description="Your name and avatar, used to personalise DocNest."
            control={
              <div className="flex items-center gap-2">
                <User aria-hidden="true" className="size-4 shrink-0 text-subtle-foreground" />
                <Input
                  aria-label="Profile name"
                  placeholder="Available after sign-in"
                  disabled
                  readOnly
                  className={disabledFieldClass}
                />
              </div>
            }
          />
          <SettingsRow
            label="Email"
            description="Used for sign-in and, later, expiry reminders."
            control={
              <div className="flex items-center gap-2">
                <Mail aria-hidden="true" className="size-4 shrink-0 text-subtle-foreground" />
                <Input
                  type="email"
                  aria-label="Email address"
                  placeholder="Available after sign-in"
                  disabled
                  readOnly
                  className={disabledFieldClass}
                />
              </div>
            }
          />
          <SettingsRow
            label="Password"
            description="Set and rotate the password that protects your vault."
            control={<Unavailable icon={Lock}>Available after sign-in</Unavailable>}
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
            description="Review and sign out of active sessions on your devices."
            control={<Unavailable icon={Lock}>Available after sign-in</Unavailable>}
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