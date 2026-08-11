/**
 * house.js — page script for house.html
 */
(function () {
  "use strict";

  const { amenities, gallery, rules } = window.MS_DATA.house;

  function renderAmenities() {
    const grid = document.getElementById("amenity-grid");
    grid.innerHTML = amenities.map((a) => `
      <div class="amenity">
        <span class="dot"></span>
        <div>
          <h4>${a.name}</h4>
          <p>${a.detail}</p>
        </div>
      </div>
    `).join("");
  }

  function renderGallery() {
    const grid = document.getElementById("gallery-grid");
    grid.innerHTML = gallery.map((g, i) => `
      <button class="gallery-tile" type="button" data-index="${i}" aria-label="View ${g.name}">
        <span class="caption">
          <span class="name">${g.name}</span><br>
          <span class="tag">${g.tag}</span>
        </span>
      </button>
    `).join("");

    grid.querySelectorAll(".gallery-tile").forEach((tile) => {
      tile.addEventListener("click", () => openLightbox(Number(tile.dataset.index)));
    });
  }

  function renderAccordion() {
    const wrap = document.getElementById("rules-accordion");
    wrap.innerHTML = rules.map((r, i) => `
      <div class="accordion-item">
        <button class="accordion-trigger" aria-expanded="false" aria-controls="panel-${i}" id="trigger-${i}">
          ${r.q}
          <span class="plus">+</span>
        </button>
        <div class="accordion-panel" id="panel-${i}" role="region" aria-labelledby="trigger-${i}">
          <p>${r.a}</p>
        </div>
      </div>
    `).join("");

    wrap.querySelectorAll(".accordion-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = document.getElementById(btn.getAttribute("aria-controls"));
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.style.maxHeight = isOpen ? "0px" : panel.scrollHeight + "px";
      });
    });
  }

  /* ---------- lightbox ---------- */
  let currentIndex = 0;
  const lightbox = document.getElementById("lightbox");
  const frame = document.getElementById("lightbox-frame");
  const nameEl = document.getElementById("lightbox-name");
  const tagEl = document.getElementById("lightbox-tag");

  function paintLightbox() {
    const item = gallery[currentIndex];
    nameEl.textContent = item.name;
    tagEl.textContent = item.tag;
    const tile = document.querySelectorAll(".gallery-tile")[currentIndex];
    const styles = getComputedStyle(tile);
    frame.style.setProperty("--tile-a", styles.getPropertyValue("--tile-a"));
    frame.style.setProperty("--tile-b", styles.getPropertyValue("--tile-b"));
  }

  function openLightbox(index) {
    currentIndex = index;
    paintLightbox();
    lightbox.hidden = false;
    document.getElementById("lightbox-close").focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.removeEventListener("keydown", onKeydown);
  }

  function step(delta) {
    currentIndex = (currentIndex + delta + gallery.length) % gallery.length;
    paintLightbox();
  }

  function onKeydown(e) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  }

  function initLightboxControls() {
    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-prev").addEventListener("click", () => step(-1));
    document.getElementById("lightbox-next").addEventListener("click", () => step(1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderAmenities();
    renderGallery();
    renderAccordion();
    initLightboxControls();
  });
})();
