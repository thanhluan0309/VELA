# CLAUDE.md — Landing Page Scroll 3D (Award-tier)

> File này là "luật chơi" cho AI khi build. Đọc kỹ, làm đúng từng mục, không tự ý đơn giản hoá. Mục tiêu: landing page đạt chuẩn Awwwards / FWA, scroll mượt như bơ, chuyển cảnh 3D có chiều sâu, không giống mọi landing page AI làng nhàng ngoài kia.

---

## 1. Mục tiêu (Definition of Done)

- Trang chạy được thật, không placeholder, không "TODO", không lorem ipsum nửa vời.
- Scroll mượt 60fps (lý tưởng 120fps trên màn hình cao), không giật khi chuyển cảnh.
- Có ít nhất **3 khoảnh khắc 3D / scroll-driven gây ấn tượng** (hero, chuyển cảnh giữa section, kết).
- Mở ra là người xem nhớ ngay **1 điểm độc nhất** (signature moment).
- Lighthouse: Performance ≥ 85, Accessibility ≥ 95 trên mobile.
- Tôn trọng `prefers-reduced-motion`: tắt hết animation nặng, vẫn dùng được.

---

## 2. Tech Stack (bắt buộc, không thay nếu chưa hỏi)

- **Framework**: Next.js (App Router) + TypeScript. Nếu yêu cầu thuần tĩnh thì Vite + React.
- **Smooth scroll**: `Lenis` (`@studio-freight/lenis` hoặc `lenis`) — KHÔNG tự viết scroll thủ công.
- **Animation engine**: `GSAP` + `ScrollTrigger` (pin, scrub, snap). Đây là xương sống của scroll-driven.
- **3D**: `Three.js` qua `@react-three/fiber` + `@react-three/drei`. Hậu kỳ dùng `@react-three/postprocessing`.
- **Micro-interaction / UI motion**: `Motion` (Framer Motion) cho hover, enter, layout.
- **Styling**: Tailwind CSS + CSS variables cho token. Cho phép CSS thuần khi cần hiệu ứng đặc biệt.
- **Font**: load qua `next/font` hoặc self-host. Cấm font generic (xem mục 5).

> Nguyên tắc: GSAP ScrollTrigger điều phối timeline theo scroll → R3F render 3D → Lenis làm scroll mượt. Phải sync `Lenis` với `ScrollTrigger` (gọi `ScrollTrigger.update` trong vòng raf của Lenis).

---

## 3. Kiến trúc Scroll & 3D (làm đúng kỹ thuật)

- **Sync Lenis ↔ GSAP**: dùng chung 1 RAF loop. Lenis cập nhật → `ScrollTrigger.update()`. Không để 2 vòng raf đánh nhau.
- **Pinning**: section 3D dùng `ScrollTrigger pin: true` + `scrub: true` để animation bám theo scroll, không chạy tự do.
- **Một Canvas duy nhất**: dùng 1 `<Canvas>` R3F full-screen, fixed phía sau; các section HTML scroll đè lên trên. Camera/scene đổi theo scroll progress → cảm giác "chuyển cảnh 3D" liền mạch thay vì nhiều canvas rời.
- **Camera rig theo scroll**: map `scrollProgress (0→1)` vào vị trí/rotation camera bằng `useScroll` (drei) hoặc ScrollTrigger. Dùng `lerp`/`damp` để mượt, không snap cứng.
- **Scene transition**: chuyển cảnh bằng 1 trong các kỹ thuật, chọn cho hợp concept:
  - Camera bay xuyên qua vật thể / cổng (portal) sang scene mới.
  - Morph geometry / đổi material theo progress.
  - Fade + dolly zoom + đổi tông màu môi trường (fog, background, lighting).
  - Mask/clip-path reveal phối với chuyển cảnh 3D phía sau.
- **Lazy & dispose**: model nặng load lazy, dispose geometry/texture khi rời scene. Tránh leak memory.

---

## 4. Cấu trúc section (gợi ý, tinh chỉnh theo concept)

