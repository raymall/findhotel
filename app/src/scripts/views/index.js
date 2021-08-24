import $ from 'jquery';
import _ from 'lodash'

export const init = async () => {
  const INIT_ADULTS = 2
  const INIT_CHILDREN = 0
  const INIT_ROOM = {
    adults: INIT_ADULTS,
    children: INIT_CHILDREN
    // children: [{age: 5}, {age: 4}]
  }
  const MAX_ROOMS = 8
  const MAX_OCCUPANCY = 5
  const MIN_ADULTS = 1
  const MAX_ADULTS = 5
  const MIN_CHILDREN = 0
  const MAX_CHILDREN = 3
  const MAX_CHILDREN_AGE = 12

  let ROOMS = [INIT_ROOM]
  let ROOM_QTY = ROOMS.length - 1

  let Session = {
    updateRooms: () => {
      $('.js-rooms').empty()
      ROOM_QTY = 0
      for (let i = 0; i < ROOMS.length; i++) {
        new Room(ROOMS[i]).createRoom()
      }
    },

    deleteRoom: (room) => {
      $('.js-room[data-room=' + room + ']').remove()
      let room_index = ROOMS.indexOf(room - 1)
      ROOMS.splice(parseFloat(room_index), 1)
      console.log(ROOMS)
      Session.updateRooms()
    }
  }

  class Room {
    constructor(room) {
      this.adults = room.adults
      this.children = room.children
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
      let childrenAgesOptions = ``
      for (let i = 0; i < MAX_CHILDREN_AGE; i++) {
        let age = i + 1
        childrenAgesOptions += `
          <option value="${age}" ${(childrenAge == age) ? 'selected' : ''}>${age}</option>
        `
      }

      return childrenAgesOptions
    }

    getChild() {
      let childrenLayout = ``
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

    getRoom() {

    }

    createRoom() {
      ROOM_QTY++

      $('.js-rooms').append(`
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

  }
  
  new Room(INIT_ROOM).createRoom()

  $('.js-add-room').on('click', (e) => {
    e.preventDefault()
    ROOMS.push(INIT_ROOM)
    console.log(ROOMS)
    new Room(INIT_ROOM).createRoom()
  })

  $(document).on('click', '.js-remove-room', (e) => {
    e.preventDefault()
    e.stopPropagation()
    Session.deleteRoom($(e.target).data('room'))
  })
}