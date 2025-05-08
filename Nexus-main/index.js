// Dropdown menülerin çalışması için JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Tüm dropdown butonlarını seç
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');

    // Her butona click event listener ekle
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Tıklanan butonun data-menu attribute'unu al
            const menuId = this.getAttribute('data-menu');
            const dropdownContent = document.getElementById(menuId);

            // Diğer tüm açık menüleri kapat
            dropdownBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    const otherId = otherBtn.getAttribute('data-menu');
                    const otherContent = document.getElementById(otherId);
                    otherContent.classList.remove('show');
                    otherBtn.classList.remove('active');
                }
            });

            // Tıklanan menüyü aç/kapat
            this.classList.toggle('active');

            // Animasyon için height değişimini ayarla
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.style.maxHeight = null;
                setTimeout(() => {
                    dropdownContent.classList.remove('show');
                }, 200); // animasyon süresi ile eşleşmeli
            } else {
                dropdownContent.classList.add('show');
                dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
            }
        });
    });

    // Sayfa herhangi bir yerine tıklandığında menüleri kapat
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.dropdown')) {
            dropdownBtns.forEach(btn => {
                const menuId = btn.getAttribute('data-menu');
                const dropdownContent = document.getElementById(menuId);
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.style.maxHeight = null;
                    setTimeout(() => {
                        dropdownContent.classList.remove('show');
                    }, 200); // animasyon süresi ile eşleşmeli
                }
                btn.classList.remove('active');
            });
        }
    });

    // İç içe dropdown menüler için
    const nestedDropdownBtns = document.querySelectorAll('.nested-dropdown-btn');

    nestedDropdownBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); // Ana dropdown'ın kapanmasını engelle
            const menuId = this.getAttribute('data-menu');
            const dropdownContent = document.getElementById(menuId);

            // Diğer açık olan iç içe menüleri kapat
            nestedDropdownBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    const otherId = otherBtn.getAttribute('data-menu');
                    const otherContent = document.getElementById(otherId);
                    otherContent.classList.remove('show');
                    otherBtn.classList.remove('active');
                }
            });

            // Tıklanan menüyü aç/kapat
            this.classList.toggle('active');
            dropdownContent.classList.toggle('show');
        });
    });

    // Arama çubuğu fonksiyonalitesi
    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        // Tüm içeriği seç (menüler, ana içerik, vs.)
        const searchableElements = document.querySelectorAll('.dropdown-item, .content *');

        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                element.style.backgroundColor = searchTerm ? '#fff3cd' : ''; // Eşleşen içeriği vurgula
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                element.style.backgroundColor = '';
            }
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Sayfa yüklendiğinde dark mode durumunu kontrol et
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        body.classList.add('dark-mode');
    }

    // Dark mode toggle fonksiyonu
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Dark mode durumunu localStorage'a kaydet
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', null);
        }
    });

    // Diğer sayfalarda dark mode kontrolü
    document.addEventListener('DOMContentLoaded', function () {
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
    });

    // Şifremi Unuttum Sayfası için JavaScript Kodları
    if (document.querySelector('.forgot-password-page')) {
        // Captcha oluşturma
        function generateCaptcha() {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            let captcha = '';
            for (let i = 0; i < 6; i++) {
                captcha += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            document.getElementById('captcha').textContent = captcha;
            return captcha;
        }

        let currentCaptcha = generateCaptcha();

        // Adımlar arası geçiş
        window.nextStep = function (step) {
            const email = document.getElementById('email').value;
            if (step === 2 && !email) {
                alert('Lütfen e-posta adresinizi girin');
                return;
            }

            // Önceki adımları gizle
            document.querySelectorAll('.verification-steps').forEach(el => {
                el.style.display = 'none';
                el.classList.remove('active');
            });

            // Seçilen adımı göster
            const currentStep = document.getElementById(`step${step}`);
            currentStep.style.display = 'block';
            currentStep.classList.add('active');

            // Adım göstergelerini güncelle
            document.querySelectorAll('.step').forEach(el => {
                const stepNumber = parseInt(el.dataset.step);
                if (stepNumber < step) {
                    el.classList.add('completed');
                    el.classList.remove('active');
                } else if (stepNumber === step) {
                    el.classList.add('active');
                    el.classList.remove('completed');
                } else {
                    el.classList.remove('active', 'completed');
                }
            });
        }

        // Captcha doğrulama
        window.verifyCaptcha = function () {
            const userInput = document.getElementById('captchaInput').value;
            if (userInput === currentCaptcha) {
                nextStep(3);
            } else {
                alert('Güvenlik kodu hatalı. Lütfen tekrar deneyin.');
                currentCaptcha = generateCaptcha();
                document.getElementById('captchaInput').value = '';
            }
        }

        // SMS kodu doğrulama
        window.verifyCode = function () {
            const inputs = document.querySelectorAll('.verification-code input');
            let code = '';
            inputs.forEach(input => {
                code += input.value;
            });

            if (code.length === 6) {
                // Başarılı mesajını göster
                document.getElementById('successMessage').style.display = 'block';
                // 3 saniye sonra giriş sayfasına yönlendir
                setTimeout(() => {
                    window.location.href = 'giris.html';
                }, 3000);
            } else {
                alert('Lütfen 6 haneli kodu eksiksiz girin.');
            }
        }

        // SMS kodu input olayları
        const codeInputs = document.querySelectorAll('.verification-code input');
        codeInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1) {
                    if (index < codeInputs.length - 1) {
                        codeInputs[index + 1].focus();
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });
        });
    }
});

