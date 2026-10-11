// ---------- Select elements ----------
const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const category = document.querySelector("#note-category");
const list = document.querySelector("#notes-list");
const count = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

// ---------- Storage key ----------
const STORAGE_KEY = "quicknotes-notes";

// ---------- Load notes ----------
function loadNotes() {
  const savedNotes = localStorage.getItem(STORAGE_KEY);

  return savedNotes ? JSON.parse(savedNotes) : [];
}

// ---------- Notes array ----------
let notes = loadNotes();

// ---------- Save notes ----------
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
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

// ---------- Render notes ----------
function render(notesToDisplay = notes) {
  list.innerHTML = "";

  if (notesToDisplay.length === 0 && searchInput.value.trim() !== "") {
    const message = document.createElement("li");
    message.textContent = "No notes match your search.";
    list.appendChild(message);

    updateCount();
    return;
  }

  notesToDisplay.forEach((note) => {
    const li = document.createElement("li");

    li.classList.add("note-card");
    li.classList.add(`category-${note.category}`);

    // Note text
    const text = document.createElement("p");
    text.classList.add("note-text");
    text.textContent = note.text;

    // Category
    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("note-category");
    categoryLabel.textContent = note.category;

    // Date
    const date = document.createElement("p");
    date.textContent = `Created: ${note.createdAt}`;

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    deleteButton.addEventListener("click", () => {
      deleteNote(note.id);
    });

    // Add elements to card
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

  saveNotes();
  render();

  input.value = "";
  input.focus();
}

// ---------- Delete a note ----------
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);

  saveNotes();
  render();
}

// ---------- Form submit ----------
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  const selectedCategory = category.value;

  // Validate empty note
  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  // Validate character limit
  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  // Clear error
  errorMessage.textContent = "";

  addNote(text, selectedCategory);
});

// ---------- Search ----------
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm),
  );

  render(filteredNotes);
});

// ---------- Initial render ----------
render();
