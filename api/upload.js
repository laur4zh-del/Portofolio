import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const course = formData.get("course");
    const title = formData.get("title");

    if (!file || typeof file === "string") {
      return Response.json(
        { error: "File belum dipilih." },
        { status: 400 }
      );
    }

    if (!course || !title) {
      return Response.json(
        { error: "Mata kuliah dan nama tugas wajib diisi." },
        { status: 400 }
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      return Response.json(
        { error: "Ukuran file maksimal 4 MB." },
        { status: 400 }
      );
    }

    const safeCourse = course
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const safeTitle = title
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const safeFileName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "-");

    const pathname =
      `tugas/${safeCourse}/${Date.now()}-${safeTitle}-${safeFileName}`;

    const blob = await put(pathname, file, {
      access: "private",
      addRandomSuffix: true
    });

    return Response.json({
      success: true,
      message: "Tugas berhasil diupload.",
      pathname: blob.pathname
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Terjadi kesalahan saat mengupload tugas."
      },
      { status: 500 }
    );
  }
      }