// Güvenlik Sayfası JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Parola görünürlüğünü değiştirme
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });

    // Parola gücü kontrolü
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function () {
            const password = this.value;
            const strengthBar = document.querySelector('.strength-progress');
            const strengthText = document.querySelector('.strength-text');

            // Parola gücü kriterleri
            const hasLower = /[a-z]/.test(password);
            const hasUpper = /[A-Z]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const isLongEnough = password.length >= 8;

            let strength = 0;
            if (hasLower) strength += 20;
            if (hasUpper) strength += 20;
            if (hasNumber) strength += 20;
            if (hasSpecial) strength += 20;
            if (isLongEnough) strength += 20;

            strengthBar.style.width = strength + '%';

            if (strength <= 40) {
                strengthBar.style.background = '#ff4444';
                strengthText.textContent = 'Parola gücü: Zayıf';
            } else if (strength <= 80) {
                strengthBar.style.background = '#ffa700';
                strengthText.textContent = 'Parola gücü: Orta';
            } else {
                strengthBar.style.background = '#00c851';
                strengthText.textContent = 'Parola gücü: Güçlü';
            }
        });
    }

    // Parola değiştirme formu görünürlüğü
    window.togglePasswordChange = function () {
        const form = document.getElementById('passwordChangeForm');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    // Parola değiştirme işlemi
    window.changePassword = function () {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Yeni parolalar eşleşmiyor.');
            return;
        }

        // Burada parola değiştirme API çağrısı yapılacak
        alert('Parola başarıyla değiştirildi!');
        togglePasswordChange();
    }

    // İki adımlı doğrulama toggle
    window.toggle2FA = function () {
        const twoFactorSetup = document.getElementById('twoFactorSetup');
        const twoFactorToggle = document.getElementById('twoFactorToggle');

        if (twoFactorToggle.checked) {
            twoFactorSetup.style.display = 'block';
            // Animasyonlu gösterim
            setTimeout(() => {
                twoFactorSetup.style.opacity = '1';
            }, 10);
        } else {
            twoFactorSetup.style.opacity = '0';
            setTimeout(() => {
                twoFactorSetup.style.display = 'none';
            }, 300);
        }
    }

    // Oturum yenileme
    window.refreshSessions = function () {
        const refreshBtn = document.querySelector('.refresh-btn');
        const refreshIcon = refreshBtn.querySelector('.refresh-icon');

        // Yenileme animasyonu
        refreshIcon.style.animation = 'spin 1s linear infinite';

        // API çağrısı simülasyonu
        setTimeout(() => {
            refreshIcon.style.animation = '';
            alert('Oturumlar güncellendi!');
        }, 1000);
    }

    // Oturum kapatma
    const endSessionBtns = document.querySelectorAll('.end-session-btn');
    endSessionBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const session = this.closest('.session');
            const isActive = session.classList.contains('active');

            if (isActive) {
                if (confirm('Aktif oturumu kapatmak istediğinizden emin misiniz? Bu işlem sizi sistemden çıkaracaktır.')) {
                    window.location.href = 'giris.html';
                }
            } else {
                session.remove();
                alert('Oturum başarıyla kapatıldı!');
            }
        });
    });
});

