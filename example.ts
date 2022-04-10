
// Design a meeting rooms
// In an organisation
// there are n meeting rooms
// It is a difficult task to know which room is available
// you need to design a system to find the available rooms
// given the time slot
// the time slot is given in the form of start and end time


// Buildings
// Floors
// Meetings Rooms
// Meeting Room Capacity
// Meeting Room Name
// Slots

// As a user you want to book rooms
// room bookings are done in time, start and end
// 24 hours format
// meeting room should have an id
// you can only book a meeting room, if it is available
// you can only book a meeting room, max time slot in 12 hours

// List all meeting rooms available
// book a room
// cancel a room
// list all bookings

// 1. Identifying Entities
// Building
// Floor
// Meeting Room
// Slots
// Slot
// Acheduler

// 2. Understand relations between these entities
// Building has many floor
// Floor has many meeting rooms
// Meeting Room has many slots
// Slots can be from 1-24 hours
// Slot can be booked by a user

// 3. More detailing of each entity, and its attributes

// Slot
// Slot: [start, end]

// Slots
// slots: Slot[]
// add
// delete
// isAvailable
// size

// Meeting Room
// name: String
// capacity: number
// slots: Slots
// availableSlots: [number, number]
// addSlots
// deleteSlots
// isAvailable
// setAvailableSlots
// suggestedSlots

// Floor
// name: String
// meetingRooms: MeetingRoom[]
// addMeetingRoom
// doesMeetingRoomExist
// deleteMeetingRoom

// Building
// name
// floors: Floor[]
// addFloor
// doesFloorExist
// deleteFloor

// Scheduler
// building: Building
// addBuilding
// addFloor
// addMeeting
// listRooms
// bookRoomSlot
// cancelSlots
// listAllSlots
// isSlotAvailable
// suggestions



// class Slot{
//     slot: [number,number]
//     constructor(start: number, end: number){
//         this.slot=[start,end]
//     }
// }

// const s1=new Slot(1,2)
// console.log(s1)

class Slot {
    #slot: [number, number]
    constructor(start: number, end: number) {
        this.#slot = [start, end]
    }

    get start() {
        return this.#slot[0]
    }

    get end() {
        return this.#slot[1]
    }
}

const s1 = new Slot(1, 2)

console.log(s1);
console.log(s1.start);
console.log(s1.end);

class Slots {
    #slots: Slot[]
    #availableSlots: Slot[]
    constructor() {
        this.#slots = []
    }
    get slots() {
        return this.#slots
    }
    add(slot: Slot) {
        // start and end
        if (this.isAvailable(slot.start, slot.end)) {
            this.#slots.push(slot)
            this.#slots.sort((a, b) => a.start - b.start)
            return true
        }
        return false
    }
    isAvailable(start: number, end: number) {
        for (let slot of this.#slots) {
            if (slot.start < end && slot.end > start) {
                return false
            }
            // booked [[1,4], [7,10]]
            // [3,8]
        }
        return true
    }

    get size() {
        return this.#slots.length
    }
    listSlots() {
        for (let slot of this.#slots) {
            console.log(`start: ${slot.start}, end: ${slot.end}`)
        }
    }
    deleteSlot(slot: Slot) {
        for (let i = 0; i < this.#slots.length; i++) {
            if (this.#slots[i].start === slot.start && this.#slots[i].end === slot.end) {
                this.#slots.splice(i, 1)
                return true
            }
        }
        return false
    }
    setAvailableSlots(){

    }
}

const slot = new Slot(1,4)
const slot2 = new Slot(7,10)
const slot3 = new Slot(3,8)

// const slots = new Slots()
// slots.add(slot)
// slots.add(slot2)
// slots.add(slot3)

// console.log(slots.size, slots.listSlots());


class MeetingRoom {
    #name: string;
    #capacity: number;
    #slots: Slots;
    #availableSlots: [number, number][];
    constructor(name: string, capacity: number){
        this.#name = name;
        this.#capacity = capacity,
        this.#slots = new Slots();
        this.#availableSlots = [];
    }
    get name(){
        return this.#name;
    }
    get capacity(){
        return this.#capacity;
    }
    get slots(){
        return this.#slots.slots;
    }
    get availableSlots(){
        return this.#availableSlots;
    }
    addSlot(slot: Slot){
         return this.#slots.add(slot)
    }
    deleteSlot(slot: Slot){
         return this.#slots.deleteSlot(slot)
    }   
    setAvailableSlots(slots: [number, number][]){
        this.#availableSlots=[];
        // when does a meeting room have all hours available
        if(this.#slots.size === 0){
           this.#availableSlots.push([1,24]);
           return;
        }
        let start = 1;
        // booked
        // [[1,4], [7,10]]
        // available
        // [[4,7], [10,24]]
        for(let slot of this.#slots.slots){
            if(slot.start <= start){
                start = slot.end;
                continue;
            }
            const end = slot.start;
            this.#availableSlots.push([start,end]);
            start = slot.end;
        }
        if(start < 24){
            this.#availableSlots.push([start,24])
        }
    }
}

class Floor{
    name: string;
    meetingRooms: MeetingRoom[];
    constructor(name: string){
        this.name=name;
        this.meetingRooms=[];
    }
    doesMeetingRoomExist(meetingRoom: MeetingRoom){
        return this.meetingRooms.some(room=>room.name === meetingRoom.name);
    }
    addMeetingRoom(meetingRoom: MeetingRoom){
        if(this.doesMeetingRoomExist(meetingRoom)){
            return false;
        }
        this.meetingRooms.push(meetingRoom);
        return true;
    }
}

class Building{
    #name: string;
    #floors: Floor[];
    // floors: Map<string, Floor>
    constructor(name: string){
         this.#name=name;
         this.#floors=[];
    }
    doesFloorExist(floor: Floor){
        return this.#floors.some(f=> f.name === floor.name);
    }
    addFloor(floor: Floor){
        if(this.doesFloorExist(floor)){
            return false;
        }
        this.#floors.push(floor);
        return true;
    }
    get name(){
        return this.#name;
    }
    get totalFloors(){
        return this.#floors.length;
    }
    get allFloors(){
        return this.#floors;
    }
    getFloorByName(name: string){
        return this.#floors.find(f => f.name === name);
    }
}

class Scheduler{
    buildings: Map<string, Building>;
    constructor(){
        this.buildings = new Map();
    }
    addBuildings(building: Building){
        if(this.buildings.has(building.name)){
            console.log(`building ${building.name} already exists`)
            return false;
        }
        this.buildings.set(building.name, building);
        console.log(`building ${building.name} added`)
        return true;
    }
    addFloor(buildingName: string, floor: Floor){
        
    }
    addMeetingRoom(building: string, floorName: string, meetingRoom: MeetingRoom){

    }
    listRooms(buildingName: string, floorName: string){

    }
    listAllRooms(){

    }
    bookSlot(buildingName: string, floorName: string, meetingRoom: string, slot: string){

    }
    cancelSlot(buildingName: string, floorName: string, meetingRoom: string, slot: string){

    }
    listAllSlots(buildingName: string, floorName: string, meetingRoom: string){

    }
    isSlotAvailable(buildingName: string, floorName: string, meetingRoom: string, slot: string){

    }
}