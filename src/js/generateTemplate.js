import { SELECTORS } from './selectors.js'
import { addToCart } from './script.js'

// Функция создает html на основе данных
export function generateTemplate(data) {
  let html = ''

  if (data && Array.isArray(data)) {
    data.forEach((product) => {
      html += `
             <div class="main-card">
              <div class="card-image">
                <img src="${product?.imgSrc}" alt="image">
              </div>
              <h3 class="card-name">${product?.name}</h3>
              <p class="card-category">${product?.category}</p>
              <p class="card-price">${product?.price}</p>
              <button class="btn btn-primary" data-product='${JSON.stringify(product)}'>Add to cart</button>
            </div>
        `
    })
  }
  // Очистка исходного содрежимого
  SELECTORS.productList.innerHTML = ``

  SELECTORS?.productList.insertAdjacentHTML('beforeend', html)

  // Добавляем события для кнопок "Add to cart"
  const buttons = document.querySelectorAll('.btn.btn-primary')
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const product = JSON.parse(button.getAttribute('data-product'))
      addToCart(product)
    })
  })
}
