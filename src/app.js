const API_URL = "https://api.openai.com/v1/completions";

const form = document.getElementById("getInfoForm");
const language = document.getElementById("language");
const role = document.getElementById("role");
const list = document.getElementById("newNameList");
const apiKeyInput = document.getElementById("apiKeyInput");
const apiBtn =document.getElementById("saveApiBtn");

//api 호출
function getName(prompt) {
  const KEY = apiKeyInput.value;

  fetch(API_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      max_tokens: 50,
      temperature: 0,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result && result.choices && result.choices.length > 0) {
        setNameList(result.choices[0].text);
      } else {
        printErrorMessage("ApiErr");
      }
    })
    .catch((error) => console.log(error.message.waring));
}

//에러 출력
function printErrorMessage(errType){
    deleteResultList();
    const span = document.createElement("span");

    (errType == "ApiErr")?
    (span.innerText = "😢잘못된 요청입니다😢\n 입력된 API 키를 다시 확인하시거나 API 키의 유효기간과 사용량을 확인해주세요."):
    (span.innerText = "🙇‍♀️언어와 역할을 모두 입력해주세요🙇‍♀️")

    list.appendChild(span);
    span.id = "errMsg";
}

//받아온 이름들 분리
function setNameList(e) {
  let namesWords = e.split(/\n\d+\.\s+/);
  ``;
  printNameList(namesWords);
}

//결과 리스트 삭제
function deleteResultList() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

//이름 리스트 출력
function printNameList(arr) {
  arr.slice(1).forEach((value) => {
    const li = document.createElement("li");
    li.innerText = value;
    list.appendChild(li);
    li.id = "nameList";
  });
}
function checkInput(){
    return (language.value.trim() != "") && (role.value.trim() != "")
}

//이름 생성 버튼
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if(checkInput()){
    deleteResultList();
    const buttonValue = e.submitter.value;
    const prompt = `Make 5 ${buttonValue} names in English. language is ${language.value}, the ${buttonValue}'s role is ${role.value}.`;
    getName(prompt); 
  }
  else{
    printErrorMessage("inputErr");
  }
});

//키 저장
function saveApikey(apiKey) {
  localStorage.setItem("apiKey", apiKey);
}

//api 확인 버튼
apiBtn.addEventListener("click", function () {
  const apiKey = apiKeyInput.value;
  saveApikey(apiKey);
});

//키 가져오기
function getApiKeyFromLocalStorage() {
  return localStorage.getItem("apiKey");
}

//페이지 로드(로컬스토리지에 키 있을 때)
window.addEventListener("load", function () {
  const savedApiKey = getApiKeyFromLocalStorage();
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
  }
});
