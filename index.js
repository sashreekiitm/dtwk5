document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const modalOverlay = document.getElementById('modalOverlay');
  const otpModal = document.getElementById('otpModal');
  const captchaModal = document.getElementById('captchaModal');
  
  const otpInputs = document.querySelectorAll('.otp-input');
  const requestNewCodeBtn = document.getElementById('requestNewCodeBtn');
  const verifyOtpBtn = document.getElementById('verifyOtpBtn');
  const closeOtpModalBtn = document.getElementById('closeOtpModalBtn');
  
  const captchaText = document.getElementById('captchaText');
  const captchaInput = document.getElementById('captchaInput');
  const captchaError = document.getElementById('captchaError');
  const refreshCaptchaBtn = document.getElementById('refreshCaptchaBtn');
  const cancelCaptchaBtn = document.getElementById('cancelCaptchaBtn');
  const submitCaptchaBtn = document.getElementById('submitCaptchaBtn');
  
  const toastContainer = document.getElementById('toastContainer');
  const progressBar = document.getElementById('progressBar');

  // Captcha Code List for demo variety
  const captchaCodes = ['P R O T', 'N I M 2', 'N V I D', 'G P U 9'];
  let currentCaptchaIndex = 0;

  // Initialize and Show OTP Modal immediately on page load
  setTimeout(() => {
    modalOverlay.classList.add('active');
    otpModal.classList.add('active');
    // Focus on the first OTP input
    if (otpInputs[0]) otpInputs[0].focus();
  }, 300);

  // ==========================================
  // OTP Inputs Keyboard Navigation & Validation
  // ==========================================
  otpInputs.forEach((input, index) => {
    // Handling character input
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      // Allow only numbers
      if (!/^[0-9]$/.test(value)) {
        e.target.value = '';
        checkOtpCompletion();
        return;
      }

      // Auto focus next input
      if (value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
      checkOtpCompletion();
    });

    // Handling keydown events for backspace navigation
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        if (!input.value && index > 0) {
          otpInputs[index - 1].value = '';
          otpInputs[index - 1].focus();
        } else {
          input.value = '';
        }
        checkOtpCompletion();
        e.preventDefault();
      }
    });

    // Select input content on focus for better usability
    input.addEventListener('focus', () => {
      input.select();
    });
  });

  // Verify OTP button state controller
  function checkOtpCompletion() {
    const isCompleted = Array.from(otpInputs).every(input => /^[0-9]$/.test(input.value));
    if (isCompleted) {
      verifyOtpBtn.classList.remove('disabled');
      verifyOtpBtn.removeAttribute('disabled');
    } else {
      verifyOtpBtn.classList.add('disabled');
      verifyOtpBtn.setAttribute('disabled', 'true');
    }
  }

  // ==========================================
  // OTP Verification Action (Mock)
  // ==========================================
  verifyOtpBtn.addEventListener('click', () => {
    if (verifyOtpBtn.classList.contains('disabled')) return;
    
    const otpValue = Array.from(otpInputs).map(input => input.value).join('');
    showToast('Verification Successful', 'You have successfully verified your identity.', 'success');
    
    // Close modal after success
    setTimeout(closeAllModals, 1500);
  });

  // ==========================================
  // Captcha Display & Cycle Logic
  // ==========================================
  function updateCaptchaText() {
    captchaText.textContent = captchaCodes[currentCaptchaIndex];
    captchaInput.value = '';
    captchaError.classList.remove('active');
  }

  refreshCaptchaBtn.addEventListener('click', () => {
    currentCaptchaIndex = (currentCaptchaIndex + 1) % captchaCodes.length;
    updateCaptchaText();
    captchaInput.focus();
  });

  // ==========================================
  // Modal State Triggers
  // ==========================================
  
  // Show Captcha Modal
  requestNewCodeBtn.addEventListener('click', () => {
    // Center-align visual focus
    captchaModal.classList.add('active');
    captchaInput.value = '';
    captchaError.classList.remove('active');
    setTimeout(() => captchaInput.focus(), 150);
  });

  // Cancel Captcha
  cancelCaptchaBtn.addEventListener('click', () => {
    captchaModal.classList.remove('active');
  });

  // Verify and Submit Captcha
  submitCaptchaBtn.addEventListener('click', handleCaptchaVerification);
  
  // Support hitting 'Enter' in captcha input
  captchaInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleCaptchaVerification();
    }
  });

  function handleCaptchaVerification() {
    const expected = captchaCodes[currentCaptchaIndex].replace(/\s+/g, '').toLowerCase();
    const actual = captchaInput.value.trim().toLowerCase();

    if (actual === expected) {
      // Captcha Successful
      captchaModal.classList.remove('active');
      
      // Trigger Success Toast matching user's copy
      showToast('Code Sent', 'New code sent, It may take a minute to recieve the new code', 'success');

      // Visual feedback: animate progress bar reset to mock timing
      progressBar.style.transition = 'none';
      progressBar.style.transform = 'scaleX(0)';
      setTimeout(() => {
        progressBar.style.transition = 'transform 90s linear';
        progressBar.style.transform = 'scaleX(1)';
      }, 50);
      
    } else {
      // Captcha Failed
      captchaError.classList.add('active');
      captchaInput.select();
    }
  }

  // Close main OTP modal
  closeOtpModalBtn.addEventListener('click', closeAllModals);
  
  function closeAllModals() {
    otpModal.classList.remove('active');
    captchaModal.classList.remove('active');
    modalOverlay.classList.remove('active');
  }

  // ==========================================
  // Toast Notifications UI Helper
  // ==========================================
  function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';

    // SVG icon selection
    const icon = type === 'success' 
      ? `<svg class="toast-icon" viewBox="0 0 24 24" width="20" height="20">
           <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
         </svg>`
      : `<svg class="toast-icon" viewBox="0 0 24 24" width="20" height="20" style="color: var(--error-color);">
           <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
         </svg>`;

    toast.innerHTML = `
      ${icon}
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Remove toast after animation finishes (5s total duration defined in css)
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
});
