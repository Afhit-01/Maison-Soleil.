/**
 * around-town.js — page script for around-town.html
 */
(function () {
  "use strict";

  const spots = window.MS_DATA.spots;
  const CATEGORY_LABEL = { eat: "Eat", see: "See", do: "Do", beach: "Beach" };
  let activeFilter = "all";

  function isOpenNow(hours) {
    const now = new Date();
    const [oh, om] = hours.open.split(":").map(Number);
    const [ch, cm] = hours.close.split(":").map(Number);
    const openMins = oh * 60 + om;
    const closeMins = ch * 60 + cm;
    const nowMins = now.getHours() * 60 + now.getMinutes();
    return nowMins >= openMins && nowMins < closeMins;
  }

  function render() {
    const grid = document.getElementById("spot-grid");
    const list = activeFilter === "all" ? spots : spots.filter((s) => s.category === activeFilter);

    if (!list.length) {
      grid.innerHTML = `<p style="color:var(--ink-soft); font-size:13.5px;">Nothing in this category yet.</p>`;
      return;
    }

    grid.innerHTML = list.map((s) => {
      const open = isOpenNow(s.hours);
      return `
        <div class="spot-card">
          <div class="row-top">
            <h4>${s.name}</h4>
            <span class="distance">${s.distance}</span>
          </div>
          <p>${s.desc}</p>
          <span class="status-pill ${open ? "open" : "closed"}">
            <span class="dot"></span>
            ${open ? `Open until ${s.hours.close}` : `Closed · opens ${s.hours.open}`}
          </span>
        </div>
      `;
    }).join("");
  }

  function initTabs() {
    const tabs = document.querySelectorAll(".filter-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        activeFilter = tab.dataset.filter;
        render();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    render();
    // Open/closed status can flip while the page is left open — refresh every minute.
    setInterval(render, 60000);
  });
})();
