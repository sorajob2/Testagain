const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwQVQARtiSS5bnWEtX7PwfgpSSh2JB76UpinioCMjtzT59beFGODonm9cFFeGYiWaLkQQ/exec";

let allBookings = [];

// =============================
// โหลดข้อมูลการจองทั้งหมด
// =============================
async function fetchBookings() {
  try {
    const response = await fetch(WEB_APP_URL);
    allBookings = await response.json();
  } catch (error) {
    console.error("โหลดข้อมูลล้มเหลว:", error);
  }
}

// =============================
// อัปเดตเวลาที่ต้องปิด
// =============================
function updateDisabledTimes(selectedDate) {

  const timeSelect = document.getElementById("time");
  const options = timeSelect.querySelectorAll("option");

  options.forEach(option => option.disabled = false);

  if (!selectedDate) return;

  allBookings.forEach(b => {
    if (b.date === selectedDate) {
      options.forEach(option => {
        if (option.value === b.time) {
          option.disabled = true;
        }
      });
    }
  });
}

// =============================
// โหลดข้อมูลตอนเปิดหน้าเว็บ
// =============================
document.addEventListener("DOMContentLoaded", async () => {

  const dateInput = document.getElementById("date");
  const timeSelect = document.getElementById("time");

  dateInput.disabled = true;
  timeSelect.disabled = true;

  await fetchBookings();   // ✅ รอโหลดข้อมูลให้เสร็จก่อน

  dateInput.disabled = false;  // ✅ ค่อยเปิดให้เลือกวันที่

});

// =============================
// เมื่อเลือกวันที่
// =============================
document.getElementById("date").addEventListener("change", function () {

  const timeSelect = document.getElementById("time");

  if (this.value) {
    timeSelect.disabled = false; // ✅ เปิดให้เลือกเวลา
    updateDisabledTimes(this.value);
  } else {
    timeSelect.disabled = true;  // ✅ ปิดถ้ายังไม่เลือกวันที่
  }

});

// =============================
// เมื่อกดส่งฟอร์ม
// =============================
document.getElementById("bookingForm").addEventListener("submit", async function (e) {

  e.preventDefault();

  const overlay = document.getElementById("loadingOverlay");
  const submitBtn = this.querySelector("button[type='submit']");

  // 🔵 แสดง spinner + ปิดปุ่ม
  overlay.style.display = "flex";
  submitBtn.disabled = true;
  submitBtn.innerText = "กำลังส่ง...";

  const formData = new FormData(this);
  const selectedDate = formData.get("date");
  const params = new URLSearchParams(formData);

  try {

    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    // รีเซ็ตฟอร์ม
    this.reset();

    // โหลดข้อมูลใหม่
    await fetchBookings();
    updateDisabledTimes(selectedDate);

    alert("จองคิวสำเร็จ");

  } catch (error) {

    console.error("POST ล้มเหลว:", error);
    alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");

  } finally {

    // 🔴 ซ่อน spinner + เปิดปุ่ม
    overlay.style.display = "none";
    submitBtn.disabled = false;
    submitBtn.innerText = "จองคิว";

  }

});

const LIFF_ID = "2009290805-KkRsXWiw";

window.addEventListener("DOMContentLoaded", async () => {

  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login();
    return;
  }

  const profile = await liff.getProfile();
  document.getElementById("line_user_id").value = profile.userId;

});








