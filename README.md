# AETHER — Website bán POD (áo thun) · Next.js + WebGL immersive + Sanity

Storefront print-on-demand hiện đại, hiệu ứng động mạnh (WebGL/3D kiểu Awwwards), thị trường **Global (USD)**. Xưởng in dự kiến là **Gelato** (ráp ở giai đoạn sau — kiến trúc đã chuẩn bị sẵn).

Website **chạy được ngay với dữ liệu mẫu**, không cần bất kỳ tài khoản ngoài nào. Khi bạn kết nối Sanity, bạn **tự đăng/sửa sản phẩm** qua giao diện `/studio` mà không cần code.

---

## Chạy dự án

```bash
npm install        # đã cài sẵn
npm run dev        # mở http://localhost:3000
npm run build      # build production
npm run start      # chạy bản build
```

## Công nghệ

| Lớp | Dùng gì |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (design tokens trong `globals.css`) |
| Smooth scroll | Lenis |
| Scroll/timeline animation | GSAP + ScrollTrigger |
| Component/page motion | Motion (`motion/react`) |
| 3D / WebGL | Three.js + React Three Fiber + drei |
| Giỏ hàng | Zustand (+ persist localStorage) |
| CMS sản phẩm | Sanity v3 (Studio nhúng tại `/studio`) |

## Cấu trúc thư mục

```
src/
  app/
    (store)/            # storefront (có Nav/Footer/cursor/Lenis)
      page.tsx          # Trang chủ (WebGL hero)
      shop/             # Toàn bộ sản phẩm + filter
      collections/[slug]# Trang collection
      products/[slug]   # PDP: 3D viewer + buybox + reviews
      cart/             # Giỏ hàng + checkout demo
      layout.tsx        # chrome của store
    studio/[[...tool]]  # Sanity Studio nhúng (hoặc trang hướng dẫn nếu chưa cấu hình)
    layout.tsx          # root layout (fonts)
    robots.ts, sitemap.ts
  components/
    three/              # HeroScene, ProductStage (WebGL)
    motion/             # Cursor, Magnetic, Marquee, Reveal, SplitReveal
    layout/             # Nav, Footer, AnnouncementBar, CartDrawer, EmailCapture
    shop/               # ProductCard, ProductGrid, ShopClient (filter)
    pdp/                # ProductDetail, ProductGallery, BuyBox, SizeGuide, Reviews
    sections/           # Hero, CategoryTiles, FeaturedScroll, Testimonials, TrustBar
    ui/                 # Button, StarRating, icons
  lib/
    products.ts         # LỚP DỮ LIỆU DUY NHẤT (seed hoặc Sanity)
    data/seed.ts        # catalog mẫu (ảnh placeholder on-brand)
    store/cart.ts       # Zustand cart
    animation/          # gsap, Lenis, useReducedMotion
    sanity/             # client, image, GROQ queries
  sanity/               # env + schema (product/collection/review/settings)
sanity.config.ts        # cấu hình Studio
```

## Đăng nhập admin

Toàn bộ `/admin/*` và `/api/admin/*` được bảo vệ bằng mật khẩu (`src/proxy.ts` + cookie phiên ký HMAC).
Cửa hàng và `/api/checkout` vẫn công khai.

- Truy cập `/admin` → tự chuyển sang **`/admin/login`**. Mật khẩu mặc định: **`admin`**.
- Đổi mật khẩu: đặt `ADMIN_PASSWORD` trong `.env.local`; production nên đặt thêm `ADMIN_SESSION_SECRET`
  (chuỗi ngẫu nhiên dài). Xem `.env.example`.
- Nút **Log out** ở thanh admin. Phiên hết hạn sau 12 giờ.

## Đăng / quản lý sản phẩm — trang admin `/admin`

Mở **http://localhost:3000/admin** để tự thêm/sửa/xoá sản phẩm bằng giao diện (không cần tài khoản ngoài, không cần code):

