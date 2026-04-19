# Issue: Implementasi Fitur Logout User

## Deskripsi Tugas
Tugas ini bertujuan untuk menambahkan fitur Logout bagi pengguna yang sedang aktif (login). Proses logout dilakukan dengan cara menghapus token sesi (session token) milik pengguna tersebut dari tabel `sessions` di database secara efisien. API ini membutuhkan autentikasi berupa Bearer Token yang dikirimkan melalui header request.

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

Ikuti langkah-langkah berikut untuk mengimplementasikan fitur logout dengan cara yang paling optimal:

### Langkah 1: Buat Logika Service (Business Logic)
1. Buka file `src/services/user-services.ts`.
2. Buat sebuah fungsi asynchronous (misal: `logoutUser`) yang menerima parameter `token` (berupa string).
3. **Logika di dalam fungsi (Optimized Version):**
   - Jalankan perintah `DELETE` langsung pada tabel `sessions` berdasarkan `token` tersebut menggunakan Drizzle ORM.
   - Ambil hasil eksekusinya (ResultSetHeader).
   - Periksa properti `affectedRows`. Jika `affectedRows === 0`, berarti token tidak ditemukan di database, maka lemparkan error (throw error) dengan pesan `"unauthorized"`.

### Langkah 2: Buat Endpoint di Router
1. Buka file `src/routes/user-router.ts`.
2. Tambahkan endpoint `.delete('/logout', ...)` di bawah prefix `/users`.
3. **Logika di dalam handler (Robust Version):**
   - Ambil header `authorization` dari request.
   - Validasi keberadaan header tersebut.
   - Gunakan metode `split(' ')` untuk memisahkan tipe token dan nilainya. Pastikan tipe token (setelah di-`toLowerCase()`) adalah `"bearer"`.
   - Jika tidak valid, atur HTTP status menjadi 401 dan return `{"message": "unauthorized"}`.
   - Ekstrak nilai token-nya.
   - Di dalam blok `try...catch`, panggil fungsi `UserService.logoutUser(token)`.
   - Jika berhasil, kembalikan response success: `{"data": "OK"}`.
   - Jika gagal (masuk ke blok `catch`), cek errornya. Jika pesan error adalah `"unauthorized"`, set HTTP status ke 401 dan kembalikan response `{"message": "unauthorized"}`. Jika error sistem lain, kembalikan HTTP 500 (Internal Server Error).

### Langkah 3: Pengujian (Testing)
1. Jalankan server lokal aplikasi.
2. Lakukan login terlebih dahulu untuk mendapatkan **token** yang valid.
3. Uji skenario: tanpa token, token salah format, token valid (berhasil logout), dan token yang sudah di-logout (error unauthorized).

## Kriteria Penerimaan (Acceptance Criteria)
- [ ] Endpoint `DELETE /api/users/logout` mengimplementasikan penghapusan sesi dalam satu query tunggal yang efisien.
- [ ] Parsing header Authorization bersifat robust (case-insensitive terhadap kata 'Bearer').
- [ ] Proses logout berhasil menghapus baris token yang sesuai dari database.
- [ ] Response sukses dan error sesuai dengan spesifikasi.
