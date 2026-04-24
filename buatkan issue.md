# Issue: Implementasi Unit Test untuk Seluruh API Endpoint

## Deskripsi Tugas
Tugas ini bertujuan untuk membangun sistem pengujian (*unit test*) otomatis untuk semua API yang tersedia di aplikasi kita. Pengujian ini menggunakan *test runner* bawaan dari Bun (`bun test`). Anda tidak perlu memikirkan arsitektur pengujian yang rumit, cukup fokus untuk merealisasikan skenario-skenario pengujian yang telah didaftarkan pada dokumen ini.

## Persyaratan Teknis
1. **Runner:** Gunakan `bun test`.
2. **Lokasi File:** Seluruh file *test* harus diletakkan di dalam folder `tests` pada *root* proyek.
3. **Konsistensi Data:** Sebelum setiap skenario *test* dijalankan, Anda **wajib menghapus data** yang berkaitan (seperti data di tabel `users` atau tabel *session*). Hal ini untuk memastikan pengujian tidak saling tumpang tindih (*isolated*) dan database selalu dalam keadaan bersih.

---

## Skenario Pengujian per API

Berikut adalah daftar *endpoint* yang ada saat ini beserta skenario yang wajib Anda tes. Fokuslah pada validasi input, fungsionalitas utama, dan kode respons HTTP.

### 1. `POST /auth/register` (Registrasi User)
- **Sukses:** Pendaftaran berhasil saat data (`name`, `email`, `password`) valid. Pastikan respons mengembalikan HTTP 200 dan data user (tanpa password).
- **Gagal - Validasi Input:** Pendaftaran ditolak (HTTP 400/422) jika kolom `name` berisi lebih dari 255 karakter.
- **Gagal - Email Invalid:** Pendaftaran ditolak jika format `email` tidak valid (misalnya hanya "user@").
- **Gagal - Email Duplikat:** Pendaftaran ditolak jika *email* yang sama persis sudah ada di database sebelumnya.

### 2. `POST /auth/users/login` (Login User)
- **Sukses:** Login berhasil ketika diberikan `email` dan `password` yang cocok dengan database. Pastikan respons mengembalikan *token* autentikasi.
- **Gagal - Kredensial Salah:** Login ditolak (HTTP 401 Unauthorized) jika email tidak ditemukan atau password salah.
- **Gagal - Validasi Payload:** Login ditolak jika *body request* tidak mencantumkan field `email` atau `password`.

### 3. `GET /api/users/current` (Ambil Data User Saat Ini)
- **Sukses:** Berhasil mendapatkan objek data user ketika mengirimkan *header* `Authorization` berisi `Bearer <token_valid>`.
- **Gagal - Tanpa Token:** Permintaan gagal (HTTP 401 Unauthorized) karena tidak ada *header* `Authorization` sama sekali.
- **Gagal - Token Invalid:** Permintaan gagal (HTTP 401 Unauthorized) jika token kedaluwarsa, format salah, atau token tidak ditemukan di database.

### 4. `DELETE /api/users/logout` (Logout User)
- **Sukses:** Berhasil menghapus token/sesi saat mengirimkan *header* `Authorization` berisi `Bearer <token_valid>`. Pastikan jika token yang sama dipakai lagi untuk endpoint `/api/users/current`, hasilnya adalah 401 Unauthorized.
- **Gagal - Tanpa Token:** Proses logout ditolak (HTTP 401 Unauthorized) jika *header* `Authorization` kosong.
- **Gagal - Token Invalid:** Proses logout ditolak (HTTP 401 Unauthorized) jika token tidak dikenali.

---

## Tahapan Implementasi (Step-by-Step Guide)

Sebagai referensi pengerjaan untuk memastikan kode terstruktur dan selesai dengan baik, silakan ikuti panduan tahap demi tahap berikut:

1. **Persiapan Folder dan File Test**
   - Buat folder bernama `tests` di bagian *root* proyek.
   - Buat file pengujian berdasarkan modulnya, contoh: `tests/auth.test.ts` (untuk register & login) dan `tests/user.test.ts` (untuk current user & logout).

2. **Membuat Mekanisme *Reset* Database**
   - Di dalam kode tes Anda, buat sebuah fungsi bantuan (misalnya `clearDatabase()`) yang mengeksekusi penghapusan seluruh data di tabel `users`.
   - Gunakan *hook* `beforeEach()` dari `bun:test` untuk memanggil `clearDatabase()`. Ini menjamin setiap blok `test()` yang dijalankan di bawahnya akan selalu mulai dengan tabel yang kosong.

3. **Implementasikan Skenario Secara Bertahap**
   - **Mulai dari Satu Skenario:** Ambil skenario pertama (`POST /auth/register` yang sukses). Tulis kodenya, jalankan `bun test`, dan pastikan *passed*.
   - **Selesaikan Satu API:** Lanjutkan menulis skenario gagal untuk API tersebut. Pastikan semuanya *passed* sebelum berpindah ke API berikutnya.
   - *Tips:* Beberapa pengujian (seperti Login atau Get Current User) mengharuskan Anda memiliki data *user* yang valid di database. Pada kasus ini, lakukan registrasi/insert data user terlebih dahulu di dalam fungsi `test()` tersebut sebelum Anda menjalankan pengujian Login/Current User.

4. **Pengecekan Akhir Menyeluruh**
   - Setelah semua skenario untuk keempat API ditulis, jalankan `bun test` pada level *root* direktori.
   - Validasi bahwa semua pengujian menunjukkan warna hijau (*passed*). Jika ada yang merah (*failed*), periksa kembali apakah ada masalah pada pembersihan database atau salah *logic* pengujian.