- Điền tên, giá (USD), collection, mô tả, badges, size còn hàng.
- **Upload ảnh** trực tiếp (gallery + ảnh theo từng màu). Ảnh lưu ở `public/uploads`.
- Bấm **Create/Save** → sản phẩm hiện ngay trên store.

**Lưu trữ dữ liệu tự chuyển theo môi trường (env-gated):**
- **Local (mặc định):** không cần cấu hình gì — sản phẩm lưu ở `data/catalog.json`, đơn ở
  `data/orders.json`, ảnh upload ở `public/uploads`.
- **Production (Vercel):** khi đặt `DATABASE_URL`, sản phẩm/đơn tự lưu vào **Postgres** (Neon);
  khi đặt `BLOB_READ_WRITE_TOKEN`, ảnh upload lưu vào **Vercel Blob**. Chữ ký hàm giữ nguyên nên
  không phần nào khác phải sửa. Xem [DEPLOY.md](DEPLOY.md) để đưa lên **dhnshops.com**.

> Ảnh sản phẩm thật: tạo mockup trong dashboard Gelato rồi upload qua `/admin`.

## Đơn hàng — `/admin/orders`

Khi khách bấm **Pay** ở giỏ hàng, đơn được ghi lại (khách, sản phẩm, số lượng, tiền) vào
`data/orders.json` qua `POST /api/checkout`. Vào **http://localhost:3000/admin/orders** để xem:

- Thẻ tổng: **số đơn · số lượng bán · doanh thu · đơn mới chưa xử lý**.
- Danh sách đơn: mã đơn, ngày, khách + email, số lượng, tổng tiền; bấm để xem chi tiết line-item + địa chỉ giao.
- Nút **Mark fulfilled** đổi trạng thái đơn.

Giá tiền được **tính lại từ catalog phía server** (không tin giá do client gửi) và có **khoá ghi**
để nhiều đơn đồng thời không đè lên nhau (`src/lib/admin/orders.ts`). Thanh toán vẫn là demo — chưa
trừ tiền thật (ráp Stripe ở giai đoạn sau).

### (Tuỳ chọn) Dùng Sanity CMS thay cho admin file

Nếu sau này muốn CMS hosted (ảnh CDN, phân quyền, hợp deploy production): điền
`NEXT_PUBLIC_SANITY_PROJECT_ID` trong `.env.local` (xem `.env.example`). Khi có, `src/lib/products.ts`
tự chuyển sang đọc Sanity và `/studio` thành admin editable — không cần sửa trang nào khác.

## Hiệu ứng & khả năng truy cập

- Hero WebGL (blob distort + particle, phản ứng con trỏ), PDP có **3D product stage** (xoay theo con trỏ, đổi màu theo colorway) — texture nạp qua image optimizer cùng origin nên không lỗi CORS.
- Custom cursor, magnetic button, page/section reveal, kinetic typography, horizontal-scroll pinned, marquee.
- **Tôn trọng `prefers-reduced-motion`**: khi người dùng bật giảm chuyển động, WebGL/parallax tự tắt và thay bằng ảnh/tĩnh; mobile giảm tải.

## Lộ trình tiếp theo (ngoài phạm vi bản này)

1. **Gelato**: điền `GELATO_API_KEY`, viết logic gọi Quote API (tính ship), Order API (tạo đơn), webhook trạng thái. Field `gelatoProductUid` đã có trong schema product.
2. **Thanh toán**: Stripe Payment Intent thay cho checkout demo trong `src/app/(store)/cart`.
3. **Automation** (theo ROI): abandoned cart, welcome series, review request, back-in-stock, order-status qua Gelato webhook, product feed sync Google/Meta. Chỗ ráp: `EmailCapture` và sự kiện cart.

## Ghi chú

- Ảnh trong catalog mẫu dùng `placehold.co` (on-brand) để luôn render — thay bằng mockup thật khi có.
- Giỏ hàng lưu ở `localStorage` (key `aether-cart`). Checkout hiện là demo (chưa trừ tiền, chưa tạo đơn Gelato).
- Đổi tên thương hiệu/ngưỡng free-ship trong `src/lib/config.ts`.
