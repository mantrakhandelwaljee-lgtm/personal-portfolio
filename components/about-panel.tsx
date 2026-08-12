"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

type Profile = {
  name: string
  role: string
  bio: string
  email: string
  location: string
  website: string
}

const initialProfile: Profile = {
  name: "Mantra Khandelwal",
  role: "Designer & Developer",
  bio: "I design and build expressive interfaces where color, motion and typography do the heavy lifting. My work lives at the intersection of playful visual systems and clean, performant engineering.",
  email: "hello@mantra.design",
  location: "Bengaluru, India",
  website: "mantra.design",
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string
  name: keyof Profile
  value: string
  onChange: (name: keyof Profile, value: string) => void
  type?: string
  textarea?: boolean
}) {
  const base =
    "w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground"
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-xs font-medium uppercase tracking-widest text-foreground/50">
        {label}
      </span>
      {textarea ? (
        <textarea
          className={`${base} min-h-24 resize-none leading-relaxed`}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={base}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
        />
      )}
    </label>
  )
}

export function AboutPanel() {
  const [profile, setProfile] = useState<Profile>(initialProfile)
  const [draft, setDraft] = useState<Profile>(initialProfile)
  const [editing, setEditing] = useState(false)

  const handleChange = (name: keyof Profile, value: string) =>
    setDraft((p) => ({ ...p, [name]: value }))

  const startEdit = () => {
    setDraft(profile)
    setEditing(true)
  }
  const save = () => {
    setProfile(draft)
    setEditing(false)
  }

  return (
    <section
      id="about"
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-5 py-16 md:py-24"
    >
      <div className="mb-10 flex items-center gap-4">
        <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground/40">
          01 — About
        </span>
        <span className="h-px flex-1 bg-foreground/15" />
        <Button
          variant="outline"
          size="sm"
          onClick={editing ? save : startEdit}
          className="rounded-full border-foreground/20 font-display text-xs font-semibold uppercase tracking-widest"
        >
          {editing ? "Save profile" : "Edit profile"}
        </Button>
      </div>

      <div className="grid gap-10 md:grid-cols-[240px_1fr] md:gap-14">
        {/* Avatar */}
        <div className="flex flex-col items-start gap-4">
          <div className="brand-block relative aspect-square w-40 overflow-hidden bg-brand-yellow md:w-full">
            <Image
              src="/avatar.png"
              alt={`Portrait of ${profile.name}`}
              fill
              sizes="240px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="size-4 rounded-full bg-brand-green" aria-hidden />
            <span className="size-4 rounded-full bg-brand-red" aria-hidden />
            <span className="size-4 rounded-full bg-brand-blue" aria-hidden />
            <span className="size-4 rounded-full bg-brand-sky" aria-hidden />
          </div>
        </div>

        {/* Info / edit form */}
        {editing ? (
          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" value={draft.name} onChange={handleChange} />
              <Field label="Role" name="role" value={draft.role} onChange={handleChange} />
            </div>
            <Field label="Bio" name="bio" value={draft.bio} onChange={handleChange} textarea />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" value={draft.email} onChange={handleChange} />
              <Field label="Location" name="location" value={draft.location} onChange={handleChange} />
            </div>
            <Field label="Website" name="website" value={draft.website} onChange={handleChange} />
            <div className="flex gap-3">
              <Button onClick={save} className="rounded-full font-display text-xs font-semibold uppercase tracking-widest">
                Save profile
              </Button>
              <Button
                variant="ghost"
                onClick={() => setEditing(false)}
                className="rounded-full font-display text-xs font-semibold uppercase tracking-widest"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-balance font-display text-3xl font-bold leading-tight md:text-5xl">
              {profile.name}
            </h2>
            <p className="mt-2 font-display text-lg text-brand-red md:text-xl">
              {profile.role}
            </p>
            <p className="mt-6 max-w-xl text-pretty leading-relaxed text-foreground/75">
              {profile.bio}
            </p>

            <dl className="mt-8 grid max-w-lg grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {[
                { k: "Email", v: profile.email },
                { k: "Location", v: profile.location },
                { k: "Website", v: profile.website },
                { k: "Available", v: "For select projects" },
              ].map((row) => (
                <div key={row.k} className="border-t border-foreground/15 pt-3">
                  <dt className="font-display text-xs font-medium uppercase tracking-widest text-foreground/40">
                    {row.k}
                  </dt>
                  <dd className="mt-1 text-sm text-foreground/85">{row.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <a 
                href="https://drive.google.com/file/d/1zsXILHGPp5PlPxJuCazQmsmz07kTdzux/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="rounded-full font-display text-xs font-semibold uppercase tracking-widest px-8">
                  View Resume
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