// Yenileme animasyonu için CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Gizlilik sayfası anahtarları kontrolü
document.addEventListener('DOMContentLoaded', function () {
    const switches = document.querySelectorAll('.privacy-card input[type="checkbox"]');

    switches.forEach(switchInput => {
        // Sayfa yüklendiğinde mevcut durumu kontrol et
        updateSwitchStatus(switchInput);

        // Anahtar değiştiğinde durumu güncelle
        switchInput.addEventListener('change', function () {
            updateSwitchStatus(this);
        });
    });
});

function updateSwitchStatus(switchInput) {
    const statusElement = switchInput.closest('.privacy-options').querySelector('.privacy-status');
    if (switchInput.checked) {
        statusElement.textContent = 'Açık';
    } else {
        statusElement.textContent = 'Kapalı';
    }
}

// Doğrulama Kodu Input Kontrolü
document.addEventListener('DOMContentLoaded', function () {
    const verificationInput = document.querySelector('.verification-input input');
    if (verificationInput) {
        verificationInput.addEventListener('input', function (e) {
            // Sadece rakam girişine izin ver
            this.value = this.value.replace(/[^0-9]/g, '');

            // 6 haneli kod girildiğinde otomatik doğrulama
            if (this.value.length === 6) {
                document.querySelector('.verify-btn').focus();
            }
        });
    }
});

// Dark mode functionality
document.addEventListener('DOMContentLoaded', function () {
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark-mode');
    }

    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');

            // Save preference to localStorage
            if (document.documentElement.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
});

// Carousel functionality
let slideIndex = 1;
let slideInterval;
const slideDuration = 6000; // 6 seconds per slide
let progressBar;

function initCarousel() {
    progressBar = document.querySelector('.progress-bar');
    showSlides(slideIndex);
    startAutoSlide();
}

function showSlides(n) {
    let slides = document.getElementsByClassName("carousel-slide");

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    // Remove active class from all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove('active');
    }

    // Show and activate current slide
    slides[slideIndex - 1].style.display = "block";
    setTimeout(() => {
        slides[slideIndex - 1].classList.add('active');
    }, 100);

    // Reset and start progress bar
    if (progressBar) {
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 50);
    }
}

function changeSlide(n) {
    clearInterval(slideInterval);
    showSlides(slideIndex += n);
    startAutoSlide();
}

function startAutoSlide() {
    // Clear any existing interval
    if (slideInterval) {
        clearInterval(slideInterval);
    }

    // Start new interval
    slideInterval = setInterval(() => {
        slideIndex++;
        showSlides(slideIndex);
    }, slideDuration);
}

// Initialize carousel when page loads
document.addEventListener('DOMContentLoaded', initCarousel);

// Pause auto-slide on hover
document.querySelector('.carousel-container')?.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

// Resume auto-slide when mouse leaves
document.querySelector('.carousel-container')?.addEventListener('mouseleave', startAutoSlide);

// Gönderi oluşturma ve medya yükleme işlevleri
let selectedMedia = null;

document.getElementById('imageInput').addEventListener('change', function(e) {
    handleMediaSelect(e, 'image');
});

document.getElementById('videoInput').addEventListener('change', function(e) {
    handleMediaSelect(e, 'video');
});

