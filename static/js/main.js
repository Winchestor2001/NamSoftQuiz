const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const sec_timer = info_box.querySelector(".sec_timer");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const option_list = document.querySelector(".option_list");
const timeCount = quiz_box.querySelector(".timer .time_sec");
const timeLine = quiz_box.querySelector("header .time_line");
const timeOff = quiz_box.querySelector("header .time_text");
const next_btn = quiz_box.querySelector(".next_btn");
const result_box = document.querySelector(".result_box");
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");
const form_name = document.querySelector("#form_name");
let questions;

const getUrl = "http://192.168.100.24:8000/quiz_api/"
const postUrl = "http://192.168.100.24:8000/post_student_score/"
const ipFinder = "https://api.ipify.org?format=json"

fetch(getUrl)
    .then((response) => response.json())
    .then((data) => questions = data);


let questins_count = 0;
let questin_counter = 1;
let counter;
let counterLine;
let timeValue = 15;
let lineWidth = 0;
let userScore = 0;
let username;
let user_ip;

let tickIcon = '<div class="icon tick bg-primary"><i class="fa-solid fa-check"></i></div>';
let crossIcon = '<div class="icon cross"><i class="fa-solid fa-xmark"></i></div>';




start_btn.onclick = () => {
  info_box.classList.add("activeInfo");
};

form_name.addEventListener('input', () => {
  if (form_name.value.length > 4) {
    document.querySelector(".buttons .restart").classList.remove('d-none');
  } else {
    document.querySelector(".buttons .restart").classList.add('d-none');
  }
});


continue_btn.onclick = () => {
  username = document.querySelector('#form_name').value
  fetch(ipFinder)
    .then((response) => response.json())
    .then((data) => user_ip = data.ip);
  info_box.classList.remove("activeInfo");
  quiz_box.classList.add("activeQuiz");
  showQuestions(0);
  QuestionCounter(1);
  startTimer(questions[0].timer);
};


next_btn.onclick = () => {
  if (questins_count < questions.length - 1) {
    questins_count++;
    questin_counter++;
    showQuestions(questins_count);
    QuestionCounter(questin_counter);
    clearInterval(counter);
    startTimer(questions[questins_count].timer);
    clearInterval(counterLine);
    next_btn.style.display = "none";
    timeOff.textContent = "Vaqt";
  } else {
    clearInterval(counter);
    clearInterval(counterLine);
    showResultBox();
  }
};

exit_btn.onclick = () => {
  info_box.classList.remove("activeInfo");
};

function showQuestions(index) {
  const question_text = document.querySelector(".quiz_text");
  let question_tag = `<span>${questions[index].id}. ${questions[index].question}</span>`;
  let option_tag = `<div class="option"><span>${
    questions[index][`option_1`]
  }</span></div>
                    <div class="option"><span>${
                      questions[index][`option_2`]
                    }</span></div>
                    <div class="option"><span>${
                      questions[index][`option_3`]
                    }</span></div>
                    <div class="option"><span>${
                      questions[index][`option_4`]
                    }</span></div>`;
  question_text.innerHTML = question_tag;
  option_list.innerHTML = option_tag;
  const option = option_list.querySelectorAll(".option");
  for (let i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this);");
  }
}


function optionSelected(answer) {
  clearInterval(counter);
  clearInterval(counterLine);
  let userAnswer = answer.textContent;
  let correct_answer = questions[questins_count].answer;
  let allOptions = option_list.children.length;
  if (userAnswer === correct_answer) {
    userScore += 1;
    // answer.classList.add("correct");
    answer.classList.add("selected_opt");
    // answer.insertAdjacentHTML("beforeend", tickIcon);
  } else {
    // answer.classList.add("incorrect");
    answer.classList.add("selected_opt");
    // answer.insertAdjacentHTML("beforeend", crossIcon);
    for (let i = 0; i < allOptions; i++) {
      if (option_list.children[i].textContent == correct_answer) {
        // option_list.children[i].setAttribute("class", "option correct");
        // option_list.children[i].setAttribute("class", "option selected_opt");
        // option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
      }
    }
  }

  for (let i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled");
  }
  next_btn.style.display = "block";
}

function showResultBox() {
  let data = {'name': username, 'score': userScore, 'ip': user_ip};
  info_box.classList.remove("activeInfo");
  quiz_box.classList.remove("activeQuiz");
  result_box.classList.add("activeResult");
  sendUserScore(data)
}

function sendUserScore(data){
  fetch(postUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time;
    time--;
    if (time < 9) {
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero;
    }
    if (time < 0) {
      clearInterval(counter);
      timeCount.textContent = `${questions[questins_count].timer}`;
      timeOff.textContent = "Vaqt Tugadi";
      let correct_answer = questions[questins_count].answer;
      let allOptions = option_list.children.length;
      for (let i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correct_answer) {
          // option_list.children[i].setAttribute("class", "option correct");
          // option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
        }
      }
      for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
      }
      next_btn.style.display = "block";
    }
  }
}

function QuestionCounter(index) {
  const bottom_question_counter = quiz_box.querySelector(".total_quiz");
  let totalQuestionsCountTag = `<span><p>${index}</p>/<p>${questions.length}</p>Savollar</span>`;
  bottom_question_counter.innerHTML = totalQuestionsCountTag;
}
