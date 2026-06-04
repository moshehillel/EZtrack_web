// Contact Form JavaScript for EZ Track
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Form validation and submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset previous states
        hideMessages();
        clearValidation();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const newsletter = document.getElementById('newsletter').checked;
        
        // Validate form
        if (!validateForm(name, email, message)) {
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        try {
            // Send data to the specified endpoint
            const response = await fetch('https://chatgpt-7837.twil.io/send_EZ_track_contact_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    newsletter: newsletter
                })
            });
            
            if (response.ok) {
                // Success
                showSuccess();
                form.reset();
            } else {
                // Error from server
                throw new Error('Server response was not ok');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showError();
        } finally {
            setLoadingState(false);
        }
    });

    function validateForm(name, email, message) {
        let isValid = true;
        
        // Name validation
        if (!name || name.length === 0) {
            showFieldError('name', 'Please provide your name.');
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showFieldError('email', 'Please provide a valid email address.');
            isValid = false;
        }
        
        // Message validation
        if (!message || message.length < 20) {
            showFieldError('message', 'Message must be at least 20 characters long.');
            isValid = false;
        }
        
        return isValid;
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const feedback = field.nextElementSibling;
        
        field.classList.add('is-invalid');
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
        }
    }

    function clearValidation() {
        const fields = form.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.classList.remove('is-invalid');
        });
    }

    function setLoadingState(loading) {
        if (loading) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="loading"></span> Sending...';
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="bi bi-send me-2"></i>Send Message';
        }
    }

    function showSuccess() {
        successMessage.classList.remove('d-none');
        setTimeout(() => {
            successMessage.classList.add('d-none');
        }, 5000);
    }

    function showError() {
        errorMessage.classList.remove('d-none');
        setTimeout(() => {
            errorMessage.classList.add('d-none');
        }, 5000);
    }

    function hideMessages() {
        successMessage.classList.add('d-none');
        errorMessage.classList.add('d-none');
    }

    // Real-time validation
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');

    nameField.addEventListener('blur', function() {
        if (this.value.trim().length === 0) {
            showFieldError('name', 'Please provide your name.');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    emailField.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value.trim())) {
            showFieldError('email', 'Please provide a valid email address.');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    messageField.addEventListener('blur', function() {
        if (this.value.trim().length < 20) {
            showFieldError('message', 'Message must be at least 20 characters long.');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    // Character counter for message field
    const messageCounter = document.createElement('small');
    messageCounter.className = 'text-muted';
    messageField.parentNode.appendChild(messageCounter);

    messageField.addEventListener('input', function() {
        const charCount = this.value.length;
        messageCounter.textContent = `${charCount} characters (minimum 20)`;
        
        if (charCount >= 20) {
            messageCounter.classList.remove('text-danger');
            messageCounter.classList.add('text-success');
        } else {
            messageCounter.classList.remove('text-success');
            messageCounter.classList.add('text-danger');
        }
    });

    // Initialize character counter
    messageField.dispatchEvent(new Event('input'));
});
