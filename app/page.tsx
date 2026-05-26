'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rating, setRating] = useState(7)
  const sliderRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    const application = {
      full_name: data.get('full_name') as string,
      age: parseInt(data.get('age') as string),
      vibe: data.get('vibe') as string,
      best_quality: data.get('best_quality') as string,
      red_flags: data.get('red_flags') as string,
      rizz_sample: data.get('rizz_sample') as string,
      love_language: data.get('love_language') as string,
      dealbreakers: data.get('dealbreakers') as string,
      why_you: data.get('why_you') as string,
      rating_yourself: rating,
    }

    const { error: supabaseError } = await supabase
      .from('crush_applications')
      .insert([application])

    if (supabaseError) {
      setError('Something went wrong submitting your application. Please try again!')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value)
    setRating(val)
    const pct = ((val - 1) / 9) * 100
    e.target.style.setProperty('--val', `${pct}%`)
  }

  if (submitted) {
    return (
      <div className="page-wrapper">
        <div className="success-card">
          <div className="success-emoji">💌</div>
          <h2>Application Received!</h2>
          <p>
            Your crush application has been logged and is under serious review.
            Please allow 3–5 business feelings for a response.
          </p>
          <div className="processing-steps">
            <div className="step">
              <span className="step-icon">✅</span>
              <span>Vibe check initiated</span>
            </div>
            <div className="step">
              <span className="step-icon">🔍</span>
              <span>Red flags being assessed</span>
            </div>
            <div className="step">
              <span className="step-icon">💅</span>
              <span>Rizz sample under evaluation</span>
            </div>
            <div className="step">
              <span className="step-icon">💘</span>
              <span>Heart palpitations pending</span>
            </div>
          </div>
          <button className="apply-again-btn" onClick={() => setSubmitted(false)}>
            Apply again with a different identity
          </button>
        </div>
        <div className="footer">
          <p>This is a joke. No data will be used to actually find you a crush. Probably.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="hero">
        <span className="hero-badge">Now Accepting Applications</span>
        <h1>Apply to Be<br />My <em>Crush</em> 💘</h1>
        <p className="hero-sub">
          Positions are extremely limited. Competition is fierce.
          Please ensure your application is complete and your rizz is adequately stocked.
        </p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">1</span>
            <span className="stat-label">Spot Available</span>
          </div>
          <div className="stat">
            <span className="stat-num">∞</span>
            <span className="stat-label">Red Flags Tolerated</span>
          </div>
          <div className="stat">
            <span className="stat-num">0%</span>
            <span className="stat-label">Acceptance Rate</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-card">
          {/* Section 1: Basic Info */}
          <div className="section-header">
            <p className="section-tag">Section 01 — Identity</p>
            <h2 className="section-title">Tell me who you are</h2>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Full Name <span className="required">*</span></label>
              <input type="text" name="full_name" placeholder="Your government name" required />
            </div>
            <div className="field">
              <label>Age <span className="required">*</span></label>
              <input type="number" name="age" placeholder="18+" min={18} max={99} required />
            </div>
            <div className="field full-width">
              <label>Your Vibe <span className="required">*</span></label>
              <select name="vibe" required defaultValue="">
                <option value="" disabled>Select your vibe...</option>
                <option value="soft_era">Soft era, very healing rn</option>
                <option value="chaotic_good">Chaotic good, will order for the table</option>
                <option value="bookish_menace">Bookish menace, secretly feral</option>
                <option value="gym_rat">Gym rat with a heart of gold</option>
                <option value="gamer_actually_fun">Gamer but like, actually fun</option>
                <option value="artsy_weirdo">Artsy weirdo (compliment)</option>
                <option value="chronically_online">Chronically online, very self-aware</option>
                <option value="outdoorsy_annoyingly_hot">Outdoorsy and annoyingly attractive</option>
                <option value="main_character">Main character, no notes</option>
                <option value="depends_on_the_day">Depends on the day honestly</option>
              </select>
            </div>
          </div>

          <hr className="divider" />

          {/* Section 2: Qualities */}
          <div className="section-header">
            <p className="section-tag">Section 02 — Qualifications</p>
            <h2 className="section-title">Make your case</h2>
          </div>

          <div className="form-grid">
            <div className="field full-width">
              <label>Your Best Quality <span className="required">*</span></label>
              <input type="text" name="best_quality" placeholder="e.g., I always text back (within 3 hours)" required />
            </div>
            <div className="field full-width">
              <label>Your Red Flags <span className="hint">(optional, but we will find out)</span></label>
              <textarea name="red_flags" placeholder="Be honest. It actually helps your case." />
            </div>
            <div className="field full-width">
              <label>
                Love Language <span className="required">*</span>
              </label>
              <select name="love_language" required defaultValue="">
                <option value="" disabled>Select your love language...</option>
                <option value="words_of_affirmation">Words of Affirmation (very cute)</option>
                <option value="quality_time">Quality Time (respectful)</option>
                <option value="physical_touch">Physical Touch (noted)</option>
                <option value="acts_of_service">Acts of Service (hiring you)</option>
                <option value="gift_giving">Gift Giving (fiscally bold)</option>
                <option value="memes">Sending Memes at 2am (relatable)</option>
                <option value="feeding_people">Feeding people food (marry me)</option>
              </select>
            </div>
          </div>

          <hr className="divider" />

          {/* Section 3: Rizz Check */}
          <div className="section-header">
            <p className="section-tag">Section 03 — The Rizz Assessment</p>
            <h2 className="section-title">Prove yourself</h2>
          </div>

          <div className="form-grid">
            <div className="field full-width">
              <label>
                Rizz Sample <span className="required">*</span>{' '}
                <span className="hint">— your best opening line, right now</span>
              </label>
              <textarea
                name="rizz_sample"
                placeholder='e.g., "Are you a library book? Because I keep checking you out and getting fined for it."'
                required
              />
            </div>
            <div className="field full-width">
              <label>Why specifically YOU? <span className="required">*</span></label>
              <textarea
                name="why_you"
                placeholder="Sell yourself. This is a competitive process."
                required
              />
            </div>
            <div className="field full-width">
              <label>Deal Breakers for You <span className="hint">(what would disqualify US)</span></label>
              <input type="text" name="dealbreakers" placeholder="e.g., people who don't tip, slow walkers, pineapple on pizza advocates" />
            </div>
          </div>

          <hr className="divider" />

          {/* Section 4: Self Rating */}
          <div className="section-header">
            <p className="section-tag">Section 04 — Confidence Check</p>
            <h2 className="section-title">Rate yourself honestly</h2>
          </div>

          <div className="slider-field">
            <label>How would you rate yourself out of 10? <span className="required">*</span></label>
            <div className="slider-row">
              <input
                type="range"
                ref={sliderRef}
                min={1}
                max={10}
                value={rating}
                onChange={handleSliderChange}
                style={{ '--val': `${((rating - 1) / 9) * 100}%` } as React.CSSProperties}
              />
              <span className="slider-value">{rating}</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {rating <= 3 && "Humble. Suspicious, but humble."}
              {rating >= 4 && rating <= 6 && "Realistic. Points awarded."}
              {rating >= 7 && rating <= 8 && "Confident. We respect it."}
              {rating === 9 && "Bold. We like bold."}
              {rating === 10 && "A 10 applying to be someone's crush? Either delusional or correct."}
            </span>
          </div>

          <hr className="divider" />

          {/* Disclaimer */}
          <div className="disclaimer">
            <strong>📋 Important Notice:</strong> By submitting this application you acknowledge that (1) this is a joke website, (2) your data is stored in a database that will be seen only by me, (3) acceptance is not guaranteed and is entirely arbitrary, (4) being rejected does not reflect your worth as a human being (probably).
          </div>

          {error && <div className="error-msg">⚠️ {error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting... 🫀' : 'Submit My Application 💘'}
          </button>
        </div>
      </form>

      <div className="footer">
        <p>© {new Date().getFullYear()} The Crush Application Portal · Built with too much time and genuine hope</p>
      </div>
    </div>
  )
}
