import $ from 'jquery';
import _ from 'lodash'

export const init = async () => {
  const INIT_ADULTS = 2
  const INIT_CHILDREN = []
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

  let NEW_ROOM = INIT_ROOM
  let ROOMS = [NEW_ROOM]
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

    getChild(room) {
      let childrenLayout = ``
      for (let i = 0; i < this.children.length; i++) {
        childrenLayout += `
          <div class="GuestPicker-option-extra" data-child="${i}">
            <span>Child ${i + 1} Age</span>
            <div class="GuestPicker-qty">
              <select name="child-age" id="">
                ${this.getChildrenOptionAges(this.children[i].age)}
              </select>
              <button class="--button --clear --remove js-remove" data-room="${room}"></button>
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
                <button class="--button --minus js-minus" data-action="minus" data-guest="adult" data-room="${ ROOM_QTY }"></button>
                <span class="js-qty">${ this.adults }</span>
                <button class="--button --plus js-plus" data-action="plus" data-guest="adult" data-room="${ ROOM_QTY }"></button>
              </div>
            </div>
            <div class="GuestPicker-option">
              <span>Childrens</span>
              <div class="GuestPicker-qty">
                <button class="--button --minus js-minus" data-action="minus" data-guest="children" data-room="${ ROOM_QTY }"></button>
                <span class="js-qty">${ this.children.length }</span>
                <button class="--button --plus js-plus" data-action="plus" data-guest="children" data-room="${ ROOM_QTY }"></button>
              </div>
              ${this.getChild(ROOM_QTY)}
            </div>
          </div>
        </div>
      `)
    }
  }
  
  new Room({
    adults: 2,
    children: []
  }).createRoom()

  $('.js-add-room').on('click', (e) => {
    e.preventDefault()
    if (ROOMS.length < MAX_ROOMS) {
      let new_room = {
        adults: 2,
        children: []
      }
      ROOMS.push(new_room)
      console.log(ROOMS)
      new Room(new_room).createRoom()
    }
  })

  $(document).on('click', '.js-remove-room', (e) => {
    e.preventDefault()
    e.stopPropagation()
    Session.deleteRoom($(e.target).data('room'))
  })

  $(document).on('click', '.js-remove', (e) => {
    e.preventDefault()
    e.stopPropagation()
    Session.deleteRoom($(e.target).data('room'))
  })

  $(document).on('click', '[data-action]', (e) => {
    e.preventDefault()
    e.stopPropagation()
    let action = $(e.target).data('action')
    let guest = $(e.target).data('guest')
    let room = ROOMS[$(e.target).data('room') - 1]
    let adultsQty = room.adults
    let childrenQty = room.children
    let remainingOccupancy = (adultsQty + childrenQty.length) < MAX_OCCUPANCY

    if (guest === "adult") {
      switch (action) {
        case 'minus':
          if (adultsQty > MIN_ADULTS) {
            room.adults -= 1
          }
          break;
        case 'plus':
          if (adultsQty < MAX_ADULTS && remainingOccupancy) {
            room.adults += 1
          }
          break;
      }
    } else if (guest === "children") {
      switch (action) {
        case 'minus':
          if (childrenQty.length > MIN_CHILDREN) {
            room.children.splice(-1,1);
          }
          break;
        case 'plus':
          if (childrenQty.length < MAX_CHILDREN && remainingOccupancy) {
            room.children.push({age: 1})
          }
          break;
      }
    }


    Session.updateRooms()
  })
}