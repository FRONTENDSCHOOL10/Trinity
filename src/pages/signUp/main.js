// 모두 체크하기 기능, 선택 항목만 모두 체크 기능
document.addEventListener("DOMContentLoaded", function() {
    const agreeAllCheckbox = document.getElementById("agree-all");
    const serviceCheckCheckbox = document.getElementById("service-check");
    const checkboxes = document.querySelectorAll(".privacy-policy input[type='checkbox']");

    agreeAllCheckbox.addEventListener("change", function() {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = agreeAllCheckbox.checked;
        });
    });

    serviceCheckCheckbox.addEventListener("change", function() {
        document.getElementById("marketing-sms-check").checked = serviceCheckCheckbox.checked;
        document.getElementById("marketing-email-check").checked = serviceCheckCheckbox.checked;
    });
});

// id, pw, email 유효성 검사 기능
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const userIdInput = document.getElementById("user-id");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    form.addEventListener("submit", function(event) {
        let isValid = true;
        
        // 아이디 유효성 검사
        const userId = userIdInput.value;
        const userIdPattern = /^[a-zA-Z0-9]{6,12}$/;
        if (!userIdPattern.test(userId)) {
            displayError(userIdInput, "아이디는 영문 또는 영문과 숫자 조합으로 6~12자리여야 합니다.");
            isValid = false;
        } else {
            removeError(userIdInput);
        }

        // 이메일 유효성 검사
        const email = emailInput.value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            displayError(emailInput, "유효한 이메일 주소를 입력하세요.");
            isValid = false;
        } else {
            removeError(emailInput);
        }

        // 비밀번호 유효성 검사
        const password = passwordInput.value;
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*]).{8,15}$/;
        if (!passwordPattern.test(password)) {
            displayError(passwordInput, "비밀번호는 영문, 숫자, 특수문자(~!@#$%^&*) 조합으로 8~15자리여야 합니다.");
            isValid = false;
        } else {
            removeError(passwordInput);
        }

        // 비밀번호 확인 검사
        const confirmPassword = confirmPasswordInput.value;
        if (password !== confirmPassword) {
            displayError(confirmPasswordInput, "비밀번호가 일치하지 않습니다.");
            isValid = false;
        } else {
            removeError(confirmPasswordInput);
        }

        if (!isValid) {
            event.preventDefault();
        }
    });

    function displayError(input, message) {
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains("error")) {
            error = document.createElement("div");
            error.classList.add("error");
            input.parentNode.insertBefore(error, input.nextSibling);
        }
        error.textContent = message;
    }

    function removeError(input) {
        let error = input.nextElementSibling;
        if (error && error.classList.contains("error")) {
            error.remove();
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    let deleteIcons = document.querySelectorAll('.delete-icon');
    deleteIcons.forEach(function(icon) {
        icon.addEventListener('click', function() {
            var inputField = icon.previousElementSibling; // input 요소 선택
            inputField.value = ''; // 값 초기화
        });
    });

  // 비밀번호 보기/감추기 기능


});
