document.addEventListener('DOMContentLoaded', () => {
  const modalOpen = document.querySelector('[data-modal]'),
    modal = document.querySelector('.modal');

  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.classList.add('hide');
    document.body.style.overflow = '';
  }

  modalOpen.addEventListener('click', openModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // Forms

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/spinner.svg',
    success: 'Всё хорошо!',
    failure: 'Всё хуёво',
  };

  forms.forEach((item) => {
    postData(item);
  });

  function postData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.append(statusMessage);
      //form.insertAdjacentElement('куда вставить элемент', 'и что нужно вставить'); // более гибкий метод для помещения элементов в разные места вёрскти(мне на этом сайте он не нужен)

      //const request = new XMLHttpRequest();
      //request.open('POST', 'server.php');
      //request.setRequestHeader('Content-type', 'application/json');

      const formData = new FormData(form);

      const object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });

      //const json = JSON.stringify(object);

      //request.send(json);

      fetch('server.php', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(object),
      })
        .then((data) => data.text())
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });

      //request.addEventListener('load', () => {
      //  if (request.status === 200) {
      //    console.log(request.response);
      //    showThanksModal(message.success);
      //    form.reset();
      //    statusMessage.remove();
      //  } else {
      //    showThanksModal(message.failure);
      //  }
      //});
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');

    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }

  //fetch('https://jsonplaceholder.typicode.com/posts', {
  //  method: 'POST',
  //  body: JSON.stringify({ name: 'Alex' }),
  //  headers: {
  //    'Content-type': 'application/json',
  //  },
  //})
  //  .then((response) => response.json())
  //  .then((json) => console.log(json));
});
