export const manifest = {
  screens: {
    scr_tb5k9d: { name: "Home", route: "/", position: { "x": 160, "y": 1820 } },
    scr_mc1stg: { name: "Shop", route: "/shop", position: { "x": 1560, "y": 1820 } },
    scr_aigmoc: { name: "Product Details", route: "/product/p1", position: { "x": 2960, "y": 1820 } },
    scr_e7lzqk: { name: "Cart", route: "/cart", position: { "x": 4360, "y": 1820 } },
    scr_4oyqvk: { name: "Checkout", route: "/checkout", position: { "x": 5760, "y": 1820 } },
    scr_6le5ox: { name: "Order Success", route: "/order-success", position: { "x": 7160, "y": 1820 } },
    scr_exuvif: { name: "Wishlist", route: "/wishlist", position: { "x": 160, "y": 3800 } },
    scr_bephjn: { name: "404 Not Found", route: "/no-such-page", position: { "x": 0, "y": 0 }, isDefaultRow: true },
    scr_uvt3g4: { name: "Admin Login", route: "/admin/login", position: { "x": 160, "y": 5780 } },
    scr_klpe9x: { name: "Admin Dashboard", route: "/admin", position: { "x": 1560, "y": 5780 } },
    scr_s03sdl: { name: "Admin Products", route: "/admin/products", position: { "x": 2960, "y": 5780 } },
    scr_20t7nm: { name: "Admin Categories", route: "/admin/categories", position: { "x": 4360, "y": 5780 } },
    scr_f767h9: { name: "Admin Orders", route: "/admin/orders", position: { "x": 5760, "y": 5780 } },
    scr_s77a9z: { name: "Admin Customers", route: "/admin/customers", position: { "x": 7160, "y": 5780 } },
    scr_fmmpq9: { name: "Admin Coupons", route: "/admin/coupons", position: { "x": 9960, "y": 5780 } },
    scr_dgkvl7: { name: "Admin Reviews", route: "/admin/reviews", position: { "x": 11360, "y": 5780 } },
    scr_partkk: { name: "Admin Inventory", route: "/admin/inventory", position: { "x": 8560, "y": 5780 } },
    scr_xqrypf: { name: "Admin Settings", route: "/admin/settings", position: { "x": 12760, "y": 5780 } }
  },
  sections: {
    sec_mr6ym0: { name: "Shopping & Checkout", x: 0, y: 1600, width: 8520, height: 1180 },
    sec_e5q5jg: { name: "Wishlist", x: 0, y: 3580, width: 1520, height: 1180 },
    sec_blvt58: { name: "Admin & Management", x: 0, y: 5560, width: 14120, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_mr6ym0", children: [
    { kind: "screen", id: "scr_tb5k9d" },
    { kind: "screen", id: "scr_mc1stg" },
    { kind: "screen", id: "scr_aigmoc" },
    { kind: "screen", id: "scr_e7lzqk" },
    { kind: "screen", id: "scr_4oyqvk" },
    { kind: "screen", id: "scr_6le5ox" }]
  },
  { kind: "section", id: "sec_e5q5jg", children: [
    { kind: "screen", id: "scr_exuvif" }]
  },
  { kind: "screen", id: "scr_bephjn" },
  { kind: "section", id: "sec_blvt58", children: [
    { kind: "screen", id: "scr_uvt3g4" },
    { kind: "screen", id: "scr_klpe9x" },
    { kind: "screen", id: "scr_s03sdl" },
    { kind: "screen", id: "scr_20t7nm" },
    { kind: "screen", id: "scr_f767h9" },
    { kind: "screen", id: "scr_s77a9z" },
    { kind: "screen", id: "scr_partkk" },
    { kind: "screen", id: "scr_fmmpq9" },
    { kind: "screen", id: "scr_dgkvl7" },
    { kind: "screen", id: "scr_xqrypf" }]
  }]

};