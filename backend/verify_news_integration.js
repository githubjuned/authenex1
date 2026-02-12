// Using global fetch (Node 18+)

async function verify() {
    try {
        console.log("Fetching news from backend...");
        const response = await fetch("http://localhost:3001/api/news");
        if (!response.ok) {
            const txt = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${txt}`);
        }
        const data = await response.json();
        console.log("Success! Received " + data.length + " news items.");
        if (data.length > 0) {
            console.log("First item:", JSON.stringify(data[0], null, 2));
        } else {
            console.log("Warning: No news items returned.");
        }
    } catch (e) {
        console.error("Verification failed:", e.message);
    }
}

verify();
