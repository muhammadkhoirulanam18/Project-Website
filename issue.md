# Issue: Implementasi Fitur Logout User

## Deskripsi Tugas
Tugas ini bertujuan untuk menambahkan fitur Logout bagi pengguna yang sedang aktif (login). Proses logout dilakukan dengan cara menghapus token sesi (session token) milik pengguna tersebut dari tabel `sessions` di database. API ini membutuhkan autentikasi berupa Bearer Token yang dikirimkan melalui header request.

## 1. Spesifikasi API

Buat endpoint baru untuk menangani proses logout pengguna.

- **Endpoint:** `DELETE /api/users/logout`
- **Header Request:**
  - `Authorization`: `Bearer <token>`
  *(Catatan: Token ini digunakan untuk mengidentifikasi sesi mana yang harus dihapus dari database)*

- **Response Body (Success 200 OK):**
  ```json
  {
      "data": "OK"
  }
  ```

- **Response Body (Error 401 Unauthorized):**
  Dikembalikan jika token tidak valid, tidak ada di header, atau tidak ditemukan di database.
  ```json
  {
      "message": "unauthorized"
  }
  ```

## 2. Struktur Folder & File
Lanjutkan penggunaan arsitektur modular yang sudah ada:
- **Routes (`src/routes/user-router.ts`):** Tempat mendefinisikan routing Elysia untuk endpoint logout.
- **Services (`src/services/user-services.ts`):** Tempat menyimpan logika bisnis aplikasi untuk menghapus sesi dari database.

---

## 3. Tahapan Implementasi (Step-by-Step Guide)

Ikuti langkah-langkah berikut untuk mengimplementasikan fitur logout:

### Langkah 1: Buat Logika Service (Business Logic)
1. Buka file `src/services/user-services.ts`.
2. Buat sebuah fungsi asynchronous (misal: `logoutUser`) yang menerima parameter `token` (berupa string).
3. **Logika di dalam fungsi:**
   - Lakukan pengecekan ke database (tabel `sessions`) untuk mencari sesi dengan `token` tersebut.
   - Jika sesi **tidak ditemukan**, lemparkan error (throw error) dengan pesan `"unauthorized"`.
   - Jika sesi ditemukan, jalankan perintah `DELETE` pada tabel `sessions` berdasarkan `token` tersebut menggunakan Drizzle ORM.
   - (Opsional) Anda bisa me-return boolean `true` atau biarkan fungsi selesai tanpa me-return apapun jika berhasil.

### Langkah 2: Buat Endpoint di Router
1. Buka file `src/routes/user-router.ts`.
2. Tambahkan endpoint `.delete('/logout', ...)` di bawah prefix `/users`.
3. **Logika di dalam handler:**
   - Ekstrak header `authorization` dari request.
   - Validasi keberadaan header tersebut. Pastikan formatnya dimulai dengan `"Bearer "`.
   - Jika tidak valid atau tidak ada, atur HTTP status menjadi 401 dan return `{"message": "unauthorized"}`.
   - Ambil nilai tokennya (hapus string `"Bearer "`).
   - Di dalam blok `try...catch`, panggil fungsi `UserService.logoutUser(token)`.
   - Jika berhasil (blok `try` tereksekusi sampai akhir), kembalikan response success: `{"data": "OK"}`.
   - Jika gagal (masuk ke blok `catch`), cek errornya. Jika pesan error adalah `"unauthorized"`, set HTTP status ke 401 dan kembalikan response `{"message": "unauthorized"}`. Jika error lain, kembalikan HTTP 500 (Internal Server Error).

### Langkah 3: Pengujian (Testing)
1. Jalankan server lokal aplikasi.
2. Lakukan login terlebih dahulu untuk mendapatkan **token** yang valid.
3. Buka API Client (Postman/cURL/Insomnia) dan uji endpoint `DELETE /api/users/logout` untuk 3 skenario:
   - **Skenario 1 (Tanpa Token):** Panggil endpoint tanpa mengirimkan header Authorization. Pastikan response adalah error "unauthorized".
   - **Skenario 2 (Token Valid):** Panggil endpoint dengan menyertakan token yang didapat dari login. Pastikan response adalah `{"data": "OK"}`. Cek juga di database apakah baris sesi tersebut benar-benar terhapus.
   - **Skenario 3 (Token Expired/Sudah Logout):** Gunakan token yang sama dari Skenario 2 (yang sudah dilogout/dihapus). Pastikan response adalah error "unauthorized".

## Kriteria Penerimaan (Acceptance Criteria)
- [ ] Endpoint `DELETE /api/users/logout` dapat diakses dan menerima HTTP DELETE.
- [ ] Proses logout berhasil menghapus baris token yang sesuai secara permanen dari tabel `sessions`.
- [ ] Proses logout memberikan response sukses `{"data": "OK"}` jika token valid.
- [ ] Endpoint memberikan response `{"message": "unauthorized"}` (HTTP 401) jika token salah, tidak ada, atau sudah pernah di-logout sebelumnya.
- [ ] File router dan service termodifikasi mengikuti konvensi penamaan yang sudah ada.
