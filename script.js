const API_URL = "https://ai-summariser-backend-f9zy.onrender.com/api/summarise";

// ---------------- Helper: Display summary as points ----------------
function displaySummary(summary) {
  const summaryBox = document.getElementById("summaryBox");
  if (!summary) {
    summaryBox.innerHTML = "❌ No summary available.";
    return;
  }

  // Split text into lines or sentences
  const points = summary.split(/\n|(?<=\.)\s+/).filter(p => p.trim() !== "");

  // Create bullet list
  const ul = document.createElement("ul");
  ul.style.paddingLeft = "20px";
  ul.style.lineHeight = "1.6";

  points.forEach(point => {
    const li = document.createElement("li");
    li.textContent = point.trim();
    ul.appendChild(li);
  });

  summaryBox.innerHTML = "";
  summaryBox.appendChild(ul);
}

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
    const response = await fetch(`${API_URL}/url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) throw new Error("Backend error");

    const data = await response.json();
    displaySummary(data.summary);
  } catch (err) {
    console.error("URL summarization error:", err);
    summaryBox.innerHTML = "❌ Error connecting to backend.";
  }
}

// ---------------- File Summarization (PDF/DOCX) ----------------
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
    const response = await fetch(`${API_URL}/file`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Backend error");

    const data = await response.json();
    displaySummary(data.summary);
  } catch (err) {
    console.error("File summarization error:", err);
    summaryBox.innerHTML = "❌ Error connecting to backend.";
  }
}

// ---------------- Copy & Share ----------------
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
