/**
 * stay.js — page script for index.html ("Your stay")
 */
(function () {
  "use strict";

  const { booking } = window.MS_DATA;

  /* ---------- live countdown to check-in ---------- */
  function initCountdown() {
    const el = document.getElementById("countdown");
    if (!el) return;
    const checkIn = new Date(booking.checkIn.iso);
    const checkOut = new Date(booking.checkOut.iso);

    function tick() {
      const now = new Date();
      let label, diffMs, phaseClass;

      if (now < checkIn) {
        diffMs = checkIn - now;
        phaseClass = "upcoming";
        label = "arriving in";
      } else if (now < checkOut) {
        diffMs = checkOut - now;
        phaseClass = "current";
        label = "checking out in";
      } else {
        el.textContent = "We hope you had a wonderful stay in Cassis.";
        el.className = "countdown past";
        return;
      }

      const days = Math.floor(diffMs / 86400000);
      const hours = Math.floor((diffMs % 86400000) / 3600000);
      const mins = Math.floor((diffMs % 3600000) / 60000);

      const parts = [];
      if (days) parts.push(`${days}d`);
      if (days || hours) parts.push(`${hours}h`);
      parts.push(`${mins}m`);

      el.textContent = `✦ ${label} ${parts.join(" ")}`;
      el.className = `countdown ${phaseClass}`;
    }

    tick();
    setInterval(tick, 30000);
  }

  /* ---------- print receipt ---------- */
  function initPrint() {
    const btn = document.getElementById("print-receipt");
    if (btn) btn.addEventListener("click", () => window.print());
  }

  /* ---------- add to calendar (.ics) ---------- */
  function initCalendar() {
    const btn = document.getElementById("add-to-calendar");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const ics = MS.buildICS({
        title: `Maison Soleil — ${booking.room.name}`,
        description: `Booking ${booking.confirmationCode}. Ring the bell by the blue door.`,
        location: "12 Rue des Oliviers, Cassis, France",
        start: new Date(booking.checkIn.iso),
        end: new Date(booking.checkOut.iso),
        uid: `${booking.confirmationCode}@maisonsoleil`
      });
      MS.downloadFile("maison-soleil-stay.ics", ics, "text/calendar");
      const original = btn.textContent;
      btn.textContent = "Added ✓";
      setTimeout(() => (btn.textContent = original), 1800);
    });
  }

  /* ---------- copy wifi password ---------- */
  function initWifiCopy() {
    const btn = document.getElementById("copy-wifi");
    if (btn) {
      btn.addEventListener("click", () => MS.copyText(booking.wifi.password, btn));
    }
  }

  /* ---------- barcode: deterministic pattern derived from the confirmation code ---------- */
  function initBarcode() {
    const bc = document.getElementById("barcode");
    if (!bc) return;
    const seed = booking.confirmationCode.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    let x = seed;
    const rand = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
    for (let i = 0; i < 40; i++) {
      const bar = document.createElement("span");
      const w = rand() > 0.75 ? 3 : 1;
      const h = 14 + rand() * 12;
      bar.style.width = w + "px";
      bar.style.height = h + "px";
      bc.appendChild(bar);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initCountdown();
    initPrint();
    initCalendar();
    initWifiCopy();
    initBarcode();
  });
})();
