# Project Web API

Aplikasi backend berbasis web yang dikembangkan menggunakan **Bun** dan **ElysiaJS**. Aplikasi ini menyediakan layanan REST API untuk autentikasi dan manajemen pengguna (registrasi, login, autentikasi sesi, dan pemanggilan data pengguna saat ini).

## Technology Stack & Libraries

Aplikasi ini dibangun dengan kumpulan teknologi modern yang dioptimalkan untuk performa tinggi:
- **Bun**: *JavaScript runtime*, *package manager*, dan *test runner* super cepat.
- **ElysiaJS**: *Web framework* ergonomis dan berkinerja tinggi untuk Bun.
- **Drizzle ORM**: TypeScript ORM yang *type-safe* untuk interaksi dengan database.
- **MySQL2**: Driver database MySQL.
- **Bcrypt.js**: Library untuk *hashing* password.
- **TypeScript**: Bahasa pemrograman utama yang menawarkan *static typing*.

## Arsitektur & Struktur Folder

Aplikasi ini menggunakan arsitektur modular yang rapi untuk menjaga agar kode tetap bersih dan mudah dikembangkan.

```text
📦 project-web
 ┣ 📂 src
 ┃ ┣ 📂 db
 ┃ ┃ ┣ 📜 index.ts        # Konfigurasi koneksi database dan inisiasi Drizzle
 ┃ ┃ ┗ 📜 schema.ts       # Definisi skema tabel database (Users & Sessions)
 ┃ ┣ 📂 routes
 ┃ ┃ ┣ 📜 auth-routes.ts  # Definisi endpoint API untuk autentikasi (Register, Login)
 ┃ ┃ ┗ 📜 user-router.ts  # Definisi endpoint API untuk aksi spesifik pengguna
 ┃ ┗ 📂 services
 ┃   ┣ 📜 auth-services.ts# Logika bisnis (login, manajemen token)
 ┃   ┗ 📜 user-services.ts# Logika bisnis (pendaftaran, manajemen profil, validasi)
 ┣ 📂 tests
 ┃ ┣ 📜 auth.test.ts      # Unit tests terisolasi untuk endpoint autentikasi
 ┃ ┗ 📜 user.test.ts      # Unit tests terisolasi untuk fitur sesi pengguna
 ┣ 📜 index.ts            # Entry point utama aplikasi & inisiasi server Elysia
 ┣ 📜 docker-compose.yml  # Konfigurasi Docker (contoh: Database MySQL)
 ┣ 📜 drizzle.config.ts   # Konfigurasi Drizzle ORM (schema source, dll)
 ┗ 📜 package.json        # Daftar dependensi dan konfigurasi project
```

## Skema Database

Sistem ini menggunakan dua tabel utama yang saling berelasi:

### 1. Tabel `users`
Menyimpan informasi kredensial dan profil pengguna secara aman.
- `id` (INT, Serial Primary Key)
- `name` (VARCHAR 255, Not Null): Memiliki validasi maksimal 255 karakter
- `email` (VARCHAR 255, Not Null, Unique): Email untuk proses *login*
- `password` (VARCHAR 255, Not Null): Disimpan dalam bentuk *hashed*
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. Tabel `sessions`
Menyimpan data *token* aktif bagi pengguna yang telah berhasil *login*.
- `id` (INT, Serial Primary Key)
- `user_id` (BIGINT, Not Null, Foreign Key mengarah ke `users.id`)
- `token` (VARCHAR 255, Not Null): Digunakan sebagai token `Bearer`
- `created_at` (TIMESTAMP)

## API Tersedia (Endpoints)

Aplikasi memiliki antarmuka API terstruktur sebagai berikut:

| HTTP Method | Endpoint | Deskripsi | Headers Authentication |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Mendaftarkan pengguna baru | Tidak Diperlukan |
| `POST` | `/auth/users/login` | *Login* dan mendapatkan akses token | Tidak Diperlukan |
| `GET` | `/api/users/current` | Mendapatkan profil data user aktif | `Authorization: Bearer <token>` |
| `DELETE` | `/api/users/logout` | *Logout* (menghapus akses sesi / token) | `Authorization: Bearer <token>` |

## Cara Setup Project

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di lingkungan pengembangan lokal (*local environment*):

1. **Install Dependensi**
   Pastikan sistem Anda sudah terinstal [Bun](https://bun.sh/). 
   ```bash
   bun install
   ```

2. **Konfigurasi Environment Variables**
   Buat atau sesuaikan file `.env` di *root* proyek dan tambahkan pengaturan koneksi ke database MySQL Anda:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=mydb
   ```

3. **Inisialisasi Database**
   (Opsional) Jika Anda menggunakan Docker, Anda bisa menjalankan kontainer database menggunakan perintah `docker-compose up -d`.
   
   Sinkronisasikan skema Drizzle ke dalam database:
   ```bash
   bunx drizzle-kit push
   ```

4. **Jalankan Aplikasi**
   Setelah semua setup siap, server dapat dihidupkan dengan perintah:
   ```bash
   bun index.ts
   ```
   *Secara default, server Elysia akan berjalan di `http://localhost:3000`.*

## Cara Menjalankan Test

Sistem telah dilengkapi dengan *unit test* untuk menjamin konsistensi dan kestabilan. Fitur ini secara mandiri menghapus isi tabel (*database reset*) sebelum setiap skenario agar test berjalan tanpa konflik data.

Gunakan *test runner* bawaan Bun untuk mengeksekusi semua file *test* di folder `tests/`:
```bash
bun test
```
*Anda akan melihat log output skenario pengujian beserta waktu eksekusinya yang sangat cepat.*
