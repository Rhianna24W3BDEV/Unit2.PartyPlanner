const baseURL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-ET-WEB-PT'

/*async function logAsync(func){
   const result = await func();
   console.log(result);
}*/

const state = {
   events: []
}

// get events
async function getEvents(){
   const response = await fetch(`${baseURL}/events`);
   const json = await response.json();

   if(!json.success) {
      throw new Error(json.error);
   }
   //console.log(result.data);

  state.events = [...json.data];

  render();
}

//get single event
async function getEvent(id){
   const response = await fetch(`${baseURL}/events/${id}` , {
      method: "GET",
      headers:{
         "Content-Type": "application/json"
      },
      body: JSON.stringify(id)
   });

   const json = await response.json();

   if(!json.success) {
      throw new Error(json.error.message);
 }
 state.events = [...json.data];

}

//update event
async function updateEvent(id, party){
   const response = await fetch(`${baseURL}/events/${id}` , {
      method: "PUT",
      headers:{
         "Content-Type": "application/json"
      },
      body: JSON.stringify(party)
   });
   const json = await response.json();
   console.log(json);
   if(!json.success) {
     throw new Error(json.error.message);
}
state.events = [...json.data];
}


const buttonRef = document.querySelectorAll('.btn');
console.log(buttonRef);

async function createEvent(party){
   const response = await fetch(`${baseURL}/events` , {
      method: "POST",
      headers:{
         "Content-Type": "application/json"
      },
      body: JSON.stringify(party)
   });
   const json = await response.json();
   console.log(json);
   if(!json.success) {
     throw new Error(json.error.message);
   }
   state.events = [...json.data];
}

function addEventToScreen(r) {
   const eventsElement = document.getElementById('events');
   const elem = document.createElement('div');

   const nameElem = document.createElement('div');
   nameElem.append(r.name)

   const descriptionElem = document.createElement('div');
   descriptionElem.append(r.description)

   const dateElem = document.createElement('div');
   dateElem.append(r.date)

   const locationElem = document.createElement('div');
   locationElem.append(r.location)

   const deleteElem = document.createElement('button');
   const buttonText = document.createTextNode('Delete');
   deleteElem.append(buttonText);

   deleteElem.addEventListener('click', async(event, id) => {
      const selectedParty = event.target.closest(id);
      selectedParty.deleteEvent(id);
      //const result = await deleteEvent(id);  
   })

   /*const buttonArray = Array.from(buttonRef);

buttonArray.forEach((btn) => {
   btn.addEventListener('click', (event)=>{
      const selectedPartyCard = event.target.closest('.card');
      selectedPartyCard.remove();
   });
});*/

   
   elem.append(nameElem);
   elem.append(descriptionElem);
   elem.append(dateElem);
   elem.append(locationElem);
   elem.append(deleteElem);

   eventsElement.append(elem);
}

document.addEventListener('DOMContentLoaded', async () => {
   const events = await getEvents();

   state.events.forEach(r => {
     addEventToScreen(r);
});

   const form = document.getElementById('eventForm');
   form.addEventListener("submit", async (event) => {
      event.preventDefault();

   
   const eventName = document.getElementById('eventName');
   const eventDescription = document.getElementById('description');
   const dateTime = document.getElementById('date-time');
   const eventLocation = document.getElementById('location');
   const date = new Date(dateTime.value);

   const party = {
      name: eventName.value,
      description: eventDescription.value,
      date: date.toISOString(),
      location: eventLocation.value
   };
   
   try{
      const newEvent = await createEvent(party);
      addEventToScreen(newEvent);
   } catch(err){
      console.error(err);
   }
   })
});

function render(){
   state.events.forEach((r)=>{
      addEventToScreen(r);
   });
}

//delete event
async function deleteEvent(id){
   const response = await fetch(`${baseURL}/events/${id}`,{
      method: 'delete',
      headers:{
         "Content-Type": "application/json"
      },
      body: JSON.stringify(party)
   });
   if(response.status === 204) {
      return true;
   }
   throw new Error(`unable to remove event with id ${id}`);
}



