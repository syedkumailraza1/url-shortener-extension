document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const shortenBtn = document.getElementById('shortenBtn');
    const shortUrlDiv = document.getElementById('shortUrl');
    const loader = document.getElementById('loader');
    
    // Check if elements exist
    if (!shortenBtn || !shortUrlDiv || !loader) {
        console.error('Required DOM elements not found');
        return;
    }
    
    const baseURI = 'https://url-shortner-blond-pi.vercel.app';
    
    const updateElementDisplay = (element, displayValue) => {
        if (element && element.style) {
            element.style.display = displayValue;
        }
    };
    
    shortenBtn.addEventListener('click', async () => {
        try {
            // Reset UI state
            updateElementDisplay(loader, 'block');
            shortenBtn.disabled = true;
            updateElementDisplay(shortUrlDiv, 'none');
            
            // Get current tab URL
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab || !tab.url) {
                throw new Error('No active tab URL found');
            }
            
            const longUrl = tab.url;
            console.log('Sending URL to server:', longUrl); // Debug log
            
            // Create the request payload
            
            
            
            // Make the API request
            
             payload = { url: longUrl }; // Use "url" as the key
             console.log('Request payload:', payload); // Debug log

const response = await fetch(baseURI, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
});
            
            console.log('Response status:', response.status); // Debug log
            
            // Get the response body as text first to see what we're getting
            const responseText = await response.text();
            console.log('Raw response:', responseText); // Debug log
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} - ${responseText}`);
            }
            
            // Try to parse the response as JSON
            let data;
            try {
                data = JSON.parse(responseText);
                console.log('Parsed response data:', data); // Debug log
            } catch (e) {
                throw new Error('Invalid JSON response from server');
            }
            
            if (!data || !data.id) {
                throw new Error('Invalid API response: missing ID');
            }
            
            // Construct the full shortened URL
            const shortUrl = `${baseURI}/${data.id}`;
            console.log('Generated short URL:', shortUrl); // Debug log
            
            // Update UI with shortened URL
            shortUrlDiv.textContent = shortUrl;
            updateElementDisplay(shortUrlDiv, 'block');
            
            // Setup click-to-copy functionality
            const newShortUrlDiv = shortUrlDiv.cloneNode(true);
            shortUrlDiv.parentNode.replaceChild(newShortUrlDiv, shortUrlDiv);
            
            newShortUrlDiv.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(shortUrl);
                    const originalText = newShortUrlDiv.textContent;
                    newShortUrlDiv.textContent = 'Copied!';
                    setTimeout(() => {
                        newShortUrlDiv.textContent = originalText;
                    }, 1000);
                } catch (err) {
                    console.error('Copy error:', err);
                    newShortUrlDiv.textContent = 'Failed to copy';
                }
            });
            
        } catch (error) {
            console.error('Error details:', error); // More detailed error logging
            shortUrlDiv.textContent = `Error: ${error.message}`;
            updateElementDisplay(shortUrlDiv, 'block');
        } finally {
            updateElementDisplay(loader, 'none');
            shortenBtn.disabled = false;
        }
    });
});