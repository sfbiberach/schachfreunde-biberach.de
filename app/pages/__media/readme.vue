<script setup lang="ts">
if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

definePageMeta({ layout: false })
useSeoMeta({ robots: 'noindex, nofollow' })
</script>

<template>
  <div id="readme-art" aria-label="Vorschau der Website der Schachfreunde Heilbronn-Biberach">
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
  padding: 52px 120px 0;
  background:
    radial-gradient(ellipse 66% 42% at 50% -8%, rgba(71, 85, 105, 0.16), transparent 72%),
    radial-gradient(ellipse 48% 34% at 52% 22%, rgba(59, 130, 246, 0.045), transparent 76%),
    linear-gradient(145deg, #15171c 0%, #101218 56%, #0c0e13 100%);
  color: #f8fafc;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

#readme-art::before {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.035) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse 78% 60% at 50% 0%, #000 0%, rgba(0, 0, 0, 0.76) 52%, transparent 90%);
  pointer-events: none;
  content: '';
}

#readme-art::after {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 160px rgba(0, 0, 0, 0.22);
  pointer-events: none;
  content: '';
}

.readme-intro {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 190px;
  padding-inline: 28px;
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
  height: calc(1000px - 52px - 190px);
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.34);
  border-bottom: 0;
  border-radius: 24px 24px 0 0;
  background: #0b1220;
  box-shadow: 0 28px 64px rgba(0, 0, 0, 0.38), 0 0 56px rgba(51, 65, 85, 0.12);
}

.readme-browser-content {
  width: 1360px;
  height: 100%;
  overflow: hidden;
  background: #0b1220;
}

#readme-site {
  display: block;
  width: 2014.815px;
  height: 1300px;
  border: 0;
  background: #0b1220;
  transform: scale(0.675);
  transform-origin: top left;
}
</style>
