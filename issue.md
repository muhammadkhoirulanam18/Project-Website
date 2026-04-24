# Issue: Implementasi Fitur Swagger (API Documentation)

## Deskripsi Tugas
Tugas ini bertujuan untuk mengintegrasikan dokumentasi API interaktif menggunakan **Swagger** ke dalam proyek ini. Dengan adanya antarmuka Swagger, developer atau *user* lain yang ingin menggunakan API pada aplikasi ini dapat dengan mudah melihat daftar *endpoint* yang tersedia, parameter yang dibutuhkan, serta langsung mencoba request (uji coba) melalui *browser* tanpa memerlukan aplikasi tambahan seperti Postman.

## 1. Spesifikasi Fitur
- Menggunakan plugin resmi dari framework: `@elysiajs/swagger`.
- Dokumentasi API dapat diakses melalui browser pada path `/swagger`.
- Menampilkan informasi dasar aplikasi seperti Judul ("Project Web API") dan versi ("1.0.0").
- Secara otomatis membaca skema validasi (`t.Object`, `t.String()`) yang sudah ada di *router* dan mengubahnya menjadi dokumentasi parameter.

## 2. Struktur File yang Relevan
- **`package.json`**: Untuk menambahkan dependensi plugin Swagger.
- **`index.ts`**: *Entry point* aplikasi tempat di mana plugin Swagger akan didaftarkan/di-*inject* ke dalam *instance* Elysia.

---

## 3. Tahapan Implementasi (Step-by-Step Guide)

Ikuti langkah-langkah di bawah ini untuk mengimplementasikan fitur Swagger secara sistematis. Panduan ini dibuat spesifik agar dapat langsung dieksekusi dengan mudah.

### Langkah 1: Instalasi Dependensi
1. Buka terminal Anda dan pastikan Anda berada di direktori *root* proyek.
2. Jalankan perintah instalasi menggunakan package manager Bun:
   ```bash
   bun add @elysiajs/swagger
   ```
3. Pastikan proses instalasi selesai tanpa error dan plugin tercatat di dalam file `package.json`.

### Langkah 2: Registrasi Plugin di `index.ts`
1. Buka file utama aplikasi yaitu `index.ts` yang berada di *root* folder.
2. Pada bagian paling atas file (bersama deretan *import* lainnya), tambahkan *import* untuk modul Swagger:
   ```typescript
   import { swagger } from '@elysiajs/swagger';
   ```
3. Cari tempat di mana instance aplikasi Elysia diinisialisasi (`const app = new Elysia()`).
4. **Penting:** Tambahkan pemanggilan `.use(swagger(...))` **sebelum** Anda memanggil *router* lain seperti `.use(userRouter)`. Tujuannya agar Swagger bisa membaca rute-rute yang dideklarasikan setelahnya.
   *Contoh implementasi kode:*
   ```typescript
   export const app = new Elysia()
     // Daftarkan Swagger di awal
     .use(swagger({
         path: '/swagger',
         documentation: {
             info: {
                 title: 'Project Web API Documentation',
                 version: '1.0.0',
                 description: 'Dokumentasi interaktif untuk REST API Project Web'
             }
         }
     }))
     // Router lain tetap di bawahnya
     .get('/', () => 'Hello Elysia')
     .use(userRouter)
     .use(authRouter)
     // ...kode lainnya
   ```

### Langkah 3: Pengujian (Testing)
1. Jalankan server lokal aplikasi Anda:
   ```bash
   bun index.ts
   ```
2. Buka *browser* pilihan Anda (Chrome/Firefox/Safari).
3. Akses URL berikut: `http://localhost:3000/swagger`
4. **Verifikasi:** Anda harusnya melihat antarmuka antarmuka grafis (UI) khas Swagger/OpenAPI yang menampilkan daftar API (`/auth/register`, `/auth/users/login`, `/api/users/current`, dll) beserta skema *body* yang dibutuhkan.
5. Cobalah klik salah satu API dan jalankan *'Try it out'* untuk memastikan *endpoint* dapat di-hit secara langsung dari UI Swagger.

## Kriteria Penerimaan (Acceptance Criteria)
- [ ] Plugin `@elysiajs/swagger` telah terinstal dan terdaftar di `package.json`.
- [ ] Modul Swagger berhasil di-*import* dan di-*use* di dalam file `index.ts`.
- [ ] Halaman dokumentasi API dapat diakses dengan sukses di `http://localhost:3000/swagger`.
- [ ] Informasi dasar API (Title dan Version) muncul dengan benar pada bagian atas UI Swagger.
- [ ] Seluruh endpoint autentikasi dan user muncul di dalam antarmuka Swagger beserta parameter validasinya.
