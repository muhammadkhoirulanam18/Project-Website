# Issue: Implementasi Fitur Login dan Session Management

## Deskripsi Tugas
Tugas ini bertujuan untuk menambahkan fitur autentikasi (Login) bagi pengguna. Ketika pengguna berhasil login dengan kombinasi email dan password yang benar, sistem akan menghasilkan token (UUID) dan menyimpannya di dalam tabel `sessions` untuk melacak sesi pengguna yang aktif.

## 1. Perubahan Skema Database
Tambahkan tabel baru bernama `sessions` pada file schema Drizzle (biasanya di `src/db/schema.ts`):
- `id`: integer, primary key, auto increment
- `user_id`: integer, foreign key yang mereferensikan kolom `id` pada tabel `users`.
- `token`: varchar(255), not null (akan diisi dengan nilai UUID unik untuk setiap sesi).
- `created_at`: timestamp, default CURRENT_TIMESTAMP

## 2. Struktur Folder & File
Pertahankan struktur arsitektur modular di dalam folder `src/`. Untuk fitur autentikasi ini, buat/gunakan file berikut:
- **Routes (`src/routes/`):** Tempat mendefinisikan routing Elysia.js. Contoh penamaan file: `auth-routes.ts`.
- **Services (`src/services/`):** Tempat menyimpan logika bisnis aplikasi. Contoh penamaan file: `auth-services.ts`.

## 3. Spesifikasi API

Sistem harus memiliki endpoint untuk autentikasi:
- `POST /auth/register` (Untuk mendaftarkan user baru - bisa refactor dari fitur registrasi sebelumnya atau buat baru di router auth).
- `POST /auth/users/login` (Untuk proses login user).

**Spesifikasi Endpoint Login (`POST /auth/users/login`)**

- **Request Body (JSON):**
  ```json
  {
    "email": "bernadyaloacalhost",
    "password": "rahasia"
  }
  ```

- **Response Body (Success 200 OK):**
  ```json
  {
    "data": "<UUID_TOKEN_DISINI>"
  }
  ```

- **Response Body (Fail 401/400 - Unauthorized/Bad Request):**
  ```json
  {
    "error": "Email atau password salah"
  }
  ```

---

## 4. Tahapan Implementasi (Step-by-Step Guide)

Ikuti langkah-langkah berikut untuk mengimplementasikan fitur login:

### Langkah 1: Update Schema Database
1. Buka file `src/db/schema.ts`.
2. Definisikan tabel `sessions` menggunakan Drizzle ORM sesuai spesifikasi di atas. Pastikan untuk membuat relasi (foreign key) ke tabel `users`.
3. Jalankan perintah terminal untuk melakukan sinkronisasi/push schema ke database MySQL:
   `bunx drizzle-kit push`

### Langkah 2: Buat Auth Service (Business Logic)
1. Buat file `src/services/auth-services.ts`.
2. Buat fungsi asynchronous (misal: `loginUser`) yang menerima `email` dan `password`.
3. **Logika fungsi login:**
   - Cari user di database berdasarkan `email` yang diinput.
   - Jika user **tidak ditemukan**, kembalikan pesan error: `"Email atau password salah"`.
   - Jika user ditemukan, bandingkan (verify) `password` inputan dengan password hash yang ada di database menggunakan library `bcryptjs` (gunakan fungsi `bcrypt.compare()`).
   - Jika password **tidak cocok**, kembalikan pesan error: `"Email atau password salah"`. (Catatan: Pesan error disamakan demi keamanan agar tidak membocorkan apakah email terdaftar atau tidak).
   - Jika password cocok, *generate* token baru menggunakan format UUID (bisa menggunakan fungsi `crypto.randomUUID()` bawaan Node/Bun).
   - Simpan data sesi baru ke tabel `sessions` (masukkan `user_id` dari user yang login dan `token` UUID tersebut).
   - Kembalikan nilai `token` tersebut.

### Langkah 3: Buat Auth Router (API Endpoint)
1. Buat file `src/routes/auth-routes.ts`.
2. Buat instance Elysia baru (misal dengan `prefix: '/auth'`).
3. Definisikan route `.post('/users/login', ... )`.
4. Ambil `email` dan `password` dari `body` request. Sangat disarankan menambahkan skema validasi agar endpoint aman.
5. Di dalam block `try...catch`, panggil fungsi `loginUser` dari service.
6. Tangani hasilnya:
   - Jika berhasil, kembalikan response JSON: `{"data": token}`.
   - Jika gagal (karena credential salah), tangkap errornya, atur HTTP status menjadi 400 atau 401, dan kembalikan JSON: `{"error": "Email atau password salah"}`.
7. *(Opsional)* Pindahkan juga route registrasi ke router ini sehingga menjadi `/auth/register`.

### Langkah 4: Integrasi Router
1. Buka file utama aplikasi (`index.ts`).
2. Import `auth-routes.ts`.
3. Daftarkan router tersebut ke aplikasi utama Elysia (`app.use(authRoutes)`).

## Kriteria Penerimaan (Acceptance Criteria)
- [ ] Tabel `sessions` berhasil dibuat di database dengan relasi FK yang benar ke tabel `users`.
- [ ] Mengirim kredensial yang salah ke `/auth/users/login` menghasilkan error `"Email atau password salah"`.
- [ ] Mengirim kredensial yang benar menghasilkan token UUID.
- [ ] Token UUID yang dihasilkan berhasil tersimpan di tabel `sessions` terkait dengan user yang bersangkutan.
- [ ] Struktur folder dan penamaan file mengikuti standar yang ditetapkan.
