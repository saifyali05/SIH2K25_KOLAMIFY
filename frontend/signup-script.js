// Signup form functionality
function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const newsletter = document.getElementById('newsletter').checked;
    const signupButton = document.querySelector('.signup-button');
    const buttonLoader = document.getElementById('buttonLoader');
    
    // Validation
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 8) {
        showToast('Password must be at least 8 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showToast('Please agree to the Terms & Conditions', 'error');
        return;
    }
    
    // Show loading state
    signupButton.style.pointerEvents = 'none';
    signupButton.querySelector('span').style.opacity = '0.7';
    buttonLoader.style.display = 'block';
    
    // Simulate signup process
    setTimeout(() => {
        signupButton.style.pointerEvents = 'auto';
        signupButton.querySelector('span').style.opacity = '1';
        buttonLoader.style.display = 'none';
        
        if (username.toLowerCase() === 'admin') {
            showToast('Username already exists. Please choose another.', 'error');
            const signupContainer = document.querySelector('.signup-container');
            signupContainer.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                signupContainer.style.animation = '';
            }, 500);
        } else {
            showToast('Account created successfully! Redirecting...', 'success');
            const userData = {
                firstName, lastName, username, email, newsletter,
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('newUser', JSON.stringify(userData));
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 2000);
        }
    }, 2500);
}

// Toggle password visibility
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = inputId === 'password' ? 
        document.getElementById('eyeIcon1') : 
        document.getElementById('eyeIcon2');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// Social signup functions
function signupWithGoogle() {
    showToast('Google signup integration coming soon!', 'info');
}

function signupWithFacebook() {
    showToast('Facebook signup integration coming soon!', 'info');
}

function signupWithGithub() {
    showToast('GitHub signup integration coming soon!', 'info');
}

function showTerms() {
    showToast('Terms & Conditions: By creating an account, you agree to our cultural heritage platform policies.', 'info');
}

function showPrivacy() {
    showToast('Privacy Policy page coming soon!', 'info');
}

function showSupport() {
    showToast('Support page coming soon!', 'info');
}

function showCustomerCare() {
    showToast('Customer Care: support@rangoligenerator.com', 'info');
}

// Toast notification system
function showToast(message, type = 'info') {
    try {
        const toast = document.getElementById('toast');
        if (!toast) {
            console.error('Toast element not found');
            return;
        }
        
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        toastIcon.className = `toast-icon ${icons[type]}`;
        toastIcon.style.color = colors[type];
        toastMessage.textContent = message;
        
        toast.style.display = 'flex';
        toast.style.borderColor = colors[type];
        
        setTimeout(() => {
            hideToast();
        }, 5000);
    } catch (error) {
        console.error('Error showing toast:', error);
        alert(message);
    }
}

function hideToast() {
    try {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.animation = '';
        }, 300);
    } catch (error) {
        console.error('Error hiding toast:', error);
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize monuments with proper error handling
function initializeMonuments() {
    try {
        const monuments = document.querySelectorAll('.monument-image');
        
        if (monuments.length === 0) {
            console.log('No monuments found - decorative elements not available');
            return;
        }
        
        monuments.forEach((monument, index) => {
            monument.style.animationDelay = `${index * 0.3}s`;
            monument.style.opacity = '1';
            monument.style.visibility = 'visible';
        });
        
        console.log('Monument decorations initialized successfully');
    } catch (error) {
        console.error('Error initializing monuments:', error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add input animations and validation
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Real-time validation
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const emailInput = document.getElementById('email');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            if (password.length > 0 && password.length < 8) {
                this.style.borderColor = '#ef4444';
            } else if (password.length >= 8) {
                this.style.borderColor = '#10b981';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            
            if (confirmPassword.length > 0) {
                if (password === confirmPassword) {
                    this.style.borderColor = '#10b981';
                } else {
                    this.style.borderColor = '#ef4444';
                }
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            if (email.length > 0) {
                if (validateEmail(email)) {
                    this.style.borderColor = '#10b981';
                } else {
                    this.style.borderColor = '#ef4444';
                }
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            const form = document.querySelector('.signup-form');
            const activeElement = document.activeElement;
            
            if (activeElement && activeElement.tagName === 'INPUT' && form) {
                e.preventDefault();
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(submitEvent);
            }
        }
    });
    
    // Welcome animations
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        showToast('Welcome to Rangoli Generator! Create your cultural account 🎨', 'info');
    }, 1000);
    
    initializeMonuments();
});

// Add loading animation styles
const style = document.createElement('style');
style.textContent = `
    body {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);