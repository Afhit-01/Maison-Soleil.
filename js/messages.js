/**
 * messages.js — page script for messages.html
 */
(function () {
  "use strict";

  const STORAGE_KEY = "ms_messages";
  const LAST_READ_KEY = "ms_messages_last_read";

  function loadMessages() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return stored || window.MS_DATA.messages.slice();
    } catch {
      return window.MS_DATA.messages.slice();
    }
  }

  function saveMessages(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  let messages = loadMessages();

  function render() {
    const log = document.getElementById("chat-log");
    log.innerHTML = messages.map((m) => `
      <div class="msg-row ${m.from}">
        <div class="bubble ${m.from}">${escapeHTML(m.text)}</div>
        <div class="bubble-time">${formatTime(m.time)}</div>
      </div>
    `).join("");
    log.scrollTop = log.scrollHeight;
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function showTyping() {
    const log = document.getElementById("chat-log");
    const el = document.createElement("div");
    el.className = "typing";
    el.id = "typing-indicator";
    el.textContent = "Margaux is typing…";
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById("typing-indicator");
    if (el) el.remove();
  }

  // Very small keyword-matched auto-reply — enough to feel responsive without a backend.
  function craftReply(text) {
    const t = text.toLowerCase();
    if (t.includes("wifi") || t.includes("password")) return "It's on the welcome card — network is Le Soleil · Guest, password soleil-2026.";
    if (t.includes("breakfast")) return "Breakfast runs 8–10:30 on the terrace — you can pre-order from the Breakfast tab if you'd like.";
    if (t.includes("late") || t.includes("check-in") || t.includes("check in") || t.includes("arriv")) return "No trouble at all — the key's in the terracotta pot by the olive tree if we're out.";
    if (t.includes("thank")) return "Of course — that's what we're here for!";
    if (t.includes("cat") || t.includes("poivre")) return "Ha, he'll act uninterested for about ten minutes, then he's your shadow for the week.";
    return "Got it, thank you for letting me know — I'll take care of it.";
  }

  function sendMessage(text) {
    const guestMsg = { from: "guest", time: new Date().toISOString(), text };
    messages.push(guestMsg);
    saveMessages(messages);
    render();

    showTyping();
    const delay = 900 + Math.random() * 900;
    setTimeout(() => {
      hideTyping();
      const hostMsg = { from: "host", time: new Date().toISOString(), text: craftReply(text) };
      messages.push(hostMsg);
      saveMessages(messages);
      render();
    }, delay);
  }

  function initForm() {
    const form = document.getElementById("chat-form");
    const input = document.getElementById("chat-input");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      sendMessage(text);
      input.value = "";
      input.focus();
    });
  }

  function markRead() {
    localStorage.setItem(LAST_READ_KEY, new Date().toISOString());
    if (window.MS && MS.updateMessagesBadge) MS.updateMessagesBadge();
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    initForm();
    markRead();
  });
})();
