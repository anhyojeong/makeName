let ApiKey = "";
//const testApiKey= config.APIKEY;
const API_URL = "https://api.openai.com/v1/completions";

const form = document.getElementById("getInfoForm");
const language = document.getElementById("language");
const role = document.getElementById("role");
const list = document.getElementById("newNameList");
const ApiKeyBtn = document.getElementById("submitApiKeyBtn");
const apiKeyInput = document.getElementById("apiKeyInput");
const keyArea = document.getElementById('keyArea');

//api 호출
function getName(prompt){
    fetch(API_URL,{
        method : "post",
        headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${ApiKey}`
        },
        body:JSON.stringify({
            model: "gpt-3.5-turbo",
            prompt: prompt,
          }),
    })
    .then((response) => response.json())
    .then((result) => {
        if (result && result.choices && result.choices.length > 0) {
            setNameList(result.choices[0].text);
        } else {
            alert("요청이 유효하지않습니다.\n1. 입력된 API 키를 다시 확인해주세요.\n2. API 키의 유효기간과 사용량을 확인해주세요.");
        }
    })
    .catch((error) => console.log(error.message));
}

//받아온 이름들 분리
function setNameList(e){
    let namesWords = e.split((/\n\d+\.\s+/));
    printNameList(namesWords);
}

//이름 리스트 삭제
function deleteNameList(){
    while(list.firstChild){
        list.removeChild(list.firstChild);
    }
}

//이름 리스트 출력
function printNameList(arr){
    arr.slice(1).forEach(value => {
        const li = document.createElement("li");
        li.innerText = value;
        list.appendChild(li);
        li.id="nameList";
    })
}
//키 저장
function saveApiKey(apiKey) {
    localStorage.setItem("APIKEY", apiKey);
}

//키 불러오기
function loadApiKey() {
    ApiKey = localStorage.getItem("APIKEY");
    return ApiKey;
}

//로딩 시 저장된 키 있는지 확인+채움
window.addEventListener("load", function () {
    const savedApiKey = loadApiKey();
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
});

//키 확인 버튼 클릭
ApiKeyBtn.addEventListener("click", function () {
    const apiKey = apiKeyInput.value.trim(); // 공백 제거

    keyArea.classList.add('hidden');
    getInfoForm.classList.remove('hidden');

    if (apiKey) {
        saveApiKey(apiKey);
        apiKeyInput.value = apiKey; // 입력 필드에 저장된 API 키 표시
        alert("API 키가 저장되었습니다.");
    }

});

//이름 생성 버튼
form.addEventListener("submit", function (e) {
    e.preventDefault();
    deleteNameList();
    const buttonValue = e.submitter.value;
    const prompt = `${buttonValue} 이름을 5가지 생성해줘. 언어는 "${language.value}", 역할은 " ${role.value}".`;
    getName(prompt);
});
