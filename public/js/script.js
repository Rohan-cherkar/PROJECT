// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();

async function toggleLike(event, listingId) {
  event.preventDefault();
  event.stopPropagation();

  const btn = event.currentTarget;
  const icon = btn.querySelector("i");
  const isCurrentlyLiked = btn.classList.contains("liked");

  // Instant UI feedback
  if (isCurrentlyLiked) {
    btn.classList.remove("liked");
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
  } else {
    btn.classList.add("liked");
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
  }

  try {
    const res = await fetch(`/listings/${listingId}/watchlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }

    const data = await res.json();
    if (data && data.success) {
      if (data.isLiked) {
        btn.classList.add("liked");
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      } else {
        btn.classList.remove("liked");
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
      }
    }
  } catch (err) {
    console.error("Error toggling watchlist:", err);
  }
}
