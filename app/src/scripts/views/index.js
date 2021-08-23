import $ from 'jquery';

export const init = async () => {
  const INIT_ROOMS = 1
  const INIT_ADULTS = 2
  const INIT_CHILDREN = 0
  const MAX_ROOMS = 8
  const MAX_OCCUPANCY = 5
  const MIN_ADULTS = 1
  const MAX_ADULTS = 5
  const MIN_CHILDREN = 0
  const MAX_CHILDREN = 3
  const MAX_CHILDREN_AGE = 12

  let ROOM_QTY = 0

  class GuestPicker {
    constructor(adults, children) {
      this.adults = adults;
      this.children = children;
    }

    getAdults() {
      return `
        <div class="GuestPicker-option">
          <span>Adults</span>
          <div class="GuestPicker-qty">
            <button class="--button --minus js-minus"></button>
            <span class="js-qty">${ this.adults }</span>
            <button class="--button --plus js-plus"></button>
          </div>
        </div>
      `
    }

    getChildrenOptionAges(childrenAge) {
      var childrenAgesOptions = ``
      for (let i = 0; i < MAX_CHILDREN_AGE; i++) {
        let age = i + 1
        childrenAgesOptions += `
          <option value="${age}" ${(childrenAge == age) ? 'selected' : ''}>${age}</option>
        `
      }

      return childrenAgesOptions
    }

    getChild() {
      var childrenLayout = ``
      for (let i = 0; i < this.children.length; i++) {
        childrenLayout += `
          <div class="GuestPicker-option-extra">
            <span>Child ${i + 1} Age</span>
            <div class="GuestPicker-qty">
              <select name="child-age" id="">
                ${this.getChildrenOptionAges(this.children[i].age)}
              </select>
              <button class="--button --clear --remove js-remove"></button>
            </div>
          </div>
        `
      }
      
      return childrenLayout
    }

    createRoom() {
      ROOM_QTY++

      $('.js-rooms')
      .append(`
        <div class="GuestPicker-room js-room" data-room="${ ROOM_QTY }">
          <div class="GuestPicker-legend">
            <span>Room ${ ROOM_QTY }</span>
            ${(ROOM_QTY > 1) ? '<button class="--clear --link js-remove-room" data-room="' + ROOM_QTY + '">Remove room</button>' : ''}
          </div>
          <div class="GuestPicker-options">
            <div class="GuestPicker-option">
              <span>Adults</span>
              <div class="GuestPicker-qty">
                <button class="--button --minus js-minus"></button>
                <span class="js-qty">${ INIT_ADULTS }</span>
                <button class="--button --plus js-plus"></button>
              </div>
            </div>
            <div class="GuestPicker-option">
              <span>Childrens</span>
              <div class="GuestPicker-qty">
                <button class="--button --minus js-minus"></button>
                <span class="js-qty">${ INIT_CHILDREN }</span>
                <button class="--button --plus js-plus"></button>
              </div>
              ${this.getChild()}
            </div>
          </div>
        </div>
      `)
    }

    deleteRoom(room) {
      $('.js-room[data-room=' + room + ']').remove()
    }

  }

  // let sessionGuestPicker = new GuestPicker(INIT_ADULTS, [{age: 5}, {age: 4}])
  let sessionGuestPicker = new GuestPicker(INIT_ADULTS, INIT_CHILDREN)
  sessionGuestPicker.createRoom()

  $('.js-add-room').on('click', (e) => {
    e.preventDefault()
    sessionGuestPicker.createRoom()
  })

  $(document).on('click', '.js-remove-room', (e) => {
    e.preventDefault()
    console.log('here', $(e.target).data('room'))
    sessionGuestPicker.deleteRoom($(e.target).data('room'))
  })
}