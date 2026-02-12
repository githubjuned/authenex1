// Native fetch in Node 18+
// const fetch = require('node-fetch');

async function testChat() {
    console.log("Testing Chatbot API...");
    try {
        const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: "user", content: "Hello, are you there?" }]
            })
        });

        if (!response.ok) {
            console.error(`Status: ${response.status}`);
            const text = await response.text();
            console.error(`Error Body: ${text}`);
            return;
        }

        const data = await response.json();
        console.log("Success! Response:");
        console.log(JSON.stringify(data, null, 2));

        if (data.choices && data.choices[0] && data.choices[0].message) {
            console.log("Message Content:", data.choices[0].message.content);
        } else {
            console.log("Unexpected response structure.");
        }

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

testChat();
