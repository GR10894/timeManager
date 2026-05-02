document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("scrollTopBtn");

  window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight * 0.6) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", () => {
    if (window.allowBackToTopScroll) {
      window.allowBackToTopScroll();
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});