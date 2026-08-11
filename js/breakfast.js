/**
 * breakfast.js — page script for breakfast.html
 */
(function () {
  "use strict";

  const menu = window.MS_DATA.breakfastMenu;
  const STORAGE_KEY = "ms_breakfast_order";
  const WINDOW_START = 8 * 60;      // 08:00 in minutes
  const WINDOW_END = 10 * 60 + 30;  // 10:30 in minutes

  function renderMenu() {
    const grid = document.getElementById("menu-grid");
    grid.innerHTML = menu.map((item) => `
      <label class="menu-item" for="item-${item.id}">
        <input type="checkbox" id="item-${item.id}" name="items" value="${item.id}">
        <div>
          <div class="name">${item.name}</div>
          <div class="tag">${item.tag}</div>
          <div class="desc">${item.desc}</div>
        </div>
      </label>
    `).join("");
  }

  function minutesFromTimeString(str) {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
  }

  function validateTime(value) {
    const mins = minutesFromTimeString(value);
    return mins >= WINDOW_START && mins <= WINDOW_END;
  }

  function getSavedOrder() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  }

  function saveOrder(order) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  }

  function clearOrder() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function renderSummary() {
    const order = getSavedOrder();
    const statusEl = document.getElementById("order-status");
    const listEl = document.getElementById("order-list");
    const clearBtn = document.getElementById("clear-order");

    if (!order) {
      statusEl.innerHTML = "";
      listEl.innerHTML = `<li class="empty">No order sent yet — pick a few things and send it through.</li>`;
      clearBtn.style.display = "none";
      return;
    }

    statusEl.innerHTML = `<div class="order-confirmed">✓ Sent for ${order.time} · kitchen has it</div>`;
    listEl.innerHTML = order.items.map((id) => {
      const item = menu.find((m) => m.id === id);
      return `<li><span>${item ? item.name : id}</span></li>`;
    }).join("") + (order.notes ? `<li style="margin-top:6px; color:var(--ink-soft); font-style:italic;">"${order.notes}"</li>` : "");
    clearBtn.style.display = "block";
  }

  function initForm() {
    const form = document.getElementById("breakfast-form");
    const timeInput = document.getElementById("delivery-time");
    const timeHint = document.getElementById("time-hint");
    const clearBtn = document.getElementById("clear-order");

    timeInput.addEventListener("input", () => {
      const ok = validateTime(timeInput.value);
      timeHint.textContent = ok ? "Between 8:00 and 10:30." : "Breakfast runs 8:00–10:30 — pick a time in that window.";
      timeHint.classList.toggle("error", !ok);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const checked = Array.from(form.querySelectorAll('input[name="items"]:checked')).map((i) => i.value);

      if (!checked.length) {
        timeHint.textContent = "Choose at least one item before sending.";
        timeHint.classList.add("error");
        return;
      }
      if (!validateTime(timeInput.value)) {
        timeHint.textContent = "Breakfast runs 8:00–10:30 — pick a time in that window.";
        timeHint.classList.add("error");
        timeInput.focus();
        return;
      }

      const order = {
        items: checked,
        time: timeInput.value,
        notes: document.getElementById("notes").value.trim(),
        sentAt: new Date().toISOString()
      };
      saveOrder(order);
      renderSummary();
    });

    clearBtn.addEventListener("click", () => {
      clearOrder();
      form.reset();
      timeInput.value = "08:30";
      renderSummary();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderMenu();
    initForm();
    renderSummary();
  });
})();
