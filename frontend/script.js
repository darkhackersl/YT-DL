async function fetchDetails() {
    const url = document.getElementById('youtubeUrl').value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "Loading...";

    try {
        const response = await fetch(`https://<your-backend-url>/api/details?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p>${data.error}</p>`;
        } else {
            resultDiv.innerHTML = `
                <h3>${data.title}</h3>
                <img src="${data.thumbnail}" alt="Thumbnail">
                <p>Size: ${data.size}</p>
                <a href="${data.dl_link}" download>
                    <button>Download MP3</button>
                </a>
            `;
        }
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = "<p>An error occurred. Please try again later.</p>";
    }
}
