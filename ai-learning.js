document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(`#${button.dataset.copyTarget}`);
    const status = button.parentElement.querySelector(".copy-status");

    if (!target) {
      return;
    }

    try {
      await navigator.clipboard.writeText(target.value.trim());
      status.textContent = "Copied";
    } catch {
      target.select();
      document.execCommand("copy");
      status.textContent = "Copied";
    }

    window.setTimeout(() => {
      status.textContent = "";
    }, 1800);
  });
});
