document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('form[data-validate="true"]');

    forms.forEach(function (form) {
        form.setAttribute('novalidate', 'novalidate');

        const fields = form.querySelectorAll('input, select, textarea');

        fields.forEach(function (field) {
            ensureErrorElement(field);
            field.setAttribute('aria-invalid', 'false');

            field.addEventListener('blur', function () {
                validateField(field);
            });

            field.addEventListener('input', function () {
                if (field.getAttribute('aria-invalid') === 'true') {
                    validateField(field);
                }
            });

            field.addEventListener('change', function () {
                validateField(field);
            });
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            let formIsValid = true;
            const fieldsToValidate = form.querySelectorAll('input, select, textarea');

            fieldsToValidate.forEach(function (field) {
                if (!validateField(field)) {
                    formIsValid = false;
                }
            });

            if (!formIsValid) {
                const firstInvalid = form.querySelector('[aria-invalid="true"]');
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            showSuccessPopup(form);
        });
    });

    const countrySelect = document.getElementById('country');
    const otherWrapper = document.getElementById('country-other-wrapper');
    const otherInput = document.getElementById('country-other');

    if (countrySelect && otherWrapper && otherInput) {
        function updateCountryOther() {
            if (countrySelect.value === 'other') {
                otherWrapper.style.display = 'block';
                otherInput.setAttribute('data-required', 'true');
                otherInput.setAttribute('data-required-message', 'Please specify your country.');
                otherInput.setAttribute('data-type', 'text');
            } else {
                otherWrapper.style.display = 'none';
                otherInput.removeAttribute('data-required');
                otherInput.removeAttribute('data-required-message');
                otherInput.value = '';
                otherInput.setAttribute('aria-invalid', 'false');
                otherInput.setCustomValidity('');
                const errorEl = otherInput.parentNode.querySelector('.field-error');
                if (errorEl) {
                    errorEl.textContent = '';
                    errorEl.style.display = 'none';
                }
            }
        }

        countrySelect.addEventListener('change', updateCountryOther);
        updateCountryOther();
    }
});

function ensureErrorElement(field) {
    if (!field || !field.parentNode) {
        return null;
    }

    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('small');
        errorElement.className = 'field-error';
        errorElement.setAttribute('aria-live', 'polite');
        errorElement.style.display = 'none';
        errorElement.style.color = '#c62828';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '6px';
        errorElement.style.display = 'block';
        field.parentNode.appendChild(errorElement);
    }

    return errorElement;
}

function showSuccessPopup(form) {
    const existingBanner = form.querySelector('.form-success');
    const banner = existingBanner || document.createElement('div');

    banner.className = 'form-success';
    banner.textContent = 'Form submitted successfully!';
    banner.style.display = 'block';
    banner.style.marginBottom = '16px';
    banner.style.padding = '12px 14px';
    banner.style.backgroundColor = '#e8f5e9';
    banner.style.color = '#1b5e20';
    banner.style.border = '1px solid #81c784';
    banner.style.borderRadius = '6px';
    banner.style.fontWeight = '600';

    if (!existingBanner) {
        form.insertBefore(banner, form.firstChild);
    }

    window.alert('Form submitted successfully!');
}

function validateField(field) {
    if (!field) {
        return true;
    }

    const parent = field.parentNode;
    const errorElement = ensureErrorElement(field);
    const required = field.getAttribute('data-required') === 'true' || field.hasAttribute('required');
    const type = field.getAttribute('data-type') || field.type || 'text';
    let value = field.value.trim();

    if (field.tagName === 'SELECT' && field.value === '') {
        value = '';
    }

    if (type === 'checkbox') {
        value = field.checked ? 'checked' : '';
    }

    let isValid = true;
    let message = '';

    if (required && !value) {
        message = field.getAttribute('data-required-message') || 'This field is required.';
        isValid = false;
    } else if (value) {
        const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[.' -][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
        const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
        const phonePattern = /^(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)\d{3}[-.\s]?\d{4,5}$/;
        const countryPattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s.,'-]{2,60}$/;
        const detailPattern = /\S{10,}/;

        if (field.id === 'country-other' || field.name === 'country-other') {
            if (!countryPattern.test(value)) {
                message = 'Please enter a valid country name.';
                isValid = false;
            }
        }

        if (field.id === 'fullname' || field.name === 'fullname' || field.id === 'fname' || field.name === 'fname' || field.id === 'lname' || field.name === 'lname' || field.id === 'checkout-name' || field.name === 'checkout-name') {
            if (!namePattern.test(value) || value.length < 2) {
                message = 'Please enter a valid name using letters and spaces only.';
                isValid = false;
            }
        }

        if (type === 'email' || field.id === 'email' || field.name === 'email') {
            if (!emailPattern.test(value)) {
                message = 'Please enter a valid email address in the format name@example.com.';
                isValid = false;
            }
        }

        if (field.id === 'phone' || field.name === 'phone' || field.id === 'checkout-phone' || field.name === 'checkout-phone') {
            if (!phonePattern.test(value)) {
                message = 'Please enter a valid phone number.';
                isValid = false;
            }
        }

        if (field.id === 'country' || field.name === 'country') {
            if (value === 'other') {
                const otherField = document.getElementById('country-other');
                if (otherField && !otherField.value.trim()) {
                    message = 'Please specify your country.';
                    isValid = false;
                }
            }
        }

        if (field.id === 'details' || field.name === 'details' || field.id === 'message' || field.name === 'message') {
            if (!detailPattern.test(value)) {
                message = 'Please add at least 10 characters of detail.';
                isValid = false;
            }
        }

        if (type === 'number' || field.name === 'quantity' || field.id === 'checkout-qty') {
            const min = Number(field.getAttribute('min')) || 1;
            const numericValue = Number(value);
            if (Number.isNaN(numericValue) || numericValue < min) {
                message = 'Please enter a valid quantity of at least ' + min + '.';
                isValid = false;
            }
        }
    }

    if (isValid) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        field.setCustomValidity('');
        field.setAttribute('aria-invalid', 'false');
        return true;
    }

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    field.setCustomValidity(message);
    field.setAttribute('aria-invalid', 'true');

    return false;
}
