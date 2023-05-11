const APIKEY = config.APIKEY;
const URL = "https://api.openai.com/v1/engines/davinci-codex";

const form = document.getElementById("getInfo-form");
const lang = document.getElementById("lang");
const role = document.getElementById("role");

//api 호출
function getName(e){
    e.preventDefault();
    const PROMPT = `${lang.value}언어를 사용한 함수의 이름을 생성하려 합니다. 함수의 역할은 ${role.value}입니다. 몇 가지 예시를 보여주세요.`;

    fetch("https://api.openai.com/v1/completions",{
        method : "post",
        headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${APIKEY}`
        },
        body:JSON.stringify({
            model: "text-davinci-003",
            prompt: PROMPT,
            max_tokens: 50,
            temperature: 0,
            top_p: 1,
            n: 1,
            stream: false,
            logprobs: null,
            //stop: "\n"
          }),
    })
    .then((response) => response.json())
    .then((result) => {
       setNameList(result.choices[0].text);
    })
    .catch((error) => console.log(error.message));
}

//이름 리스트 저장
function setNameList(e){
    let namesWords = e.split((/\n\d+\.\s+/));
    printNameList(namesWords);
}

//이름 리스트 출력
function printNameList(arr){
    const nameList = arr;
    console.log(nameList);

    const list = document.getElementById("newName");
    arr.slice(1).forEach(value => {
        const li = document.createElement("li");
        li.innerText = value;
        list.appendChild(li);
    })
}

form.addEventListener("submit",getName);
