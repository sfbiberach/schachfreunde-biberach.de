<script setup lang="ts">
if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

definePageMeta({ layout: false })
useSeoMeta({ robots: 'noindex, nofollow' })
</script>

<template>
  <div id="readme-art" aria-label="Vorschau der Website der Schachfreunde Heilbronn-Biberach">
    <div class="readme-glow readme-glow-left" />
    <div class="readme-glow readme-glow-right" />

    <header class="readme-intro">
      <div class="readme-brand">
        <span class="readme-logo"><img src="/favicon.svg" alt=""></span>
        <span class="readme-brand-copy">
          <strong>Schachfreunde Heilbronn-Biberach</strong>
          <span>Schachverein seit 1978</span>
        </span>
      </div>
      <div>
        <p class="readme-eyebrow">
          Vereinswebsite
        </p>
        <h1>Schach in Heilbronn-Biberach</h1>
        <p class="readme-subline">
          Aktuelles, Spielbetrieb und Termine auf einen Blick.
        </p>
      </div>
    </header>

    <section class="readme-browser">
      <div class="readme-browser-bar">
        <div class="readme-dots">
          <i /><i /><i />
        </div>
        <div class="readme-address">
          <span class="readme-lock">&#9670;</span>
          schachfreunde-biberach.de
        </div>
      </div>
      <div class="readme-browser-content">
        <iframe id="readme-site" src="/?media-preview=1" title="Aktuelle Startseite" />
      </div>
    </section>
  </div>
</template>

<style scoped>
#readme-art {
  position: fixed;
  inset: 0 auto auto 0;
  z-index: 99999;
  box-sizing: border-box;
  width: 1600px;
  height: 1000px;
  overflow: hidden;
  padding: 48px 120px 42px;
  background:
    linear-gradient(rgba(96, 165, 250, 0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(96, 165, 250, 0.09) 1px, transparent 1px),
    #0f172a;
  background-size: 72px 72px;
  color: #f8fafc;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.readme-glow {
  position: absolute;
  border-radius: 9999px;
  filter: blur(90px);
  opacity: 0.45;
  pointer-events: none;
}

.readme-glow-left {
  top: -260px;
  left: -120px;
  width: 620px;
  height: 620px;
  background: #2563eb;
}

.readme-glow-right {
  right: -260px;
  bottom: -350px;
  width: 760px;
  height: 760px;
  background: #0ea5e9;
}

.readme-intro {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 175px;
}

.readme-intro::after {
  position: absolute;
  top: 34px;
  bottom: 40px;
  left: 565px;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(148, 163, 184, 0.38) 18%, rgba(148, 163, 184, 0.38) 82%, transparent);
  content: '';
}

.readme-brand {
  display: flex;
  align-items: center;
  gap: 18px;
  width: 490px;
  padding-top: 0;
  font-size: 19px;
  font-weight: 750;
  letter-spacing: -0.02em;
}

.readme-logo {
  display: block;
  width: 60px;
  height: 60px;
  filter: drop-shadow(0 12px 24px rgba(2, 6, 23, 0.28));
}

.readme-logo img {
  display: block;
  width: 60px;
  height: 60px;
}

.readme-brand-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.readme-brand-copy strong {
  font-size: 20px;
  font-weight: 650;
  letter-spacing: -0.018em;
  line-height: 1.2;
}

.readme-brand-copy > span {
  color: #bfdbfe;
  font-size: 14.5px;
  font-weight: 520;
  letter-spacing: 0;
  line-height: 1.25;
}

.readme-intro > div:last-child {
  width: 700px;
}

.readme-eyebrow {
  margin: 0 0 7px;
  color: #60a5fa;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.readme-intro h1 {
  margin: 0;
  color: #fff;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 41px;
  font-weight: 760;
  letter-spacing: -0.045em;
  line-height: 1;
}

.readme-subline {
  margin: 12px 0 0;
  color: #cbd5e1;
  font-size: 19px;
  font-weight: 520;
}

.readme-subline span {
  margin: 0 9px;
  color: #3b82f6;
}

.readme-browser {
  position: relative;
  z-index: 2;
  width: 1360px;
  height: 735px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.34);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 40px 90px rgba(2, 6, 23, 0.58), 0 0 90px rgba(37, 99, 235, 0.16), 0 0 0 8px rgba(255, 255, 255, 0.04);
}

.readme-browser-bar {
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 150px 1fr 150px;
  align-items: center;
  height: 46px;
  padding: 0 20px;
  border-bottom: 1px solid #dbe3ef;
  background: #f8fafc;
}

.readme-dots {
  display: flex;
  gap: 9px;
}

.readme-dots i {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: #cbd5e1;
}

.readme-dots i:first-child { background: #fb7185; }
.readme-dots i:nth-child(2) { background: #fbbf24; }
.readme-dots i:last-child { background: #4ade80; }

.readme-address {
  justify-self: center;
  box-sizing: border-box;
  width: 480px;
  padding: 7px 20px;
  border: 1px solid #dbe3ef;
  border-radius: 12px;
  background: #fff;
  color: #475569;
  font-size: 14px;
  text-align: center;
}

.readme-lock {
  margin-right: 8px;
  color: #22c55e;
  font-size: 9px;
}

.readme-browser-content {
  width: 1360px;
  height: 689px;
  overflow: hidden;
  background: #fff;
}

#readme-site {
  display: block;
  width: 1554.286px;
  height: 900px;
  border: 0;
  background: #fff;
  transform: scale(0.875);
  transform-origin: top left;
}
</style>
