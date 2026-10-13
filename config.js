// ===== The Winegart Family's Collection of Recipes — configuration =====
window.RECIPES_CONFIG = {
  // Leave both blank to use LocalAdapter (this browser only — good for demos).
  // Fill both in (see SETUP.md) to switch to shared Supabase storage.
  SUPABASE_URL: "https://pcxmlmhwlyaqabaujoxa.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_bDkcJrBaiLtKr4QPKtmb7g_7VO0pVNp",  // publishable key: meant to be public

  // Family entry password (the "Speak Friend, And Enter" gate). Change it in the Admin panel.
  // Shown on the "Speak Friend, And Enter" gate. Soft privacy only, not real security.
  // Local mode uses this unless Admin sets a new one; Supabase mode checks the database (site_verify RPC).
  SITE_PASSWORD: "",   // blank: Supabase checks the family password (site_verify)

  // Admin passcode (only used by LocalAdapter; Supabase checks it server-side).
  // Used ONLY by LocalAdapter. In Supabase mode the passcode is checked by the database
  // (admin_verify RPC) — so in Supabase mode set this back to "" so it isn't published.
  // This is a SOFT LOCK only: anyone can read client-side code. With Supabase,
  // real protection comes from the database: edits/deletes go through admin_* RPCs
  // that check the passcode stored server-side (see supabase-setup.sql).
  ADMIN_PASSCODE: "",  // blank: Supabase checks the admin passcode (admin_verify)

  DEFAULT_TITLE: "The Winegart Family's Collection of Recipes",
  DEFAULT_SUBTITLE: "Handed down, written down, and shared at the table",
  DEFAULT_CATEGORIES: ["Bread","Cookies","Desserts","Breakfast Baking","Main Dishes","Soups","Sides","Salads","Appetizers","Drinks","Sauces","Holiday","Other"],
  DEFAULT_BACKGROUNDS: ["bg/shire-real1.jpg","bg/shire-real2.jpg"],
  // Crop focus (CSS background-position) per background file, biased toward the right-hand doors.
  BG_POSITIONS: {
    "shire-real1.jpg": { desktop: "100% 40%", mobile: "84% center" },   // red + yellow doors, right hillside
    "shire-real2.jpg": { desktop: "0% 40%", mobile: "68% center" }    // green door, right of center
  },
  PHOTO_MAX_WIDTH: 1600,
  PHOTO_QUALITY: 0.82
};
