/* ========================= 
   PAGE LOADER
========================= */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});

/* =========================
   MOBILE NAV MENU
========================= */
const navLinks = document.getElementById("navLinks");

function showMenu() {
  if (navLinks) navLinks.style.right = "0";
}

function hideMenu() {
  if (navLinks) navLinks.style.right = "-280px";
}

/* =========================
   AOS INIT
========================= */
AOS.init({
  duration: 1000,
  once: true
});

/* =========================
   BACK TO TOP
========================= */
const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  if (backToTop) {
    backToTop.style.display = window.scrollY > 400 ? "block" : "none";
  }
});

/* =========================
   GALLERY LIGHTBOX
========================= */
function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");

  if (lightbox && img) {
    img.src = src;
    lightbox.style.display = "flex";
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) lightbox.style.display = "none";
}

/* =========================
   TESTIMONIAL AUTO SLIDER
========================= */
let testimonialIndex = 0;

function startTestimonialSlider() {
  setInterval(() => {
    const testimonials = document.querySelectorAll(".testimonial");
    if (testimonials.length === 0) return;

    testimonials.forEach(t => t.classList.remove("active"));
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    testimonials[testimonialIndex].classList.add("active");
  }, 4000);
}

/* =========================
   LOAD REVIEWS FROM BACKEND
   (UPDATED FOR DEPLOYMENT)
========================= */
async function loadReviews() {
  try {
    // ✅ Changed from localhost URL to relative API path
    const res = await fetch("/api/dashboard");
    const data = await res.json();

    console.log("Dashboard Data:", data);

    const slider = document.querySelector(".testimonial-slider");
    if (!slider) return;

    const reviews = data.messages || [];

    if (reviews.length === 0) {
      console.log("No reviews found");
      return;
    }

    slider.innerHTML = "";

    reviews.forEach((r, index) => {
      const div = document.createElement("div");

      div.className = "testimonial";
      if (index === 0) div.classList.add("active");

      div.innerHTML = `
        <p>"${r.message}"</p>
        <h4>- ${r.name}</h4>
      `;

      slider.appendChild(div);
    });

    testimonialIndex = 0;
    startTestimonialSlider();

  } catch (err) {
    console.log("Review load error:", err);
  }
}

window.addEventListener("DOMContentLoaded", loadReviews);

/* =========================
   FOOTER YEAR
========================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================
   WHATSAPP AUTO MESSAGE
========================= */
function openWhatsAppBooking() {
  const message = `
Hello Eshwari Trip Organisers 👋

I am interested in booking a trip.

Name:
Trip Type:
Preferred Dates:
Number of People:
Pickup Location:

Please contact me with details. Thank you!
  `.trim();

  const phone = "919019268071";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

/* =========================
   CONTACT FORM → BACKEND API
   (UPDATED FOR DEPLOYMENT)
========================= */
const form = document.querySelector('form[name="tripForm"]');
const popup = document.getElementById("successPopup");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    };

    try {
      // ✅ Changed from localhost URL to relative API path
      await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (popup) popup.style.display = "flex";
      form.reset();

    } catch (err) {
      console.log("Submit error:", err);
    }
  });
}

function closePopup() {
  if (popup) popup.style.display = "none";
}
