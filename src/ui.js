// ui.js — element factory + basic field registry (inputs + views)
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "style") Object.assign(node.style, v);
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null) node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

export function fieldRow(id, label, input) {
  const row = el("div", { class: "row" });
  row.append(el("label", { for: id }, [label]), input);
  return row;
}

export const Field = {
  renderers: {
    "text_field": ({ id, name, placeholder = "", value = "" }) => {
      const input = el("input", { id, name: name || id, class: "input", type: "text", placeholder });
      if (value) input.value = value;
      return input;
    },
    "number_field": ({ id, name, value = "", min, max, step }) => {
      const input = el("input", { id, name: name || id, class: "input", type: "number" });
      if (value !== "") input.value = value;
      if (min != null) input.min = String(min);
      if (max != null) input.max = String(max);
      if (step != null) input.step = String(step);
      return input;
    },
    "textarea": ({ id, name, placeholder = "", value = "", rows = 4 }) => {
      const textarea = el("textarea", { id, name: name || id, class: "textarea", placeholder, rows });
      if (value) textarea.value = value;
      return textarea;
    },
    "select": ({ id, name, options = [], value = "" }) => {
      const sel = el("select", { id, name: name || id, class: "input" });
      for (const opt of options) {
        const o = el("option", { value: opt.value }, [opt.label || opt.value]);
        if (opt.value === value) o.selected = true;
        sel.appendChild(o);
      }
      return sel;
    },
    "text": ({ text = "", className = "" }) => {
      const s = el("span", {}, [String(text)]);
      if (className) s.className = className;
      return s;
    },
  },
  create(cfg) {
    const r = this.renderers[cfg.type];
    if (!r) throw new Error(`Unknown field type: ${cfg.type}`);
    return r(cfg);
  }
};
