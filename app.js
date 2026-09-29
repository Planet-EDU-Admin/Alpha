const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function showToast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => element.classList.remove("show"), 2200);
}

function setModal(id, open) {
  const modal = $(`#${id}`);
  modal.classList.toggle("open", open);
  modal.setAttribute("aria-hidden", String(!open));
}

const saved = localStorage.getItem("alfa-book");
if (saved) {
  try {
    const state = JSON.parse(saved);
    if (state.left) $(".caption-card h1").innerHTML = state.left;
    if (state.right) $(".hero-caption h2").innerHTML = state.right;
  } catch {
    localStorage.removeItem("alfa-book");
  }
}

function saveProject() {
  const state = {
    left: $(".caption-card h1").innerHTML,
    right: $(".hero-caption h2").innerHTML,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem("alfa-book", JSON.stringify(state));
  $(".project-title small").textContent = "Saved just now";
}

$$('[contenteditable="true"]').forEach((element) => {
  element.addEventListener("input", () => {
    $(".project-title small").textContent = "Saving…";
    clearTimeout(window.saveTimer);
    window.saveTimer = setTimeout(saveProject, 450);
  });
});

function bindPhotoDrag(element) {
  element.addEventListener("dragstart", (event) => {
    const image = element.style.backgroundImage || getComputedStyle(element).backgroundImage;
    event.dataTransfer.setData("text/plain", image);
  });
}

$$('.thumb').forEach(bindPhotoDrag);
$("#fileInput").addEventListener("change", (event) => {
  const files = [...event.target.files];
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const button = document.createElement("button");
      button.className = "thumb";
      button.draggable = true;
      button.style.backgroundImage = `url(${reader.result})`;
      button.ariaLabel = file.name;
      $("#photoGrid").prepend(button);
      bindPhotoDrag(button);
    };
    reader.readAsDataURL(file);
  });
  $("#assetCount").textContent = Number($("#assetCount").textContent) + files.length;
  showToast(`${files.length} photo${files.length === 1 ? "" : "s"} added`);
});

$$('.frame, .hero-photo').forEach((frame) => {
  frame.addEventListener("click", () => {
    $$(".frame, .hero-photo").forEach((item) => item.classList.remove("selected-frame"));
    frame.classList.add("selected-frame");
  });
  frame.addEventListener("dragover", (event) => event.preventDefault());
  frame.addEventListener("drop", (event) => {
    event.preventDefault();
    frame.style.backgroundImage = event.dataTransfer.getData("text/plain");
    showToast("Photo placed · autosaved");
  });
});

function enterPreview() {
  if (document.body.classList.contains("preview-mode")) return;
  document.body.classList.add("preview-mode");
  const close = document.createElement("button");
  close.className = "btn primary";
  close.id = "closePreview";
  close.textContent = "Close preview";
  Object.assign(close.style, { position: "fixed", right: "20px", top: "20px", zIndex: 30 });
  close.onclick = () => {
    document.body.classList.remove("preview-mode");
    close.remove();
  };
  document.body.append(close);
}

$("#previewBtn").addEventListener("click", enterPreview);
$("#exportBtn").onclick = () => setModal("exportModal", true);
$("#exportModal .modal-close").onclick = () => setModal("exportModal", false);

$("#downloadBtn").onclick = () => {
  const manifest = {
    schema: "com.alfa-cent.photobook.project/v1",
    title: $(".project-title span:nth-child(2)").textContent,
    printProfile: null,
    printProfileStatus: "supplier-confirmation-required",
    pages: 16,
    spread: {
      index: 3,
      leftTitle: $(".caption-card h1").innerText,
      rightTitle: $(".hero-caption h2").innerText,
    },
    exportedAt: new Date().toISOString(),
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "alfa-photobook-project.json";
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("Project manifest downloaded");
};

$("#addText").onclick = () => {
  const text = document.createElement("p");
  text.contentEditable = "true";
  text.textContent = "Add your story here…";
  text.style.cssText = "position:absolute;left:12%;top:12%;z-index:5;background:#fff;padding:8px;font:12px DM Sans";
  $(".right-page").append(text);
  text.focus();
  showToast("Text box added");
};

let pages = 8;
$("#addPage").onclick = () => {
  pages += 2;
  const button = document.createElement("button");
  button.className = "mini";
  button.innerHTML = `<span class="mini-spread pale"></span><small>${pages - 1}–${pages}</small>`;
  $("#addPage").before(button);
  showToast("New spread added");
};

$("#smartBtn").onclick = () => showToast("Smart draft ready — 6 photos arranged by date");

$$('.tool').forEach((tool) => {
  tool.onclick = () => {
    $$(".tool").forEach((item) => item.classList.remove("active"));
    tool.classList.add("active");
    const layoutsOpen = tool.dataset.panel === "layouts";
    $("#layoutsPanel").hidden = !layoutsOpen;
    if (!layoutsOpen) showToast(`${tool.textContent.trim()} panel selected`);
  };
});

$$('.layout-option').forEach((option) => {
  option.onclick = () => {
    $$(".layout-option").forEach((item) => item.classList.remove("selected"));
    option.classList.add("selected");
    showToast(`${option.ariaLabel} layout applied`);
  };
});

$$('.view-switch button').forEach((button) => {
  button.onclick = () => {
    $$(".view-switch button").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    if (button.dataset.view === "preview") enterPreview();
    else showToast(`${button.textContent.trim()} view selected`);
  };
});

let zoom = 82;
$$('.zoom button').forEach((button, index) => {
  button.onclick = () => {
    zoom = Math.max(50, Math.min(110, zoom + (index ? 8 : -8)));
    $("#zoomValue").textContent = `${zoom}%`;
    $("#book").style.width = `min(${890 * zoom / 82}px, 96%)`;
  };
});
