// Load contacts on page load
window.onload = function () {
    loadContacts();
    showLocation();
  };
  
  function triggerSOS() {
    alert("🚨 SOS triggered! Processing...");
  
    const alertType = document.getElementById("alertOption").value;
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        alert("Your location:\nLatitude: " + lat + "\nLongitude: " + lon);
  
        if (alertType === "contacts" || alertType === "both") {
          sendWhatsAppAlert(lat, lon);
        }
  
        if (alertType === "police" || alertType === "both") {
          callPolice();
        }
  
      }, function (error) {
        alert("Unable to access location. Please enable GPS.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }
  
  function sendWhatsAppAlert(lat, lon) {
    const contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
  
    const message = encodeURIComponent(
      "🚨 EMERGENCY!\nI need help!\nMy location: https://maps.google.com/?q=" + lat + "," + lon
    );
  
    contacts.forEach(contact => {
      window.open(`https://wa.me/91${contact.number}?text=${message}`, '_blank');
    });
  }
  
  function callPolice() {
    window.open("tel:112");
  }
  
  function addContact() {
    const name = document.getElementById("contactName").value;
    const number = document.getElementById("contactNumber").value;
  
    if (name && number) {
      let contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
      contacts.push({ name, number });
      localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
      loadContacts();
      document.getElementById("contactName").value = "";
      document.getElementById("contactNumber").value = "";
    } else {
      alert("Please enter both name and number.");
    }
  }
  
  function loadContacts() {
    const contactList = document.getElementById("contactList");
    contactList.innerHTML = "";
    const contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
  
    contacts.forEach((contact, index) => {
      const li = document.createElement("li");
      li.textContent = `${contact.name} - ${contact.number}`;
      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.style.marginLeft = "10px";
      delBtn.onclick = () => {
        contacts.splice(index, 1);
        localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
        loadContacts();
      };
      li.appendChild(delBtn);
      contactList.appendChild(li);
    });
  }
  
  function showLocation() {
    const loc = document.getElementById("locationDisplay");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        loc.innerHTML = `<a href="https://maps.google.com/?q=${lat},${lon}" target="_blank">
          ${lat}, ${lon}
        </a>`;
      }, function () {
        loc.textContent = "Unable to retrieve location.";
      });
    } else {
      loc.textContent = "Geolocation is not supported by your browser.";
    }
  }
  