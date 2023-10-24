import { key } from "./key.js";

const form = document.getElementById("getInfoForm");
const language = document.getElementById("language");
const role = document.getElementById("role");
const list = document.getElementById("newNameList");
const apiKeyInput = document.getElementById("apiKeyInput");
const apiBtn = document.getElementById("saveApiBtn");
const saveApiMsg = document.getElementById("saveApiMsg");

// api 호출 관련
const API_URL = "https://api.openai.com/v1/completions";
const API_MODEL = "text-davinci-003";
let KEY = apiKeyInput.value;
let API_prompt = "";

// 사용횟수제한
let count = 0;

// 요청할 때 쓰는 Body
function requestData() {
  const body = {
    model: API_MODEL,
    prompt: API_prompt,
    max_tokens: 50,
    temperature: 0,
    top_p: 0.8,
    n: 1,
    stream: false,
    logprobs: null,
  };

  return body;
}

// api 호출
function getName() {
  const loadingDiv = document.getElementById("loading");
  loadingDiv.style.display = "block";

  const body = requestData(); // body

  fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((result) => {
      // 요청이 완료된 후 로딩 화면 숨김
      loadingDiv.style.display = "none";
      if (result && result.choices && result.choices.length > 0) {
        setNameList(result.choices[0].text); // api 요청 결과 보여주기
      } else {
        printErrorMessage("apiErr"); // api 요청 에러 처리
      }
    })
    .catch((error) => console.log(error.message.warning));
}

// 에러 출력
function printErrorMessage(errType) {
  deleteResultList();

  const span = document.createElement("span");
  const err = errType;

  switch (err) {
    case "apiErr":
      span.innerText =
        "😢잘못된 요청입니다😢\n 입력된 API 키를 다시 확인하시거나 API 키의 유효기간과 사용량을 확인해주세요.";
      break;
    case "inputErr":
      span.innerText = "🙇‍♀️사용 언어와 역할을 모두 입력해주세요🙇‍♀️";
      break;
    case "countErr":
      span.innerText =
        "🙇‍♀️죄송합니다. 이름 생성 횟수(총 3회)를 초과하였습니다.🙇‍♀️";
      break;
    default:
  }

  list.appendChild(span);
  span.class = "msg";
}

// 받아온 이름들 분리
function setNameList(e) {
  let namesWords = e.split(/\n\d+\.\s+/);
  printNameList(namesWords);
}

// 결과 리스트 삭제
function deleteResultList() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

// 결과 리스트 출력
function printNameList(arr) {
  arr.slice(1).forEach((value) => {
    const li = document.createElement("li");
    li.innerText = value;
    list.appendChild(li);
    li.id = "nameList";
  });
}

// 사용언어, 역할 입력 확인
function checkInput() {
  return language.value.trim() != "" && role.value.trim() != "";
}

// 이름 생성 버튼
form.addEventListener("submit", function (e) {
  e.preventDefault();
  count = getAtLocalStorage("count");
  if (count < 3) { // 3번까지 이름생성가능
    if (checkInput()) { // 사용언어, 역할 둘 다 입력됐을 때
      deleteResultList();
      const buttonValue = e.submitter.value;
      API_prompt = `When developing in ${language.value} language, show examples of 5 commonly used ${buttonValue} names in English. The ${buttonValue} represents ${role.value}.`;
      count++;
      getName(); // api 요청 보내기
      saveAtLocalStorage(count);
    } else { // 사용 언어, 역할 입력 오류
      printErrorMessage("inputErr");
    }
  } else { // 횟수 초과 
    printErrorMessage("countErr");
  }
});

// 로컬스토리지에 taget을 key으로 저장
function saveAtLocalStorage(target) {
  target.length === undefined
    ? localStorage.setItem("count", target)
    : localStorage.setItem("apiKey", target);
}

// 로컬스토리지에서 target를 key 값으로 불러오기
function getAtLocalStorage(target) {
  return localStorage.getItem(`${target}`);
}

// 파이어베이스에 저장되어있는 apiKey 받아오기
async function getKey() {
  try {
    const data = await key();
    KEY = data[0].key;
  } catch (error) {
    saveApiMsg.innerText ="Key값 가져오기 오류\n" + error;
  }
}

// 저장버튼 눌렀을 때 firebase에서 api 키 받아오기
// 받아오거나 입력한 키는 로컬스토리지에 저장
apiBtn.addEventListener("click", function () {
  const apiKey = apiKeyInput.value;
  if (apiKey == "test") {
    getKey();
  }
  saveAtLocalStorage(apiKey);
  saveApiMsg.innerText ="api Key값을 로컬스토리지에 저장하였습니다.";
});

// 페이지 로드 될 때
// 로컬스토리지에서 apiKey, count 불러오기
window.addEventListener("load", function () {
  const savedApiKey = getAtLocalStorage("apiKey");
  count = getAtLocalStorage("count");
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
  }
});
