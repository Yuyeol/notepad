// delete완료, li클릭시 메모 불러오기 가능하게 만들기

const textarea = document.querySelector(".js-textarea"),
  inputTitle = document.querySelector(".js-inputTitle"),
  form = document.querySelector("form"),
  memoList = document.querySelector(".js-memoList"),
  addBtn = document.querySelector(".js-add"),
  editBtn = document.querySelector(".js-edit");

const MEMO = "memo";

let memo = [];

const isEmpty = (value) => {
  if (typeof value == "undefined") return true;
  else return false;
};

const uploadMemo = (event) => {
  const file = event.target.files[0];
  if (!isEmpty(file)) {
    const fileName = file.name.slice(0, [-4]);
    inputTitle.value = fileName;
    const reader = new FileReader();
    reader.onload = (e) => {
      textarea.value = e.target.result;
    };
    reader.readAsText(file, "euc-kr");
  }
  addBtn.style.display = "block";
  editBtn.style.display = "none";
};

const addElement = (title, id) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("span");
  span.innerText = title;
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteMemo);
  li.appendChild(span);
  li.appendChild(delBtn);
  li.id = id;
  span.addEventListener("click", selectTitle);
  memoList.appendChild(li);
};

const addMemo = (title, contents) => {
  const id = memo.length + 1;
  const memoObj = {
    id: id,
    title: title,
    contents: contents,
  };
  memo.push(memoObj);
  addElement(title, id);
  saveMemo();
};

const editMemo = (title, contents) => {
  memo[form.id - 1].title = title;
  memo[form.id - 1].contents = contents;
  console.log(memo[form.id - 1]);
  saveMemo();
  location.reload(true);
};

const loadMemo = () => {
  const loadedMemo = localStorage.getItem(MEMO);
  if (loadedMemo !== null) {
    parsedMemo = JSON.parse(loadedMemo);
    parsedMemo.forEach((memo) => addMemo(memo.title, memo.contents));
  }
};

const saveMemo = () => localStorage.setItem(MEMO, JSON.stringify(memo));

const handleSubmit = (event) => {
  event.preventDefault();
  const btn = event.submitter.value;
  const title = event.target[2].value;
  const contents = event.target[3].value;
  if (btn == "추가") {
    addMemo(title, contents);
  } else {
    editMemo(title, contents);
  }
  inputTitle.value = "";
  textarea.value = "";
};

const selectTitle = (event) => {
  const selectedId = event.path[1].id;
  if (selectedId) {
    title = memo[selectedId - 1].title;
    contents = memo[selectedId - 1].contents;
    form.id = selectedId;
    inputTitle.value = title;
    textarea.value = contents;
    addBtn.style.display = "none";
    editBtn.style.display = "block";
  }
};

const deleteMemo = (event) => {
  console.log(event);
  const li = event.target.parentNode;
  memoList.removeChild(li);
  const refreshMemo = memo.filter((memo) => memo.id !== parseInt(li.id));
  memo = refreshMemo;
  saveMemo();
  location.reload(true);
};

const init = () => {
  addBtn.style.display = "block";
  editBtn.style.display = "none";
  loadMemo();
  form.addEventListener("submit", handleSubmit);
};

init();
