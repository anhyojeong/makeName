const API_URL = "https://api.openai.com/v1/completions";
 
const form = document.getElementById("getInfoForm");
const language = document.getElementById("language");
const role = document.getElementById("role");
const list = document.getElementById("newNameList");
const apiKeyInput = document.getElementById("apiKeyInput");

//api 호출
function getName(prompt){
    const KEY =apiKeyInput.value;
    fetch(API_URL,{
        method : "post",
        headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${KEY}`
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
    let namesWords = e.split((/\n\d+\.\s+/));``
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

//이름 생성 버튼
form.addEventListener("submit", function (e) {
    e.preventDefault();
    deleteNameList();
    const buttonValue = e.submitter.value;
    const prompt = `${buttonValue} 이름을 5가지 생성해줘. 언어는 "${language.value}", 역할은 " ${role.value}".`;
    getName(prompt);
});
