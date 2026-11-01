document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(`#${button.dataset.copyTarget}`);
    const status = button.parentElement.querySelector(".copy-status");

    if (!target) {
      return;
    }

    try {
      await navigator.clipboard.writeText(target.value.trim());
      status.textContent = status.dataset.copied;
    } catch {
      target.select();
      document.execCommand("copy");
      status.textContent = status.dataset.copied;
    }

    window.setTimeout(() => {
      status.textContent = "";
    }, 1800);
  });
});
