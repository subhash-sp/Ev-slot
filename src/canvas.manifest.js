export const manifest = {
  screens: {
    scr_jlqkq0: { name: "Home", route: "/", position: { "x": 160, "y": 220 } },
    scr_7bcv8n: { name: "Find Stations", route: "/stations", position: { "x": 1560, "y": 220 } },
    scr_pt8dq3: { name: "Station Details", route: "/stations/st-greencharge", position: { "x": 2960, "y": 220 } },
    scr_kgx4tq: { name: "Book Charging Slot", route: "/book/st-greencharge", position: { "x": 4360, "y": 220 } },
    scr_cqsw6y: { name: "Booking Success", route: "/booking/success/EVS10245", position: { "x": 5760, "y": 220 } },
    scr_i4hie5: { name: "My Bookings", route: "/bookings", position: { "x": 1560, "y": 2200 } },
    scr_hsld77: { name: "How It Works", route: "/how-it-works", position: { "x": 160, "y": 4180 } },
    scr_ioeeqn: { name: "Support", route: "/support", position: { "x": 1560, "y": 4180 } },
    scr_tacghl: { name: "Profile / Login", route: "/profile", position: { "x": 160, "y": 2200 } },
    scr_oqezpr: { name: "Admin – Overview", route: "/admin", state: { "tab": "overview" }, position: { "x": 160, "y": 6160 } },
    scr_dofbzx: { name: "Admin – Stations & Chargers", route: "/admin", state: { "tab": "stations" }, position: { "x": 1560, "y": 6160 } },
    scr_vdu9vq: { name: "Admin – Time Slots", route: "/admin", state: { "tab": "slots" }, position: { "x": 2960, "y": 6160 } },
    scr_5ef668: { name: "Admin – Bookings", route: "/admin", state: { "tab": "bookings" }, position: { "x": 4360, "y": 6160 } },
    scr_49d8mp: { name: "Admin – Customers", route: "/admin", state: { "tab": "customers" }, position: { "x": 5760, "y": 6160 } }
  },
  sections: {
    sec_0uwfms: { name: "Booking Flow", x: 0, y: 0, width: 7120, height: 1180 },
    sec_cqqait: { name: "User Account", x: 0, y: 1980, width: 2920, height: 1180 },
    sec_s75pzz: { name: "Information & Support", x: 0, y: 3960, width: 2920, height: 1180 },
    sec_1ilw8c: { name: "Admin Dashboard", x: 0, y: 5940, width: 7120, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_0uwfms", children: [
    { kind: "screen", id: "scr_jlqkq0" },
    { kind: "screen", id: "scr_7bcv8n" },
    { kind: "screen", id: "scr_pt8dq3" },
    { kind: "screen", id: "scr_kgx4tq" },
    { kind: "screen", id: "scr_cqsw6y" }]
  },
  { kind: "section", id: "sec_cqqait", children: [
    { kind: "screen", id: "scr_tacghl" },
    { kind: "screen", id: "scr_i4hie5" }]
  },
  { kind: "section", id: "sec_s75pzz", children: [
    { kind: "screen", id: "scr_hsld77" },
    { kind: "screen", id: "scr_ioeeqn" }]
  },
  { kind: "section", id: "sec_1ilw8c", children: [
    { kind: "screen", id: "scr_oqezpr" },
    { kind: "screen", id: "scr_dofbzx" },
    { kind: "screen", id: "scr_vdu9vq" },
    { kind: "screen", id: "scr_5ef668" },
    { kind: "screen", id: "scr_49d8mp" }]
  }]

};