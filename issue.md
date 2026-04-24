# Issue: Bug pada Pendaftaran User (Registrasi dengan Nama Panjang)

## Deskripsi Bug
Saat pengguna mencoba mendaftar (registrasi) melalui endpoint `POST /auth/register` dengan mengirimkan data `name` yang sangat panjang (misalnya 300 karakter), server mengalami *error* dan mengembalikan pesan error langsung dari database. 

Pesan error yang dikembalikan: `Failed query: insert into users (...) Data too long for column 'name'`.

## Penyebab
Pada file struktur database (`src/db/schema.ts`), kolom `name` untuk tabel `users` didefinisikan dengan batas maksimal 255 karakter (`varchar(255)`). Namun, pada sisi router API (`src/routes/auth-routes.ts`), tidak ada validasi panjang maksimal untuk kolom `name`. 

Akibatnya, data yang terlalu panjang tetap diteruskan ke database, menyebabkan *error* tingkat sistem.

## Perilaku yang Diharapkan (Expected Behavior)
Server harusnya dapat mencegat (intercept) request dengan data nama yang terlalu panjang *sebelum* memprosesnya ke database. API harus mengembalikan response HTTP 400 (Bad Request) dengan pesan validasi yang jelas dari sistem (contoh: "Panjang nama maksimal adalah 255 karakter"), bukan menampilkan pesan *error query database* yang mentah.

## Struktur File yang Relevan
- **File Tujuan:** `src/routes/auth-routes.ts`

---

## Tahapan Implementasi Perbaikan (Step-by-Step Guide)

Tugas Anda adalah menambahkan validasi bawaan dari *framework* Elysia (menggunakan `t.Object` dari `@sinclair/typebox`) agar menolak nama yang lebih dari 255 karakter.

### Langkah 1: Buka File Router Autentikasi
Buka file `src/routes/auth-routes.ts` pada *code editor* Anda.

### Langkah 2: Temukan Skema Validasi
Cari blok kode yang menangani *routing* untuk `POST /register`. Di bagian bawah blok tersebut, Anda akan menemukan konfigurasi validasi *body* request seperti ini:

```typescript
// Cari bagian ini
{
  body: t.Object({
    name: t.String(),
    email: t.String({ format: 'email' }),
    password: t.String(),
  })
}
```

### Langkah 3: Tambahkan Batas Maksimal (maxLength)
Ubah definisi validasi untuk atribut `name`. Tambahkan properti `maxLength: 255` di dalam argumen `t.String()`.

**Kode yang harus diubah (Versi Perbaikan):**
```typescript
{
  body: t.Object({
    // Tambahkan batas maksimum 255 karakter di sini
    name: t.String({ maxLength: 255 }), 
    email: t.String({ format: 'email' }),
    password: t.String(),
  })
}
```

### Langkah 4: Pengujian (Testing)
Setelah kode diubah, lakukan pengujian untuk memastikan *bug* telah diperbaiki:
1. Jalankan server lokal aplikasi Anda (`bun index.ts`).
2. Gunakan Postman, Insomnia, atau cURL untuk mengirimkan request `POST` ke `http://localhost:3000/auth/register`.
3. Buat *request body* (JSON) dan isi *field* `name` dengan teks sembarang yang panjangnya lebih dari 255 karakter (contoh: ketik huruf "A" sebanyak 300 kali).
4. Kirim *request*.
5. **Verifikasi:** Pastikan response yang diterima adalah HTTP Status 400, dan pesannya menunjukkan *error* validasi (seperti tipe data atau batas karakter tidak sesuai), bukan error bertuliskan "Failed query".

## Kriteria Penerimaan (Acceptance Criteria)
- [x] Validasi `maxLength: 255` telah ditambahkan pada skema pendaftaran user di file `auth-routes.ts`.
- [x] Mendaftar dengan nama <= 255 karakter tetap berfungsi normal.
- [x] Mendaftar dengan nama > 255 karakter akan langsung ditolak oleh router (HTTP 400 Bad Request) sebelum menyentuh fungsi *database insert*.
- [x] *Error message* database mentah tidak lagi bocor (terekspos) ke response client.
