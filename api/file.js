import { get } from "@vercel/blob";

export async function GET(request) {

  try {

    const { searchParams } =
      new URL(request.url);

    const pathname =
      searchParams.get("pathname");

    if (!pathname) {

      return new Response(
        "Path file tidak ditemukan.",
        { status: 400 }
      );

    }

    const result = await get(
      pathname,
      {
        access: "private"
      }
    );

    if (!result || result.statusCode !== 200) {

      return new Response(
        "File tidak ditemukan.",
        { status: 404 }
      );

    }

    return new Response(
      result.stream,
      {
        headers: {
          "Content-Type":
            result.blob.contentType ||
            "application/octet-stream",

          "Content-Disposition":
            result.blob.contentDisposition ||
            "inline",

          "X-Content-Type-Options":
            "nosniff",

          "Cache-Control":
            "private, no-cache"
        }
      }
    );

  } catch (error) {

    console.error(error);

    return new Response(
      "Gagal mengambil file.",
      { status: 500 }
    );

  }
}
