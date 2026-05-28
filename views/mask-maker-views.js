'use strict';

const formElement = document.forms['message-form'];
const textareaElement = formElement.elements['content'];
textareaElement.addEventListener('keydown', (event) => {
  if (isPressedSubmitKey(event)) {
    event.preventDefault();
    formElement.submit();
  }
});

function isPressedSubmitKey(event) {
  if (event.key !== 'Enter') {
    return false;
  }
  if (event.ctrlKey) {
    return true;
  }
  if (event.metaKey) {
    return true;
  }
}

//入力フォームの非表示、再表示
const textBox = document.getElementById('text-box');
const hideBtn = document.getElementById('hide-btn');
const showBtn = document.getElementById('show-btn');

hideBtn.addEventListener('click', () => {
  textBox.classList.add('d-none');
  showBtn.classList.remove('d-none');
});


showBtn.addEventListener('click', () => {
  showBtn.classList.add('d-none');
  textBox.classList.remove('d-none');
});