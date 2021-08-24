import $ from 'jquery';
import forEach from 'lodash/forEach'

export const init = async () => {
  const INIT_ADULTS = 2
  const INIT_CHILDREN = []
  const INIT_ROOM = {
    adults: INIT_ADULTS,
    children: INIT_CHILDREN
    // children: [5, 4]
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
  let URL = '1:4,6|3'

  let Session = {
    deconstructURL: (searchUrlParams) => {
      var SEARCH_ROOMS = []
      var rooms = searchUrlParams.split('|')
      forEach(rooms, (value, indexRoom) => {
        SEARCH_ROOMS[indexRoom] = {}
        SEARCH_ROOMS[indexRoom]['adults'] = parseFloat(rooms[indexRoom])

        if (value.includes(':')) {
          var occupants = value.split(':')
          forEach(occupants, (value) => {
            SEARCH_ROOMS[indexRoom]['adults'] = parseFloat(occupants[indexRoom])
  
            if (value.includes(',')) {
              var ages = value.split(',')
              SEARCH_ROOMS[indexRoom]['ages'] = []
              forEach(ages, (value, indexAges) => {
                SEARCH_ROOMS[indexRoom]['ages'][indexAges] = parseFloat(value)
              })
            }
          })
        }
      })

      console.log(SEARCH_ROOMS)
    },

    updateRooms: () => {
      $('.js-rooms').empty()
      ROOM_QTY = 0
      for (let i = 0; i < ROOMS.length; i++) {
        new Room(ROOMS[i]).createRoom()
      }
    },

    deleteChild: (room, child) => {
      $('.js-room[data-room=' + room + '] .js-child[data-child=' + child + ']').remove()
      ROOMS[room - 1].children.splice(child, 1)
      Session.updateRooms()
    },

    updateChild: (room, child, value) => {
      ROOMS[room - 1].children[child] = value
      Session.updateRooms()
    },

    deleteRoom: (room) => {
      $('.js-room[data-room=' + room + ']').remove()
      let room_index = ROOMS.indexOf(room - 1)
      ROOMS.splice(parseFloat(room_index), 1)
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
          <div class="GuestPicker-option-extra js-child" data-child="${i}">
            <span>Child ${i + 1} Age</span>
            <div class="GuestPicker-qty">
              <select name="child-age" id="" data-room="${room}" data-child="${i}">
                ${this.getChildrenOptionAges(this.children[i])}
              </select>
              <button class="--button --clear --remove js-remove" data-room="${room}" data-child="${i}"></button>
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
                <button class="--button --minus js-minus" data-action="minus" data-occupant="adult" data-room="${ ROOM_QTY }"></button>
                <span class="js-qty">${ this.adults }</span>
                <button class="--button --plus js-plus" data-action="plus" data-occupant="adult" data-room="${ ROOM_QTY }"></button>
              </div>
            </div>
            <div class="GuestPicker-option">
              <span>Childrens</span>
              <div class="GuestPicker-qty">
                <button class="--button --minus js-minus" data-action="minus" data-occupant="children" data-room="${ ROOM_QTY }"></button>
                <span class="js-qty">${ this.children.length }</span>
                <button class="--button --plus js-plus" data-action="plus" data-occupant="children" data-room="${ ROOM_QTY }"></button>
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
  Session.deconstructURL(URL)

  $('.js-add-room').on('click', (e) => {
    e.preventDefault()
    if (ROOMS.length < MAX_ROOMS) {
      let new_room = {
        adults: 2,
        children: []
      }
      ROOMS.push(new_room)
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
    Session.deleteChild($(e.target).data('room'), $(e.target).data('child'))
  })

  $(document).on('change', '.js-child', (e) => {
    e.preventDefault()
    e.stopPropagation()
    Session.updateChild($(e.target).data('room'), $(e.target).data('child'), $(e.target).val())
  })

  $(document).on('click', '[data-action]', (e) => {
    e.preventDefault()
    e.stopPropagation()
    let action = $(e.target).data('action')
    let occupant = $(e.target).data('occupant')
    let room = ROOMS[$(e.target).data('room') - 1]
    let adultsQty = room.adults
    let childrenQty = room.children
    let remainingOccupancy = (adultsQty + childrenQty.length) < MAX_OCCUPANCY

    if (occupant === "adult") {
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
    } else if (occupant === "children") {
      switch (action) {
        case 'minus':
          if (childrenQty.length > MIN_CHILDREN) {
            room.children.splice(-1,1);
          }
          break;
        case 'plus':
          if (childrenQty.length < MAX_CHILDREN && remainingOccupancy) {
            room.children.push(1)
          }
          break;
      }
    }


    Session.updateRooms()
  })
}