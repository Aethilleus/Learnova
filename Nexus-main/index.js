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

// Hesap Sayfası JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Profil fotoğrafı değiştirme
    const changePhotoBtn = document.querySelector('.change-photo-btn');
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        document.querySelector('.profile-image img').src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }

    // Düzenleme butonları
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('section');
            const infoGroups = section.querySelectorAll('.info-group');
            
            infoGroups.forEach(group => {
                const label = group.querySelector('label').textContent;
                const text = group.querySelector('p')?.textContent || '';
                
                if (group.querySelector('p')) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = text;
                    input.className = 'edit-input';
                    input.style.width = '100%';
                    input.style.padding = '8px';
                    input.style.borderRadius = '4px';
                    input.style.border = '1px solid #ddd';
                    input.style.marginTop = '5px';
                    
                    group.querySelector('p').replaceWith(input);
                }
            });

            // Düzenleme butonunu Kaydet butonu ile değiştir
            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Kaydet';
            saveBtn.className = 'edit-btn save-btn';
            saveBtn.style.background = '#28a745';
            saveBtn.style.color = 'white';
            saveBtn.style.border = 'none';
            
            saveBtn.addEventListener('click', function() {
                infoGroups.forEach(group => {
                    const input = group.querySelector('.edit-input');
                    if (input) {
                        const p = document.createElement('p');
                        p.textContent = input.value;
                        input.replaceWith(p);
                    }
                });
                
                this.replaceWith(btn);
            });
            
            this.replaceWith(saveBtn);
        });
    });

    // Telefon ve e-posta ekleme
    const addPhone = document.querySelector('.add-phone');
    const addEmail = document.querySelector('.add-email');

    if (addPhone) {
        addPhone.addEventListener('click', function(e) {
            e.preventDefault();
            const input = document.createElement('input');
            input.type = 'tel';
            input.placeholder = 'Telefon numarası ekleyin';
            input.className = 'edit-input';
            input.style.width = '100%';
            input.style.padding = '8px';
            input.style.borderRadius = '4px';
            input.style.border = '1px solid #ddd';
            input.style.marginTop = '10px';
            
            this.parentElement.insertBefore(input, this);
        });
    }

    if (addEmail) {
        addEmail.addEventListener('click', function(e) {
            e.preventDefault();
            const input = document.createElement('input');
            input.type = 'email';
            input.placeholder = 'E-posta adresi ekleyin';
            input.className = 'edit-input';
            input.style.width = '100%';
            input.style.padding = '8px';
            input.style.borderRadius = '4px';
            input.style.border = '1px solid #ddd';
            input.style.marginTop = '10px';
            
            this.parentElement.insertBefore(input, this);
        });
    }
});

// Güvenlik Sayfası JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Parola görünürlüğünü değiştirme
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });

    // Parola gücü kontrolü
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
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
    window.togglePasswordChange = function() {
        const form = document.getElementById('passwordChangeForm');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    // Parola değiştirme işlemi
    window.changePassword = function() {
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
    window.toggle2FA = function() {
        const setup = document.getElementById('twoFactorSetup');
        const toggle = document.getElementById('twoFactorToggle');
        
        if (toggle.checked) {
            setup.style.display = 'block';
        } else {
            if (confirm('İki adımlı doğrulamayı kapatmak istediğinizden emin misiniz?')) {
                setup.style.display = 'none';
            } else {
                toggle.checked = true;
            }
        }
    }

    // Oturum yenileme
    window.refreshSessions = function() {
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
        btn.addEventListener('click', function() {
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