document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const form = document.getElementById('identify-form');
    const emailInput = document.getElementById('email');
    const phoneNumberInput = document.getElementById('phoneNumber');
    
    const submitButton = document.getElementById('submit-button');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');

    const responsePlaceholder = document.getElementById('response-placeholder');
    const responseContent = document.getElementById('response-content');
    const rawResponseContainer = document.getElementById('raw-response-container');
    const responsePre = document.getElementById('response-pre');
    
    const errorContent = document.getElementById('error-content');

    // --- Form Submission Logic ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset UI states
        setLoading(true);
        responseContent.innerHTML = '';
        responseContent.classList.add('d-none');
        rawResponseContainer.classList.add('d-none');
        errorContent.classList.add('d-none');
        responsePlaceholder.classList.add('d-none');

        const email = emailInput.value || null;
        const phoneNumber = phoneNumberInput.value || null;

        if (!email && !phoneNumber) {
            showError('Please provide either an email or a phone number.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/identify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phoneNumber }),
            });

            const data = await res.json();

            responsePre.textContent = JSON.stringify(data, null, 2);
            rawResponseContainer.classList.remove('d-none');

            if (!res.ok || data.error) {
                const errorMsg = data.message || data.error || `HTTP Error: ${res.status}`;
                showError(errorMsg);
            } else {
                displayFormattedResponse(data.contact);
            }

        } catch (error) {
            console.error('Error identifying contact:', error);
            showError('An unexpected network error occurred. Please check the console.');
        } finally {
            setLoading(false);
        }
    });

    // --- UI Helper Functions ---
    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        if (isLoading) {
            submitText.textContent = 'Identifying...';
            submitSpinner.classList.remove('d-none');
        } else {
            submitText.textContent = 'Identify';
            submitSpinner.classList.add('d-none');
        }
    }

    function showError(message) {
        errorContent.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
        errorContent.classList.remove('d-none');
        responsePlaceholder.classList.remove('d-none');
    }

    function displayFormattedResponse(contact) {
        const { primaryContatctId, emails, phoneNumbers, secondaryContactIds } = contact;
        
        const createList = (items) => {
            if (!items || items.length === 0) return '<p class="text-secondary small">None</p>';
            return `
                <ul class="list-group list-group-flush">
                    ${items.map(item => `<li class="list-group-item bg-transparent border-secondary text-light">${item}</li>`).join('')}
                </ul>
            `;
        };

        const html = `
            <div class="mb-3">
                <h6 class="text-secondary text-uppercase small">Primary Contact ID</h6>
                <p class="fs-4 fw-bold" style="color: #64ffda;">${primaryContatctId}</p>
            </div>
            <div class="mb-3">
                <h6 class="text-secondary text-uppercase small">Emails</h6>
                ${createList(emails)}
            </div>
            <div class="mb-3">
                <h6 class="text-secondary text-uppercase small">Phone Numbers</h6>
                ${createList(phoneNumbers)}
            </div>
            <div>
                <h6 class="text-secondary text-uppercase small">Secondary IDs</h6>
                ${createList(secondaryContactIds)}
            </div>
        `;

        responseContent.innerHTML = html;
        responseContent.classList.remove('d-none');
    }
});
