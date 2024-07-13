import { getNode } from 'kind-tiger';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://plainyogurt.pockethost.io/');

const form = getNode('form');
const userIdInput = getNode('#user-id');
const emailInput = getNode('#email');
const passwordInput = getNode('#user-pw');
const confirmPasswordInput = getNode('#confirm-password');

document.addEventListener('DOMContentLoaded', function () {
  const agreeAllCheckbox = getNode('#agree-all');
  const serviceCheckCheckbox = getNode('#service-check');
  const checkboxes = document.querySelectorAll('.privacy-policy input[type="checkbox"]');

  agreeAllCheckbox.addEventListener('change', function () {
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = agreeAllCheckbox.checked;
    });
  });

  serviceCheckCheckbox.addEventListener('change', function () {
    getNode('#marketing-sms-check').checked = serviceCheckCheckbox.checked;
    getNode('#marketing-email-check').checked = serviceCheckCheckbox.checked;
  });

  form.addEventListener('submit', handleSignUp);

  document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', function () {
      let deleteIcon = this.nextElementSibling;
      if (deleteIcon && deleteIcon.classList.contains('delete-icon')) {
        if (this.value.length > 0) {
          deleteIcon.classList.remove('invisible');
          deleteIcon.classList.add('visible');
        } else {
          deleteIcon.classList.remove('visible');
          deleteIcon.classList.add('invisible');
        }
      }
    });

    let deleteIcon = input.nextElementSibling;
    if (deleteIcon && deleteIcon.classList.contains('delete-icon')) {
      deleteIcon.addEventListener('click', function () {
        input.value = '';
        deleteIcon.classList.remove('visible');
        deleteIcon.classList.add('invisible');
      });
    }
  });
});


function togglePasswordVisibility(element) {
  const pwInput = getNode("#user-pw");
  pwInput.classList.toggle('active');

  if (pwInput.classList.contains('active')) {
    element.querySelector('img').src = '/public/icon/signUp/iconWatched.svg';
    pwInput.setAttribute('type', 'text');
  } else {
    element.querySelector('img').src = '/public/icon/signUp/iconWatching.svg';
    pwInput.setAttribute('type', 'password');
  }
}

function toggleConfirmPasswordVisibility(element){
  const confirmPwInput = getNode("#confirm-password");
  confirmPwInput.classList.toggle('active');

  if (confirmPwInput.classList.contains('active')) {
    element.querySelector('img').src = '/public/icon/signUp/iconWatched.svg';
    confirmPwInput.setAttribute('type', 'text');
  } else {
    element.querySelector('img').src = '/public/icon/signUp/iconWatching.svg';
    confirmPwInput.setAttribute('type', 'password');
  }
}

document.querySelectorAll('.pw-visible').forEach(icon => {
  icon.addEventListener('click', function() {
    togglePasswordVisibility(this);
  });
});

document.querySelectorAll('.comfirm-pw-visible').forEach(icon => {
  icon.addEventListener('click', function() {
    toggleConfirmPasswordVisibility(this);
  })
})


async function handleSignUp(event) {
  event.preventDefault();

  const userId = getNode('#user-id').value;
  const userPw = getNode('#user-pw').value;
  const confirmPassword = getNode('#confirm-password').value;
  const email = getNode('#email').value;

  if (!pwReg(userPw)) {
    displayError(passwordInput, '비밀번호는 영문, 숫자, 특수문자(~!@#$%^&*) 조합 8~15자리로 구성되어야 합니다.');
    return;
  } else {
    removeError(passwordInput);
  }

  if (!idReg(userId)) {
    displayError(userIdInput, '아이디는 영문 또는 영문, 숫자 조합 6~12자리로 구성되어야 합니다.');
    return;
  } else {
    removeError(passwordInput);
  }

  if (!emailReg(email)) {
    displayError(emailInput, '유효한 이메일 주소를 입력하세요.');
    return;
  } else {
    removeError(emailInput);
  }

  if (userPw !== confirmPassword) {
    displayError(confirmPasswordInput, '비밀번호가 일치하지 않습니다.');
    return;
  } else {
    removeError(confirmPasswordInput);
  }

  try {
    const newUser = await pb.collection('users').create({
      username: userId,
      email: email,
      password: userPw,
      passwordConfirm: confirmPassword,
    });

    alert('회원가입이 완료되었습니다.');
    location.href = '/src/pages/login/index.html';
  } catch (error) {
    if (error.message.includes('already exists')) {
      alert('이미 가입된 계정입니다.');
    } else if (error.message.includes('username validation failed')) {
      displayError(userIdInput, '아이디는 영문 또는 영문, 숫자 조합 6~12자리로 구성되어야 합니다.');
    } else {
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }
}

function idReg(text) {
  const re = /^[a-zA-Z0-9]{6,12}$/;
  return re.test(text);
}

function pwReg(text) {
  const re = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*]).{8,15}$/;
  return re.test(String(text));
}

function emailReg(text) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(text).toLowerCase());
}

function displayError(input, message) {
  const errorElement = input.nextElementSibling.nextElementSibling;
  errorElement.classList.add('error');
  errorElement.textContent = message;
}

function removeError(input) {
  const errorElement = input.nextElementSibling.nextElementSibling;
  errorElement.classList.remove('error');
  errorElement.textContent = 'ㅤ';
}
