// ---------------- URL Summarization ----------------
async function summarizeURL() {
  const url = document.getElementById("urlInput").value;
  const summaryBox = document.getElementById("summaryBox");

  if (!url.trim()) {
    alert("Please enter a valid URL!");
    return;
  }

  summaryBox.innerHTML = "⏳ Summarizing URL...";

  try {
    const response = await fetch("http://localhost:3000/api/summarise/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    summaryBox.innerHTML = data.summary || "❌ Error generating summary.";
  } catch (err) {
    console.error(err);
    summaryBox.innerHTML = "❌ Error connecting to backend.";
  }
}

// ---------------- File Summarization ----------------
async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const summaryBox = document.getElementById("summaryBox");

  if (!fileInput.files.length) {
    alert("Please select a file!");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  summaryBox.innerHTML = "⏳ Uploading and summarizing file...";

  try {
    const response = await fetch("http://localhost:3000/api/summarise/file", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    summaryBox.innerHTML = data.summary || "❌ Error generating summary.";
  } catch (err) {
    console.error(err);
    summaryBox.innerHTML = "❌ Error connecting to backend.";
  }
}
function copySummary() {
  const summary = document.getElementById("summaryBox").innerText;
  if (!summary) return alert("No summary to copy!");
  navigator.clipboard.writeText(summary).then(() => {
    alert("Summary copied to clipboard!");
  });
}

function shareSummary() {
  const summary = document.getElementById("summaryBox").innerText;
  if (!summary) return alert("No summary to share!");
  if (navigator.share) {
    navigator.share({
      title: "AI Summary",
      text: summary,
    }).catch(console.error);
  } else {
    alert("Sharing not supported on this device. Copy the summary instead.");
  }
}