function handleMediaSelect(event, type) {
    const file = event.target.files[0];
    if (!file) return;

    const preview = document.getElementById('mediaPreview');
    preview.innerHTML = '';
    preview.classList.add('active');

    if (type === 'image') {
        if (!file.type.startsWith('image/')) {
            alert('Lütfen geçerli bir resim dosyası seçin.');
            return;
        }
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        preview.appendChild(img);
    } else if (type === 'video') {
        if (!file.type.startsWith('video/')) {
            alert('Lütfen geçerli bir video dosyası seçin.');
            return;
        }
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.controls = true;
        preview.appendChild(video);
    }

    selectedMedia = file;
}

function createPost() {
    const content = document.getElementById('postContent').value.trim();
    if (!content && !selectedMedia) {
        alert('Lütfen bir mesaj yazın veya medya ekleyin.');
        return;
    }

    const postsContainer = document.getElementById('postsContainer');
    const newPost = document.createElement('div');
    newPost.className = 'post';

    const currentTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString('tr-TR');

    // Profil fotoğrafını ve kullanıcı bilgilerini localStorage'dan al
    const userPhoto = localStorage.getItem('userPhoto') || 'user.png';
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    const userHandle = localStorage.getItem('userHandle') || '@kullanici';

    // Ad ve soyadı birleştir, eğer yoksa varsayılan değeri kullan
    const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : 'Kullanıcı Adı';

    let mediaHTML = '';
    if (selectedMedia) {
        if (selectedMedia.type.startsWith('image/')) {
            mediaHTML = `<img src="${URL.createObjectURL(selectedMedia)}" class="post-image" alt="Gönderi görseli">`;
        } else if (selectedMedia.type.startsWith('video/')) {
            mediaHTML = `<video src="${URL.createObjectURL(selectedMedia)}" class="post-image" controls></video>`;
        }
    }

    newPost.innerHTML = `
        <div class="post-header">
            <img src="${userPhoto}" alt="Profil" class="profile-pic">
            <div class="post-info">
                <span class="post-user">${fullName}</span>
                <span class="post-username">${userHandle}</span>
            </div>
        </div>
        <div class="post-content">
            <p>${content}</p>
            ${mediaHTML}
        </div>
        <div class="post-actions">
            <button class="action-btn"><i class="far fa-comment"></i> 0</button>
            <button class="action-btn"><i class="fas fa-retweet"></i> 0</button>
            <button class="action-btn"><i class="far fa-heart"></i> 0</button>
            <button class="action-btn"><i class="far fa-share-square"></i></button>
            <div class="post-time">${currentTime}</div>
        </div>
    `;

    // Yeni gönderiyi en üste ekle
    postsContainer.insertBefore(newPost, postsContainer.firstChild);

    // Formu temizle
    document.getElementById('postContent').value = '';
    document.getElementById('mediaPreview').innerHTML = '';
    document.getElementById('mediaPreview').classList.remove('active');
    selectedMedia = null;
}

// Sayfa yüklendiğinde gönderi oluşturma alanındaki ve örnek gönderilerdeki profil fotoğraflarını güncelle
document.addEventListener('DOMContentLoaded', function() {
    const userPhoto = localStorage.getItem('userPhoto');
    if (userPhoto) {
        const postCreatorProfilePic = document.querySelector('.post-creator .profile-pic');
        if (postCreatorProfilePic) {
            postCreatorProfilePic.src = userPhoto;
        }

        // Örnek gönderilerdeki profil fotoğraflarını güncelle
        const postProfileImgs = document.querySelectorAll('#postProfileImg1, #postProfileImg2');
        postProfileImgs.forEach(img => {
            img.src = userPhoto;
        });
    }
});

// Beğeni işlevselliği
document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('postsContainer');
    
    postsContainer.addEventListener('click', function(e) {
        const likeButton = e.target.closest('.action-btn');
        if (likeButton && likeButton.querySelector('.fa-heart')) {
            const likeCount = likeButton.textContent.trim();
            const currentCount = parseInt(likeCount) || 0;
            
            if (likeButton.classList.contains('liked')) {
                likeButton.classList.remove('liked');
                likeButton.innerHTML = `<i class="far fa-heart"></i> ${currentCount - 1}`;
            } else {
                likeButton.classList.add('liked');
                likeButton.innerHTML = `<i class="fas fa-heart"></i> ${currentCount + 1}`;
            }
        }
    });
});
