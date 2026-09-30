import { list } from "@vercel/blob";

export async function GET() {
  try {

    const { blobs } = await list({
      prefix: "tugas/"
    });

    const files = blobs.map((blob) => ({
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt
    }));

    return Response.json({
      success: true,
      files
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Gagal mengambil daftar tugas."
      },
      { status: 500 }
    );

  }
}
