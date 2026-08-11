/**
 * shared.js
 * Loaded on every page. No dependencies, no build step.
 * Exposes a small `MS` namespace so page scripts can reuse these helpers.
 */
window.MS = (function () {
  "use strict";

  /* ---------- nav: mark the current page active ---------- */
  function initNav() {
    const here = (document.body.dataset.page || "").toLowerCase();
    document.querySelectorAll("nav a[data-page]").forEach((a) => {
      const li = a.closest("li");
      if (!li) return;
      if (a.dataset.page === here) {
        li.classList.add("active");
        a.setAttribute("aria-current", "page");
      } else {
        li.classList.remove("active");
        a.removeAttribute("aria-current");
      }
    });
  }

  /* ---------- weather: live conditions for Cassis via Open-Meteo ---------- */
  // WMO weather codes -> short label + a mood class used to tint the card
  const WEATHER_CODES = {
    0: ["Clear sky", "sunny"], 1: ["Mostly clear", "sunny"], 2: ["Partly cloudy", "cloudy"],
    3: ["Overcast", "cloudy"], 45: ["Foggy", "cloudy"], 48: ["Foggy", "cloudy"],
    51: ["Light drizzle", "rainy"], 53: ["Drizzle", "rainy"], 55: ["Heavy drizzle", "rainy"],
    61: ["Light rain", "rainy"], 63: ["Rain", "rainy"], 65: ["Heavy rain", "rainy"],
    71: ["Light snow", "rainy"], 73: ["Snow", "rainy"], 75: ["Heavy snow", "rainy"],
    80: ["Rain showers", "rainy"], 81: ["Rain showers", "rainy"], 82: ["Violent showers", "rainy"],
    95: ["Thunderstorm", "rainy"], 96: ["Thunderstorm", "rainy"], 99: ["Thunderstorm", "rainy"]
  };

  async function initWeather() {
    const card = document.querySelector(".weather-card");
    if (!card) return;
    const tempEl = card.querySelector(".temp");
    const descEl = card.querySelector(".desc");
    const { lat, lon, name } = MS_DATA.location;

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&wind_speed_unit=kmh&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("weather request failed");
      const data = await res.json();
      const temp = Math.round(data.current.temperature_2m);
      const code = data.current.weather_code;
      const [label, mood] = WEATHER_CODES[code] || ["Fair", "sunny"];

      tempEl.textContent = `${temp}°`;
      descEl.textContent = `${label} · live in ${name}`;
      card.classList.remove("sunny", "cloudy", "rainy");
      card.classList.add(mood);
    } catch (err) {
      // Fail quietly — the static markup already shows a sensible default.
      console.warn("Live weather unavailable:", err);
    }
  }

  /* ---------- clipboard, with visual + graceful fallback ---------- */
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    if (!ok) throw new Error("execCommand copy failed");
  }

  async function copyText(text, buttonEl, successLabel = "COPIED") {
    const original = buttonEl.textContent;
    let copied = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (err) {
        // Permission denied or unsupported — fall through to the legacy path below.
      }
    }
    if (!copied) {
      try {
        fallbackCopy(text);
        copied = true;
      } catch (err) {
        // Both paths failed — surface that below.
      }
    }

    buttonEl.textContent = copied ? successLabel : "COPY FAILED";
    buttonEl.classList.toggle("copied", copied);
    setTimeout(() => {
      buttonEl.textContent = original;
      buttonEl.classList.remove("copied");
    }, 1800);
  }

  /* ---------- date helpers ---------- */
  function pad(n) { return String(n).padStart(2, "0"); }

  // Builds an RFC5545 .ics VCALENDAR string for a single stay
  function buildICS({ title, description, location, start, end, uid }) {
    const fmt = (d) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Maison Soleil//Booking//EN",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
  }

  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function formatCurrency(amount, currency = "EUR") {
    return new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(amount);
  }

  /* ---------- unread-messages badge on the sidebar nav ---------- */
  function updateMessagesBadge() {
    const badge = document.getElementById("messages-badge");
    if (!badge) return;
    const lastRead = localStorage.getItem("ms_messages_last_read");
    const stored = JSON.parse(localStorage.getItem("ms_messages") || "null") || MS_DATA.messages;
    const unread = stored.filter((m) => m.from === "host" && (!lastRead || new Date(m.time) > new Date(lastRead))).length;
    if (unread > 0) {
      badge.textContent = String(unread);
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initWeather();
    updateMessagesBadge();
  });

  return { initNav, initWeather, copyText, buildICS, downloadFile, formatCurrency, pad, updateMessagesBadge };
})();
