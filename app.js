let Alert = document.querySelector(".alert");
let Entry = document.querySelector("#input-entery");
let Submit = document.querySelector(".submit");
let Todos = document.querySelector(".todos");
let ClearItems = document.querySelector(".clear");
let Form = document.querySelector(".header");
let Container = document.querySelector(".groceries-container");

let editCheck = false;
let editId = "";
let editElement;

// FORM SECTIONS

Form.addEventListener("submit", (e) => {
  e.preventDefault();
  let value = Entry.value;

  let id = Math.floor(Math.random() * 1000000000);

  if (value && !editCheck) {
    CreateListItem(id, value);

    Container.classList.add("show-groceries-container");

    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editCheck) {
    editElement.innerHTML = value;
    DisplayAlert("Value Changed", "success");

    editLocalStorage(editId, value);
    setBackToDefault();
  } else {
    DisplayAlert("Please Enter Value", "danger");
  }

  Entry.value = "";
});

//  ALERT FUNTION

function DisplayAlert(text, action) {
  Alert.textContent = text;
  Alert.classList.add(`${action}`);

  setTimeout(function () {
    Alert.textContent = "";
    Alert.classList.remove(`${action}`);
  }, 1000);
}

// CREATE LIST ITEM

function CreateListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("items-list");

  const attr = document.createAttribute("data-id");
  attr.value = id;

  element.setAttributeNode(attr);
  element.innerHTML = `
        <div class="item">
            <p>${value}</p>
        </div>
        <div class="item-controls">

             <div class="edit-btn">                  
                 <button class="edit-btn"><i class="fa-regular fa-pen-to-square"></i></button>
             </div>

             <div class="delete-btn"">                
                 <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
             </div>

        </div>`;

  // EDIT AND DELETE SECTION

  // Delete

  let DeleteItem = element.querySelector(".delete-btn");
  let EditItem = element.querySelector(".edit-btn");

  DeleteItem.addEventListener("click", (e) => {
    let deleteElement = e.currentTarget.parentElement.parentElement;
    const id = deleteElement.dataset.id;

    Todos.removeChild(deleteElement);

    if (Todos.children.length === 0) {
      Container.classList.remove("show-groceries-container");
    }

    DisplayAlert("Item Removed", "danger");

    setBackToDefault();

    deleteFromLocalStorage(id);
  });

  // Edit

  EditItem.addEventListener("click", (e) => {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    Entry.value = editElement.textContent.trim();
    editCheck = true;
    editId = element.dataset.id;
    Submit.textContent = "edit";
  });

  Todos.insertBefore(element, Todos.firstChild);
  DisplayAlert("Item Added To The List", "success");
}

// STORAGE FUNTION

// ADD
function addToLocalStorage(id, value) {
  const entries = { id, value };
  let items = getLocalStorage();
  items.push(entries);
  localStorage.setItem("entity", JSON.stringify(items));
}

// REMOVE
function deleteFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== +id) {
      return item;
    }
  });

  localStorage.setItem("entity", JSON.stringify(items));
}

// EDIT
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map((item) => {
    if (item.id === +id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("entity", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("entity")
    ? JSON.parse(localStorage.getItem("entity"))
    : [];
}

// CLEAR ALL ITEMS

ClearItems.addEventListener("click", () => {
  if (Todos.children.length > 0) {
    let ItemLists = document.querySelectorAll(".items-list");
    ItemLists.forEach((item) => {
      Todos.removeChild(item);
    });
  }
  Container.classList.remove("show-groceries-container");
  DisplayAlert("Empty List", "danger");

  localStorage.removeItem("entity");
  setBackToDefault();
});

// DEFAULT FUNCTION

function setBackToDefault() {
  Entry.value = "";
  editCheck = false;
  Submit.textContent = "Submit";
}

// UI DISPLAY

window.addEventListener("load", () => {
  UIsetUpItems() 
  DisplayAlert("", "success");
});


function UIsetUpItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      CreateListItem(item.id, item.value);
    });
    Container.classList.add("show-groceries-container");
  }
}
