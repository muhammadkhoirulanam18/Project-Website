# Issue: Implementasi Fitur Get Current User

## Deskripsi Tugas
Tugas ini bertujuan untuk menambahkan fitur "Get Current User" untuk mengambil data profil pengguna yang saat ini sedang login. API ini akan membutuhkan autentikasi berupa Bearer Token yang dikirimkan melalui header request.

## 1. Spesifikasi API

Buat endpoint baru untuk mengambil data user yang sedang login.

- **Endpoint:** `GET /api/users/current`
- **Header Request:**
  - `Authorization`: `Bearer <token>`
  *(Catatan: Token ini adalah token UUID yang dihasilkan saat login dan tersimpan di tabel `sessions`)*

- **Response Body (Success 200 OK):**
  ```json
  {
      "id": 1,
      "name": "Bernadya",
      "email": "bernadya@example.com",
      "created_at": "2023-10-27T10:00:00.000Z",
      "updated_at": "2023-10-27T10:00:00.000Z"
  }
  ```

- **Response Body (Error 401 Unauthorized):**
  Dikembalikan jika token tidak ada, tidak valid, atau tidak ditemukan di database.
  ```json
  {
      "message": "unauthorized"
  }
  ```

## 2. Struktur Folder & File
Pertahankan arsitektur modular yang sudah ada:
- **Routes (`src/routes/user-router.ts`):** Tempat mendefinisikan routing Elysia untuk entitas user.
- **Services (`src/services/user-services.ts`):** Tempat menyimpan logika bisnis aplikasi untuk mengambil data user berdasarkan token.

---

## 3. Tahapan Implementasi (Step-by-Step Guide)

Ikuti langkah-langkah berikut untuk mengimplementasikan fitur ini:

### Langkah 1: Pengecekan Skema Database (Opsional)
Pastikan tabel `users` memiliki kolom `created_at` dan `updated_at`. Jika `updated_at` belum ada di file schema (`src/db/schema.ts`), silakan tambahkan, jalankan migrasi/push, lalu lanjutkan. (Atau kembalikan data yang ada saja jika spesifikasi membolehkan).

### Langkah 2: Buat Logika Service (Business Logic)
1. Buka file `src/services/user-services.ts`.
2. Buat sebuah fungsi asynchronous (misal: `getCurrentUser`) yang menerima parameter `token` (berupa string).
3. **Logika di dalam fungsi:**
   - Lakukan query ke database (tabel `sessions`) untuk mencari apakah ada sesi yang cocok dengan `token` yang diberikan.
   - Jika sesi **tidak ditemukan**, lemparkan error (throw error) dengan pesan `"unauthorized"`.
   - Jika sesi ditemukan, ambil `userId` dari sesi tersebut.
   - Lakukan query ke tabel `users` untuk mencari data user berdasarkan `userId` tersebut.
   - Kembalikan data user yang ditemukan (id, name, email, created_at, updated_at). Jangan kembalikan password!

### Langkah 3: Buat Endpoint di Router
1. Buka file `src/routes/user-router.ts`.
2. Tambahkan endpoint `.get('/current', ...)` di bawah prefix `/users` (jika router menggunakan prefix).
3. **Logika di dalam handler:**
   - Ambil header `authorization` dari request (bisa melalui context `headers` bawaan Elysia).
   - Validasi apakah header `authorization` ada dan dimulai dengan kata `"Bearer "`.
   - Jika tidak ada atau format salah, atur HTTP status menjadi 401 dan return `{"message": "unauthorized"}`.
   - Ekstrak nilai token-nya (hilangkan kata `"Bearer "`).
   - Di dalam blok `try...catch`, panggil fungsi `UserService.getCurrentUser(token)`.
   - Jika berhasil, kembalikan data user tersebut sebagai response success.
   - Jika gagal (masuk ke blok `catch`), cek pesan errornya. Jika pesan errornya `"unauthorized"`, kembalikan HTTP status 401 dan response `{"message": "unauthorized"}`. Jika error lain, tangani sesuai kebutuhan (misal 500 Internal Server Error).

### Langkah 4: Integrasi dan Pengujian
1. Pastikan `user-router.ts` sudah didaftarkan di file utama (`index.ts`).
2. Jalankan server dan lakukan pengujian dengan Postman/Insomnia/cURL.
3. Lakukan pengujian untuk 3 skenario:
   - Tanpa mengirim header Authorization.
   - Mengirim token yang salah/sembarang.
   - Mengirim token yang benar (didapat dari endpoint login sebelumnya).

## Kriteria Penerimaan (Acceptance Criteria)
- [ ] Endpoint `GET /api/users/current` dapat diakses.
- [ ] API wajib memeriksa Bearer token dari header.
- [ ] Token yang dikirim diverifikasi kebenarannya melalui tabel `sessions`.
- [ ] Response sukses mengembalikan detail profil user (id, name, email, created_at, updated_at).
- [ ] Response gagal karena masalah token mengembalikan HTTP status 401 dengan pesan `{"message": "unauthorized"}`.
- [ ] Alur logika dipisahkan dengan baik di router dan service.
