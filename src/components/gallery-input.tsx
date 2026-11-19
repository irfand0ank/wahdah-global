"use client";

import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import { useState } from "react";
import { supabaseKey, supabaseUrl } from "@/lib/supabase";

const MAX_SIDE = 1600;

/** Perkecil gambar di browser (maks. 1600 px, JPEG) agar unggahan ringan. */
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d")!;
  // JPEG tidak punya transparansi: beri latar putih agar PNG transparan tidak jadi hitam.
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Gagal memproses"))),
      "image/jpeg",
      0.85,
    ),
  );
}

export function GalleryInput({
  name,
  label,
  folder,
  initial,
}: {
  name: string;
  label: string;
  folder: string;
  initial: string[];
}) {
  const [urls, setUrls] = useState(initial);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const list = Array.from(files);
    setPending((n) => n + list.length);
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);

    for (const file of list) {
      try {
        const blob = await shrink(file);
        const path = `${folder}/gallery/${crypto.randomUUID()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(path, blob, { contentType: "image/jpeg" });
        if (uploadError) throw uploadError;
        const url = supabase.storage.from("media").getPublicUrl(path).data
          .publicUrl;
        setUrls((current) => [...current, url]);
      } catch (e) {
        setError(
          `Gagal mengunggah ${file.name}: ${e instanceof Error ? e.message : "kesalahan tidak dikenal"}`,
        );
      } finally {
        setPending((n) => n - 1);
      }
    }
  }

  return (
    <div className="text-sm">
      <p className="font-semibold">{label}</p>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      {/* Menahan tombol Simpan selama unggahan masih berjalan. */}
      {pending > 0 && (
        <input
          className="sr-only"
          tabIndex={-1}
          required
          value=""
          onChange={() => {}}
          aria-label="Tunggu sampai unggahan gambar selesai"
        />
      )}

      {urls.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {urls.map((url, i) => (
            <li key={url} className="relative">
              <Image
                src={url}
                alt={`Gambar ${i + 1}`}
                width={200}
                height={150}
                className="aspect-4/3 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => setUrls(urls.filter((u) => u !== url))}
                aria-label={`Hapus gambar ${i + 1}`}
                className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-white/95 text-base font-bold text-red-700 shadow hover:bg-red-50"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          void onFiles(e.target.files);
          e.target.value = "";
        }}
        className="mt-3 block w-full"
      />
      <p className="mt-1 text-xs text-muted">
        {pending > 0
          ? `Mengunggah ${pending} gambar… tunggu sebelum menyimpan.`
          : "Bisa pilih beberapa gambar sekaligus. Klik Simpan setelah selesai agar perubahan galeri tersimpan."}
      </p>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
