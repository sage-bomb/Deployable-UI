// windowing.js — registry + modal/resize helpers
import { el } from "./ui.js";

const WindowTypes = new Map(); // type -> render(config, winId) => Element

export function registerWindowType(type, renderFn) {
  WindowTypes.set(type, renderFn);
}

export function createMiniWindowFromConfig(config) {
  const winId = config.id || `win_${Math.random().toString(36).slice(2,8)}`;
  const win = el("div", { class: "miniwin", tabindex: "0", "data-id": winId, id: winId });

  const titlebar = el("div", { class: "titlebar" }, [
    el("div", { class: "title" }, [config.title || "Untitled"]),
    el("div", { class: "actions" }, [
      el("button", { class: "icon-btn js-min", title: "Minimize", "aria-label": "Minimize", "data-win": winId }, ["—"]),
      el("button", { class: "icon-btn js-close", title: "Close", "aria-label": "Close", "data-win": winId }, ["✕"])
    ])
  ]);

  const contentInner = el("div", { class: "content-inner" });
  const content = el("div", { class: "content" }, [contentInner]);

  const renderer = WindowTypes.get(config.window_type);
  if (!renderer) {
    contentInner.append(el("div", { class: "li-subtle" }, [`Unknown window type: ${config.window_type}`]));
  } else {
    const view = renderer(config, winId);
    if (view) contentInner.append(view);
  }

  const resizer = el("div", { class: "win-resizer-y", title: "Drag to resize" });

  win.append(titlebar, content, resizer);

  const col = document.getElementById(config.col === "left" ? "col-left" : "col-right");
  (col || document.body).appendChild(win);
  win.focus();
  return winId;
}

export function initWindowResize() {
  let resizing = null;
  let startY = 0;
  let startH = 0;

  function onMove(e) {
    if (!resizing) return;
    const dy = e.clientY - startY;
    const newH = Math.max(180, startH + dy);
    resizing.style.height = `${newH}px`;
  }

  function onUp() {
    document.removeEventListener("pointermove", onMove);
    resizing = null;
  }

  document.addEventListener("pointerdown", (e) => {
    const handle = e.target.closest(".win-resizer-y");
    if (!handle) return;
    e.preventDefault();
    resizing = handle.closest(".miniwin");
    const rect = resizing.getBoundingClientRect();
    startY = e.clientY;
    startH = rect.height;
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp, { once: true });
  });
}
