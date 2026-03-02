const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz8BlXtp79RJdfOaL3nJC82Az4Le6AU-hRqwumEnA20WFK6kB46oulypSYMfK5_41wJ-g/exec";

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

  await fetchBookings();

  const dateInput = document.getElementById("date");

  if (dateInput.value) {
    updateDisabledTimes(dateInput.value);
  }

});

// =============================
// เมื่อเลือกวันที่
// =============================
document.getElementById("date").addEventListener("change", function () {
  updateDisabledTimes(this.value);
});

// =============================
// เมื่อกดส่งฟอร์ม
// =============================
document.getElementById("bookingForm").addEventListener("submit", async function (e) {

  e.preventDefault();

  const formData = new FormData(this);
  const selectedDate = formData.get("date");

  const params = new URLSearchParams();
  formData.forEach((value, key) => {
    params.append(key, value);
  });

  try {

    // 🔥 ใช้ no-cors แก้ปัญหา CORS
    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    // ถือว่าสำเร็จทันที
    alert("จองคิวสำเร็จ");
    this.reset();

    // โหลดข้อมูลใหม่หลังส่ง
    await fetchBookings();
    updateDisabledTimes(selectedDate);

  } catch (error) {

    console.error("POST ล้มเหลว:", error);

  }

});