- **Hero**: signature 3D moment + tiêu đề lớn reveal staggered. Đây là cú "wow" đầu tiên — đầu tư mạnh nhất.
- **Intro / Manifesto**: text scroll-driven, từ/dòng reveal theo scroll, parallax nhẹ.
- **Showcase / Features**: pin section, mỗi feature đổi 1 trạng thái 3D (xoay sản phẩm, đổi màu, lắp ráp).
- **Transition cảnh**: đoạn chuyển cảnh 3D "đắt" nhất — camera xuyên không gian, đổi môi trường.
- **Social proof / Stats**: số nhảy (count-up) khi vào viewport.
- **CTA cuối**: 3D kết, nút CTA nổi bật, animation đóng gọn gàng.
- **Footer**: gọn, có micro-interaction.

---

## 5. Design System (chống "AI slop" — đọc kỹ)

- **Chọn 1 hướng thẩm mỹ rõ ràng và đẩy tới cùng**: chọn 1 extreme (brutalist, editorial/magazine, retro-futuristic, luxury tối giản, organic, art-deco hình học...). Không lưng chừng, không trộn 5 phong cách.
- **Typography**: chọn font độc, có cá tính. Cặp 1 display font ấn tượng + 1 body font tinh tế.
  - **CẤM**: Inter, Roboto, Arial, system font, và đừng mặc định nhảy vào Space Grotesk.
- **Màu**: 1 palette cohesive, dùng CSS variables. Màu chủ đạo mạnh + accent sắc. Tránh dàn đều nhạt nhoà.
  - **CẤM**: gradient tím trên nền trắng (cliché AI số 1).
- **Layout**: phá lưới có chủ đích — asymmetry, overlap, diagonal flow, negative space rộng HOẶC mật độ dày có kiểm soát. Không layout đoán trước được.
- **Background & depth**: tạo không khí — gradient mesh, noise/grain overlay, texture, shadow kịch tính, custom cursor. Không để nền phẳng 1 màu trơ.
- **Motion có gu**: dồn lực vào vài khoảnh khắc lớn (page load staggered, scroll reveal, transition) hơn là rải micro-interaction lặt vặt vô hồn.
- **Độ phức tạp khớp tầm nhìn**: maximalist thì code phải nhiều hiệu ứng; minimalist thì phải cực kỳ chỉn chu về spacing, type, chi tiết tinh.

---

## 6. Performance (không thương lượng)

- Mỗi lần generate landing page khác nhau phải khác concept/màu/font — không hội tụ về 1 kiểu.
- 3D: giảm poly, dùng `Draco`/`meshopt` nén GLTF, texture nén (`ktx2`/`webp`), `frameloop="demand"` khi tĩnh.
- Animation chạy bằng `transform` & `opacity` (GPU), tránh animate layout (width/top/left).
- Defer/lazy mọi thứ dưới màn hình đầu. Hero phải load nhanh.
- Throttle `ScrollTrigger` hợp lý, dùng `will-change` đúng chỗ, gỡ sau khi xong.
- Test trên mobile tầm trung, không chỉ máy xịn.

---

## 7. Accessibility & Responsive

- **`prefers-reduced-motion: reduce`**: tắt scrub/pin/3D nặng, thay bằng fade tĩnh đơn giản. Nội dung vẫn đầy đủ, đọc được.
- Keyboard navigable, focus state rõ, contrast đạt WCAG AA.
- Mobile: cân nhắc hạ cấp 3D (ảnh tĩnh/poster) nếu thiết bị yếu; vẫn giữ thần thái.
- Mọi text quan trọng phải nằm trong DOM (SEO + screen reader), không nhét hết vào canvas.

---

## 8. Quy trình làm việc của AI

- Trước khi code: chốt **concept + tông màu + cặp font + signature moment** rồi mới bắt tay.
- Code thật, chạy được, không bỏ dở. Nếu thiếu asset (model 3D, ảnh) → tạo procedural bằng Three.js (geometry, shader) thay vì để trống.
- Giải thích ngắn gọn lựa chọn thẩm mỹ + kỹ thuật ở đầu, rồi giao code.
- Tổ chức code sạch: tách component, tách logic scroll/3D, đặt token tập trung.

---

## 9. Anti-patterns (làm là hỏng)

- Nhiều `<Canvas>` rời rạc cho mỗi section → vỡ tính liền mạch + tốn tài nguyên.
- Scroll tự viết bằng `wheel` event thủ công → giật, không mượt.
- Animation chạy theo timer thay vì theo scroll progress trong section pin.
- Font generic + gradient tím nền trắng + layout 3 cột "AI mặc định".
- Quên `prefers-reduced-motion`, quên dispose 3D, animate layout property.
- "Wow" rải đều mọi nơi → loãng. Phải có 1 đỉnh điểm rõ ràng.

