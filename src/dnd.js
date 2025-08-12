// dnd.js — drag and drop between columns, minimize + close behavior

export function findDraggableWin(e) {
  const titlebar = e.target.closest(".titlebar");
  if (!titlebar) return null;
  if (e.target.closest(".actions") || e.target.closest(".icon-btn")) return null;
  return titlebar.closest(".miniwin");
}

export function calcDragPosition(winStart, pointerStart, e) {
  return {
    left: winStart.x + (e.clientX - pointerStart.x),
    top: winStart.y + (e.clientY - pointerStart.y),
  };
}

export function initWindowDnD() {
  const columnsEl = document.getElementById("columns");
  if (!columnsEl) return;

  let draggingWin = null;
  let pointerStart = null;
  let winStart = null;
  const dropMarker = document.createElement("div");
  dropMarker.className = "drop-marker";

  columnsEl.addEventListener("pointerdown", (e) => {
    const win = findDraggableWin(e);
    if (!win) return;
    draggingWin = win;
    draggingWin.classList.add("dragging");
    pointerStart = { x: e.clientX, y: e.clientY };
    const rect = draggingWin.getBoundingClientRect();
    winStart = { x: rect.left, y: rect.top, w: rect.width, h: rect.height };

    draggingWin.style.setProperty("--drag-w", `${winStart.w}px`);
    draggingWin.style.setProperty("--drag-h", `${winStart.h}px`);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp, { once: true });
  });

  function onMove(e) {
    if (!draggingWin) return;
    const { left, top } = calcDragPosition(winStart, pointerStart, e);
    draggingWin.style.transform = `translate(${left - winStart.x}px, ${top - winStart.y}px)`;

    const colLeft = document.getElementById("col-left");
    const colRight = document.getElementById("col-right");
    const targetCol = (e.clientX < (columnsEl.getBoundingClientRect().left + columnsEl.clientWidth / 2)) ? colLeft : colRight;

    const rect = targetCol.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const siblings = Array.from(targetCol.querySelectorAll(".miniwin:not(.dragging)"));
    let inserted = false;
    for (const sib of siblings) {
      const r = sib.getBoundingClientRect();
      const mid = r.top + r.height / 2 - rect.top;
      if (relY < mid) {
        targetCol.insertBefore(dropMarker, sib);
        inserted = true;
        break;
      }
    }
    if (!inserted) targetCol.appendChild(dropMarker);
  }

  function onUp(e) {
    document.removeEventListener("pointermove", onMove);
    if (!draggingWin) return;
    draggingWin.classList.remove("dragging");
    draggingWin.style.transform = "";
    if (dropMarker.parentNode) {
      const targetCol = dropMarker.parentNode;
      targetCol.insertBefore(draggingWin, dropMarker);
      dropMarker.remove();
      draggingWin.focus({ preventScroll: true });
    }
    draggingWin = null;
  }
}
