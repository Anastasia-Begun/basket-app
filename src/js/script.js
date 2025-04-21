import { createProduct, getProducts } from './api.js'
import { SELECTORS } from './selectors.js'

init()

function init() {
  // подгрузка данных при загрузке страницы
  window.addEventListener('DOMContentLoaded', () => {
    getProducts()
    submitForm()
    updateBasketCount() // Обновляем количество товаров в корзине при загрузке
    setupBasketModal() // Устанавливаем обработчики для модального окна с корзиной
    displayBasketItems() // Отображаем товары в корзине при загрузке
  })
}
// Функция для обновления количества товаров в корзине
function updateBasketCount() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0) // Считаем общее количество товаров

  const basketCountElement = SELECTORS.basketCount
  basketCountElement.textContent = totalQuantity > 0 ? totalQuantity : '' // Отображаем общее количество товаров
}

// Обработчик формы
function submitForm() {
  SELECTORS?.form?.addEventListener('submit', (event) => {
    event?.preventDefault()

    // Новый товар
    const productData = {}
    Array?.from(SELECTORS?.form?.elements)?.forEach((element) => {
      if (element?.name) {
        productData[element.name] = element.value
      }
    })

    // Функция создания нового товара
    createProduct(productData)

    // Показ актуальных данных
    getProducts()
  })
}

// Добавление товара в корзину
export function addToCart(product) {
  // Получаем текущие товары в корзине из локального хранилища
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []

  // Проверяем, существует ли товар в корзине
  const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === product.id)

  if (existingItemIndex > -1) {
    // Если товар уже существует, увеличиваем его количество на 1
    cartItems[existingItemIndex].quantity += 1
  } else {
    // Если товара нет, добавляем его в массив с начальным количеством 1
    const newItem = { ...product, quantity: 1 }
    cartItems.push(newItem)
  }

  // Сохраняем обновлённый массив товаров обратно в локальное хранилище
  localStorage.setItem('cartItems', JSON.stringify(cartItems))
  updateBasketCount() // Обновляем отображение количества товаров в корзине
}

// Модальное окно
function setupBasketModal() {
  const openBasketButton = document.getElementById('open-basket')
  const modal = document.getElementById('modal-basket')
  const closeButton = document.getElementById('close-button')

  openBasketButton.addEventListener('click', () => {
    displayBasketItems()
    modal.showModal()
  })

  closeButton.addEventListener('click', () => {
    modal.close()
  })
}

// Функция отображения товаров в корзине
function displayBasketItems() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []
  const basketListElement = document.querySelector('.basket-container__list')
  basketListElement.innerHTML = '' // Очистить текущий список

  let total = 0

  cartItems.forEach((item, index) => {
    const productElement = document.createElement('div')
    productElement.classList.add('basket-item')

    productElement.innerHTML = `
      <h3>${item.name}</h3>
      <img src="${item.imageUrl}" alt="${item.name}" class="basket-item__image">
      <p>Category: ${item.category}</p>
      <p>Rating: ${item.rating}</p>
      <p>Price: ${item.price} (Quantity: ${item.quantity})</p> <!-- Отображаем количество -->
      <button class="remove-button" data-index="${index}">Удалить</button>
    `

    total += parseFloat(item.price) * item.quantity // Добавляем цену товара к общей сумме с учетом количества
    basketListElement.appendChild(productElement)
  })

  const totalValueElement = document.querySelector('.basket__total-value')
  totalValueElement.textContent = total > 0 ? total : '0'

  // Добавление обработчиков событий для кнопок удаления
  const removeButtons = document.querySelectorAll('.remove-button')
  removeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const indexToRemove = event.target.dataset.index // Получаем индекс товара
      removeItemFromCart(indexToRemove)
    })
  })
}

// Функция удаления товара из корзины
function removeItemFromCart(index) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []
  // Удаляем товар по индексу
  cartItems.splice(index, 1)
  // Сохраняем обновлённый массив обратно в локальное хранилище
  localStorage.setItem('cartItems', JSON.stringify(cartItems))
  // Перерисовываем корзину, чтобы отобразить изменения
  displayBasketItems()
  // Обновляем количество товаров в корзине
  updateBasketCount()
}

// Пример вызова функции при загрузке страницы
document.addEventListener('DOMContentLoaded', displayBasketItems)
