// Login form functionality
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginButton = document.querySelector('.login-button');
    const buttonLoader = document.getElementById('buttonLoader');
    
    // Validation
    if (!username || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading state
    loginButton.style.pointerEvents = 'none';
    loginButton.querySelector('span').style.opacity = '0.7';
    buttonLoader.style.display = 'block';
    
    // Simulate login process
    setTimeout(() => {
        // Hide loading state
        loginButton.style.pointerEvents = 'auto';
        loginButton.querySelector('span').style.opacity = '1';
        buttonLoader.style.display = 'none';
        
        // Demo credentials check
        if (username === 'admin' && password === 'admin') {
            showToast('Login successful! Redirecting...', 'success');
            
            // Store user session if remember me is checked
            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            }
            
            // Redirect to main application
            setTimeout(() => {
                window.location.href = 'main.html'; // Redirect to main page
            }, 1500);
        } else {
            showToast('Invalid username or password', 'error');
            
            // Add shake animation to form
            const loginContainer = document.querySelector('.login-container');
            loginContainer.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                loginContainer.style.animation = '';
            }, 500);
        }
    }, 2000);
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
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

// Social login functions
function loginWithGoogle() {
    showToast('Google login integration coming soon!', 'info');
    // Here you would integrate with Google OAuth
    // window.location.href = 'your-google-oauth-url';
}

function loginWithFacebook() {
    showToast('Facebook login integration coming soon!', 'info');
    // Here you would integrate with Facebook Login
    // FB.login(function(response) { ... });
}

function loginWithGithub() {
    showToast('GitHub login integration coming soon!', 'info');
    // Here you would integrate with GitHub OAuth
    // window.location.href = 'your-github-oauth-url';
}

// Navigation functions
function goToSignup() {
    window.location.href = 'signup.html';
}

function showForgotPassword() {
    const email = prompt('Please enter your email address for password reset:');
    if (email) {
        if (validateEmail(email)) {
            showToast('Password reset link sent to your email!', 'success');
        } else {
            showToast('Please enter a valid email address', 'error');
        }
    }
}

function showTerms() {
    showToast('Terms & Conditions page coming soon!', 'info');
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
        
        if (!toastIcon || !toastMessage) {
            console.error('Toast components not found');
            return;
        }
        
        // Set icon based on type
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
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            hideToast();
        }, 4000);
    } catch (error) {
        console.error('Error showing toast:', error);
        // Fallback to browser alert if toast system fails
        alert(message);
    }
}

function hideToast() {
    try {
        const toast = document.getElementById('toast');
        if (!toast) {
            return;
        }
        
        toast.style.animation = 'slideOut 0.3s ease-in';
        
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.animation = '';
        }, 300);
    } catch (error) {
        console.error('Error hiding toast:', error);
    }
}

// Utility functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check for remembered user
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
    
    // Add input animations
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Enter to submit form
        if (e.key === 'Enter' && !e.shiftKey) {
            const form = document.querySelector('.login-form');
            const activeElement = document.activeElement;
            
            if (activeElement && activeElement.tagName === 'INPUT' && form) {
                e.preventDefault();
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(submitEvent);
            }
        }
        
        // Escape to clear form
        if (e.key === 'Escape') {
            clearForm();
        }
    });
    
    // Add welcome animation
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
    
    // Show welcome message
    setTimeout(() => {
        showToast('Welcome to Rangoli Generator! 🎨', 'info');
    }, 1000);
    
    // Initialize decorative monuments (no interactions)
    initializeMonuments();
});

// Indian Monuments - Decorative Background Elements
function initializeMonuments() {
    try {
        const monuments = document.querySelectorAll('.monument-image');
        
        if (monuments.length === 0) {
            console.log('No monuments found - decorative elements not available');
            return;
        }
        
        // Add staggered entrance animations
        monuments.forEach((monument, index) => {
            // Set entrance animation delay
            monument.style.animationDelay = `${index * 0.3}s`;
            // Ensure monument is visible
            monument.style.opacity = '1';
            monument.style.visibility = 'visible';
        });
        
        console.log('Monument decorations initialized successfully');
    } catch (error) {
        console.error('Error initializing monuments:', error);
        // Fail silently - monuments are decorative and shouldn't break login functionality
    }
}

function clearForm() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('rememberMe').checked = false;
    showToast('Form cleared', 'info');
}

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
    
    .login-container {
        transition: all 0.3s ease;
    }
    
    .input-group {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);

// Demo user info helper
function showDemoInfo() {
    showToast('Demo: Use username "admin" and password "admin"', 'info');
}

// Auto-show demo info after 3 seconds
setTimeout(() => {
    showDemoInfo();
}, 3000);