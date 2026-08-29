document.addEventListener("DOMContentLoaded", () => {
  const bar       = document.getElementById("progress-bar");
  const pct       = document.getElementById("progress-pct");
  const labelEl   = document.getElementById("progress-label");
  const etaSecs   = document.getElementById("eta-secs");
  const dlSection = document.getElementById("download-section");
  const copyBtn   = document.getElementById("copy-cmd");
  const copyLabel = document.getElementById("copy-label");
  const cmdEl     = document.getElementById("install-cmd");

  const steps = [
    { label: "Verifying integrity...",    pct: 18,  delay: 400 },
    { label: "Checking signatures...",    pct: 37,  delay: 750 },
    { label: "Resolving dependencies...", pct: 54,  delay: 650 },
    { label: "Packaging installer...",    pct: 71,  delay: 700 },
    { label: "Finalizing...",             pct: 88,  delay: 500 },
    { label: "Ready.",                    pct: 100, delay: 350 },
  ];

  let elapsed = 0;
  const totalMs = steps.reduce((s, x) => s + x.delay, 0);

  function runSteps(i) {
    if (i >= steps.length) {
      showInstall();
      return;
    }
    const step = steps[i];
    setTimeout(() => {
      bar.style.width = step.pct + "%";
      pct.textContent = step.pct + "%";
      labelEl.textContent = step.label;
      elapsed += step.delay;
      const remaining = Math.ceil((totalMs - elapsed) / 1000);
      etaSecs.textContent = remaining > 0 ? remaining + "s" : "0s";
      runSteps(i + 1);
    }, step.delay);
  }

  function showInstall() {
    dlSection.style.display = "block";
  }

  if (copyBtn && cmdEl) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(cmdEl.textContent.trim()).then(() => {
        copyLabel.textContent = "Copied!";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyLabel.textContent = "Copy";
          copyBtn.classList.remove("copied");
        }, 2000);
      }).catch(() => {
        // fallback
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(cmdEl);
        sel.removeAllRanges();
        sel.addRange(range);
      });
    });
  }

  setTimeout(() => runSteps(0), 200);
});
