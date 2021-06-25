'use strict';

const item = document.querySelector('.input__list');
const lists = document.querySelector('.list');
const addButton = document.querySelector('.add');
const items = document.querySelector('.item');

class List {
  constructor(id, content) {
    this.content = content;
    this.id = +id;
  }
}

class App {
  #listItems = new Map();
  #count = 1;
  #curList;

  constructor() {
    if (localStorage.getItem('List')) {
      this.#listItems = new Map(
        Object.entries(JSON.parse(localStorage.getItem('List')))
      );
    }
    this.#count = this.#listItems.size + 1;
    this._poulateList();
    addButton.addEventListener('click', this._newList.bind(this));
  }

  _newList() {
    if (addButton.textContent === 'Add') {
      let list;
      if (!item.value) return alert('Kindly enter some text!');
      list = new List(this.#count, item.value);
      this.#listItems.set(+list.id, list.content);

      localStorage.setItem(
        'List',
        JSON.stringify(Object.fromEntries(this.#listItems))
      );
      const html = `
      <li class="list" id="${list.id}" data-id="${list.id}">
          <label for="" class="list__content">${list.content}</label>
          <svg class="list__btn update">
            <use xlink:href="sprite.svg#icon-edit"></use>
          </svg>
          <svg class="list__btn delete">
            <use xlink:href="sprite.svg#icon-trash-2"></use>
          </svg>
      </li>
      `;
      this.#count++;

      items.insertAdjacentHTML('afterbegin', html);
      items.firstElementChild.addEventListener('click', e => {
        const del = e.target.closest('.delete');
        const update = e.target.closest('.update');

        if (!del && !update) return;

        if (del) {
          items.removeChild(del.closest('.list'));
          this.#listItems.delete(+del.closest('.list').dataset.id);
          localStorage.setItem(
            'List',
            JSON.stringify(Object.fromEntries(this.#listItems))
          );
        }

        if (update) {
          const listId = +update.closest('.list').dataset.id;
          item.value = this.#listItems.get(listId);
          this.#curList = listId;
        }
      });
    } else {
      if (addButton.textContent === 'Done') {
        this.#listItems.set(this.#curList, item.value);
        document.getElementById(this.#curList).firstElementChild.textContent =
          this.#listItems.get(this.#curList);
        localStorage.setItem(
          'List',
          JSON.stringify(Object.fromEntries(this.#listItems))
        );
        addButton.textContent = 'Add'
      }
    }
    item.value = '';
  }

  _poulateList() {
    for (const it of this.#listItems) {
      const html = `
      <li class="list" id="${+it[0]}" data-id="${+it[0]}">
      <label for="" class="list__content">${it[1]}</label>
      <svg class="list__btn update">
        <use xlink:href="sprite.svg#icon-edit"></use>
      </svg>
      <svg class="list__btn delete">
        <use xlink:href="sprite.svg#icon-trash-2"></use>
      </svg>
      </li>
      `;

      items.insertAdjacentHTML('afterbegin', html);
      document
        .getElementById(+it[0])
        .addEventListener('click', this.populate.bind(this));
    }
  }

  populate(e) {
    const del = e.target.closest('.delete');
    const update = e.target.closest('.update');
    if (!del && !update) return;

    if (del) {
      items.removeChild(del.closest('.list'));
      this.#listItems.delete(del.closest('.list').dataset.id);
      localStorage.setItem(
        'List',
        JSON.stringify(Object.fromEntries(this.#listItems))
      );
    }

    if (update) {
      if (addButton.textContent === 'Add') {
        const listId = update.closest('.list').dataset.id;
        item.value = this.#listItems.get(listId);
        this.#curList = listId;
        addButton.textContent = 'Done';
      } else {
        if (addButton.textContent === 'Done') {
          addButton.textContent = 'Add';
        }
      }
    }
  }
}

const app = new App();
