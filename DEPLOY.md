# Deploy AETHER lên dhnshops.com (Vercel + Postgres + Blob)

Hướng dẫn đưa web lên tên miền **dhnshops.com** (mua ở GoDaddy). Kiến trúc **env-gated**:
khi có `DATABASE_URL` → dùng Postgres; khi có `BLOB_READ_WRITE_TOKEN` → ảnh lên Vercel Blob.
Chạy local vẫn không cần gì cả (dùng file). Thanh toán vẫn là **checkout demo** (ráp Stripe sau).

> Làm theo đúng thứ tự. Tổng thời gian ~20–30 phút, hầu hết bấm nút trên dashboard.

---

## 0. Cần chuẩn bị
- Tài khoản **GitHub** (miễn phí) — để Vercel tự build lại mỗi lần bạn sửa code.
- Tài khoản **Vercel** (miễn phí, đăng nhập bằng GitHub) — https://vercel.com
- Quyền vào **DNS của GoDaddy** cho `dhnshops.com`.
- Đã cài **Git** trên máy.

---

## 1. Đẩy code lên GitHub

Repo hiện **chưa phải git**. Trong thư mục dự án chạy:

```bash
git init
git add .
git commit -m "AETHER storefront — deploy-ready (Postgres + Blob)"
```

Tạo repo rỗng trên GitHub (ví dụ `dhnshops`), rồi:

```bash
git branch -M main
git remote add origin https://github.com/<tài-khoản>/dhnshops.git
git push -u origin main
```

> `.gitignore` đã bỏ qua `node_modules`, `.next`, **`.env*`** (không lộ mật khẩu), và
> `data/`, `public/uploads` (dữ liệu test local, có thể chứa thông tin khách). ✅

---

## 2. Import dự án vào Vercel
1. Vào https://vercel.com/new → chọn repo `dhnshops` vừa push.
2. Framework: **Next.js** (tự nhận). Build command / output để **mặc định**.
3. **Khoan bấm Deploy** — thêm database + biến môi trường trước (bước 3–5). Nếu lỡ deploy,
   cứ deploy lại sau khi thêm là được.

---

## 3. Thêm Postgres (Neon) — lưu sản phẩm & đơn hàng
1. Trong project trên Vercel → tab **Storage** → **Create Database** → chọn **Neon (Postgres)**
   (hoặc "Postgres").
2. Đặt tên, chọn region gần khách nhất → **Create**, rồi **Connect** vào project.
3. Vercel **tự thêm biến `DATABASE_URL`** vào project (Production + Preview). Không cần copy tay.

> Lần chạy đầu tiên app sẽ **tự tạo bảng và nạp dữ liệu mẫu** (seed) vào Postgres — không cần chạy
> migration thủ công.

---

## 4. Thêm Vercel Blob — lưu ảnh upload từ /admin
1. Tab **Storage** → **Create** → **Blob** → tạo store → **Connect** vào project.
2. Vercel tự thêm biến **`BLOB_READ_WRITE_TOKEN`**.

> Từ giờ ảnh bạn upload trong `/admin` sẽ lên Blob (URL `*.public.blob.vercel-storage.com`,
> đã được whitelist trong `next.config.ts`).

---

## 5. Đặt biến môi trường bảo mật admin
Tab **Settings → Environment Variables**, thêm cho **Production**:

| Biến | Giá trị |
|---|---|
| `ADMIN_PASSWORD` | Mật khẩu admin mạnh (KHÔNG để "admin"). |
| `ADMIN_SESSION_SECRET` | Chuỗi ngẫu nhiên dài (ký cookie phiên). |

Tạo `ADMIN_SESSION_SECRET` ngẫu nhiên (chạy local):

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Copy kết quả dán vào ô giá trị.

---

## 6. Deploy
Bấm **Deploy** (hoặc **Redeploy** nếu đã deploy trước đó để nạp env mới).
Xong sẽ có URL tạm dạng `dhnshops.vercel.app`. Mở thử:
- Trang chủ chạy với dữ liệu mẫu.
- `/admin` → đăng nhập bằng `ADMIN_PASSWORD` → thêm 1 sản phẩm test → kiểm tra hiện trên store.
- Thêm vào giỏ → **Pay** → xem đơn ở `/admin/orders`.

---

## 7. Gắn tên miền dhnshops.com

### 7a. Trong Vercel
Project → **Settings → Domains** → nhập `dhnshops.com` → **Add**.
Thêm tiếp `www.dhnshops.com` (Vercel sẽ tự redirect www → apex hoặc ngược lại).
Vercel sẽ hiện **giá trị DNS cần khai báo** — dùng đúng giá trị Vercel hiện (thường như dưới).

### 7b. Trong GoDaddy (DNS Management của dhnshops.com)
Xoá các bản ghi A/CNAME "parked" mặc định của GoDaddy trỏ về trang giữ chỗ, rồi thêm:

| Type | Name | Value | TTL |
|---|---|---|---|
| **A** | `@` | `76.76.21.21` | 600 (hoặc mặc định) |
| **CNAME** | `www` | `cname.vercel-dns.com` | 600 |

> ⚠️ **Dùng đúng giá trị mà Vercel hiển thị** trong mục Domains — nếu Vercel cho IP/CNAME khác
> với bảng trên thì theo Vercel. Không dùng tính năng **Forwarding** của GoDaddy.

### 7c. Chờ & xác minh
- DNS lan truyền vài phút → vài giờ. Vercel tự cấp **SSL (https)** khi thấy DNS đúng.
- Khi trạng thái domain ở Vercel chuyển **Valid Configuration** ✅ là xong.
- Mở **https://dhnshops.com** để kiểm tra.

---

## 8. Kiểm thử cuối (trên domain thật)
- [ ] `https://dhnshops.com` mở được, có https (ổ khoá).
- [ ] `/admin/login` vào bằng mật khẩu production.
- [ ] Thêm sản phẩm + **upload ảnh** → ảnh hiển thị (từ Blob).
- [ ] Đặt 1 đơn test → hiện ở `/admin/orders`, số liệu tổng đúng.
- [ ] Reload trang admin → sản phẩm/đơn **vẫn còn** (đã lưu Postgres, không mất khi redeploy).

---

## Vận hành sau này
- **Sửa code** → `git push` → Vercel tự build & deploy lại. Dữ liệu Postgres/Blob **không bị mất**.
- **Reset dữ liệu về mẫu:** xoá hết rows ở bảng `products` trong Neon rồi redeploy — app seed lại.
  (Hoặc xoá bảng để app tạo lại từ đầu.)
- **Đổi mật khẩu admin:** sửa `ADMIN_PASSWORD` trong Vercel → Redeploy.
- **Đổi tên thương hiệu / ngưỡng free-ship:** `src/lib/config.ts`.

## Bước tiếp theo (khi cần)
1. **Stripe** — nhận thanh toán thật (thay checkout demo).
2. **Gelato** — đẩy đơn sang xưởng in (field `gelatoProductUid` đã có sẵn).
3. **Email automation** — abandoned cart, welcome, review request.
