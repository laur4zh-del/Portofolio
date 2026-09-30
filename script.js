// Portfolio JavaScript

console.log("Portfolio website loaded successfully.");


// ================================
// FADE IN ANIMATION
// ================================

const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    },
    {
        threshold: 0.15
    }
);


sections.forEach((section) => {

    observer.observe(section);

});

// ==========================================
// SISTEM KUMPULAN TUGAS
// ==========================================

const uploadForm =
  document.getElementById("uploadForm");

const uploadButton =
  document.getElementById("uploadButton");

const uploadStatus =
  document.getElementById("uploadStatus");

const fileList =
  document.getElementById("fileList");

const refreshFiles =
  document.getElementById("refreshFiles");


// ===============================
// MENAMPILKAN DAFTAR TUGAS
// ===============================

async function loadFiles() {

  try {

    fileList.innerHTML =
      "<p>Memuat tugas...</p>";

    const response =
      await fetch("/api/files");

    const data =
      await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    if (data.files.length === 0) {

      fileList.innerHTML =
        "<p>Belum ada tugas yang dikumpulkan.</p>";

      return;
    }

    fileList.innerHTML = "";

    data.files
      .sort(
        (a, b) =>
          new Date(b.uploadedAt) -
          new Date(a.uploadedAt)
      )
      .forEach(file => {

        const item =
          document.createElement("div");

        item.className =
          "task-item";

        const parts =
          file.pathname.split("/");

        const fileName =
          parts[parts.length - 1];

        const course =
          parts[1]
            .replace(/-/g, " ");

        const cleanName =
          fileName
            .replace(/^\d+-/, "")
            .replace(/-/g, " ");

        const date =
          new Date(file.uploadedAt);

        const downloadUrl =
          "/api/file?pathname=" +
          encodeURIComponent(
            file.pathname
          );

        item.innerHTML = `

          <div class="task-info">

            <strong>
              ${cleanName}
            </strong>

            <span>
              ${course}
              ·
              ${formatFileSize(file.size)}
              ·
              ${date.toLocaleDateString("id-ID")}
            </span>

          </div>

          <a
            href="${downloadUrl}"
            target="_blank"
          >
            Lihat File
          </a>

        `;

        fileList.appendChild(item);

      });

  } catch (error) {

    console.error(error);

    fileList.innerHTML =
      "<p>Gagal memuat daftar tugas.</p>";

  }

}


// ===============================
// UPLOAD TUGAS
// ===============================

uploadForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();

    const course =
      document
        .getElementById("course")
        .value
        .trim();

    const title =
      document
        .getElementById("title")
        .value
        .trim();

    const file =
      document
        .getElementById("file")
        .files[0];

    if (!file) {

      uploadStatus.textContent =
        "Silakan pilih file terlebih dahulu.";

      return;
    }

    if (file.size > 4 * 1024 * 1024) {

      uploadStatus.textContent =
        "Ukuran file maksimal 4 MB.";

      return;
    }

    const formData =
      new FormData();

    formData.append(
      "course",
      course
    );

    formData.append(
      "title",
      title
    );

    formData.append(
      "file",
      file
    );

    uploadButton.disabled = true;

    uploadButton.textContent =
      "Mengupload...";

    uploadStatus.textContent =
      "Sedang mengupload tugas...";

    try {

      const response =
        await fetch(
          "/api/upload",
          {
            method: "POST",
            body: formData
          }
        );

      const data =
        await response.json();

      if (!response.ok || !data.success) {

        throw new Error(
          data.error ||
          "Upload gagal."
        );

      }

      uploadStatus.textContent =
        "✓ Tugas berhasil dikumpulkan.";

      uploadForm.reset();

      await loadFiles();

    } catch (error) {

      console.error(error);

      uploadStatus.textContent =
        "✕ " + error.message;

    }

    uploadButton.disabled = false;

    uploadButton.textContent =
      "Upload Tugas";

  }
);


// ===============================
// REFRESH
// ===============================

refreshFiles.addEventListener(
  "click",
  loadFiles
);


// ===============================
// FORMAT UKURAN FILE
// ===============================

function formatFileSize(bytes) {

  if (bytes < 1024) {
    return bytes + " B";
  }

  if (bytes < 1024 * 1024) {
    return (
      (bytes / 1024).toFixed(1)
      + " KB"
    );
  }

  return (
    (bytes / (1024 * 1024)).toFixed(1)
    + " MB"
  );
}


// Jalankan saat halaman dibuka
loadFiles();