---

## 10. PRESET: Thời trang — "Tươi sáng / Editorial Bright"

> Đây là concept chốt cho dự án này. AI phải bám theo, chỉ tinh chỉnh chi tiết — không đổi sang dark mode hay phong cách khác.

### 10.1. Tinh thần

- Hướng thẩm mỹ: **editorial bright** — sáng, thoáng, sang nhẹ kiểu tạp chí thời trang, nhiều khoảng trắng, sản phẩm là nhân vật chính.
- Cảm xúc người xem: trẻ trung, sạch sẽ, tự tin, "muốn mua ngay".
- Signature moment: **sản phẩm thời trang 3D xoay/lơ lửng giữa khoảng trắng** ở hero, vải/chất liệu đổ bóng mềm, ánh sáng studio.

### 10.2. Color palette (dùng CSS variables)

- `--bg`: `#FAF7F2` (kem off-white, nền chủ đạo — KHÔNG dùng trắng tinh #FFF).
- `--ink`: `#161616` (gần đen, cho chữ & nét).
- `--accent`: `#FF5B4A` (coral/cam đỏ punchy — màu nhấn duy nhất, dùng tiết chế cho CTA & highlight).
- `--soft-1`: `#FFD66B` (vàng bơ) · `--soft-2`: `#FFB3C1` (blush hồng) · `--soft-3`: `#A8DADC` (xanh mint nhạt) — pastel cho khối nền/chuyển cảnh.
- Quy tắc: nền sáng + 1 accent mạnh. Pastel chỉ làm phụ trợ, không dàn đều loè loẹt.

### 10.3. Typography

- **Display**: `Fraunces` (serif có cá tính, optical size lớn) HOẶC `PP Editorial New`. Tiêu đề set thật to, line-height chặt.
- **Body**: `General Sans` hoặc `Satoshi` (sans tinh, đọc tốt).
- **CẤM**: Inter, Roboto, Arial, system font, Space Grotesk.

### 10.4. Spec từng section

- **Hero**: nền kem, sản phẩm 3D (áo/giày/túi) lơ lửng giữa, xoay nhẹ theo chuột; tiêu đề serif lớn reveal staggered từng từ; CTA accent coral. Đây là cú "wow" số 1, đầu tư mạnh nhất.
- **Manifesto / Brand story**: text scroll-driven, dòng chữ reveal theo scroll, parallax ảnh chất liệu vải.
- **Collection showcase (pin)**: pin section, scroll để **đổi sản phẩm 3D** — mỗi lần đổi kèm đổi tông nền pastel (`--soft-1/2/3`) mượt theo progress.
- **Transition cảnh "đắt"**: camera dolly/zoom xuyên qua sản phẩm sang scene tiếp; nền chuyển màu pastel; có thể morph chất liệu (đổi vải/màu áo).
- **Lookbook / Gallery**: lưới ảnh phá cấu trúc (asymmetry, overlap), hover phóng to + đổ bóng mềm, micro-interaction tinh.
- **Stats / Social proof**: số count-up khi vào viewport (lượt khách, đánh giá, quốc gia bán).
- **CTA cuối**: sản phẩm 3D kết, nút "Shop now" accent coral nổi bật, đóng cảnh gọn.
- **Footer**: gọn, sáng, link mạng xã hội có hover.

### 10.5. Chi tiết "đắt" cần có

- Custom cursor dạng chấm tròn nhỏ, phình to khi hover sản phẩm/nút.
- Grain/noise overlay rất nhẹ để nền kem không bị "phẳng số".
- Ảnh sản phẩm bo góc mềm, đổ bóng dài & nhạt (kiểu ánh sáng studio).
- Chuyển section bằng clip-path/mask reveal phối với chuyển cảnh 3D phía sau.
- 3D: nếu không có model thật → tạo procedural (vải bay bằng cloth/shader, hình khối sản phẩm tối giản) thay vì để trống.

### 10.6. Giữ đúng tinh thần

- Luôn sáng, thoáng, sang nhẹ — đừng để rối, đừng tối màu.
- Accent coral chỉ dùng cho điểm nhấn; lạm dụng là mất sang.
- Mobile: hạ cấp 3D thành ảnh poster đẹp nếu máy yếu, vẫn giữ thần thái editorial.
