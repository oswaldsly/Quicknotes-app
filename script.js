// ---------- Select elements ----------
const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const category = document.querySelector("#note-category");
const list = document.querySelector("#notes-list");
const count = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

// ---------- Notes array ----------
let notes = [];

// ---------- Render notes ----------
function render(notesToDisplay = notes) {
  list.innerHTML = "";

  notesToDisplay.forEach((note) => {
    const li = document.createElement("li");
    li.classList.add("note-card");
    li.classList.add(`category-${note.category}`);

    const text = document.createElement("p");
    text.classList.add("note-text");
    text.textContent = note.text;

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("note-category");
    categoryLabel.textContent = note.category;

    const date = document.createElement("p");
    date.textContent = `Created: ${note.createdAt}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    deleteButton.addEventListener("click", () => {
      deleteNote(note.id);
    });

    li.appendChild(text);
    li.appendChild(categoryLabel);
    li.appendChild(date);
    li.appendChild(deleteButton);

    list.appendChild(li);
  });

  updateCount();
}

// ---------- Add a note ----------
function addNote(text, selectedCategory) {
  const note = {
    id: Date.now(),
    text: text,
    category: selectedCategory,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(note);
  render();

  input.value = "";
  input.focus();
}

// ---------- Delete a note ----------
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  render();
}

// ---------- Update note count ----------
function updateCount() {
  if (notes.length === 0) {
    count.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    count.textContent = "You have 1 note.";
  } else {
    count.textContent = `You have ${notes.length} notes.`;
  }
}

// ---------- Form submit ----------
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  const selectedCategory = category.value;

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";

  addNote(text, selectedCategory);
});
