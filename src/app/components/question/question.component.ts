import {Component, OnInit} from '@angular/core';
import {QuestionsService} from "../../services/questions.service";
import {interval} from "rxjs";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  userName: string | null = ''
  questionList: any = [];
  currentQuestion: number = 0
  points: number = 0;
  counter = 60
  correctAnswer: number = 0;
  incorrectAnswer: number = 0;
  interval$: any;
  progress: number = 0
  isQuizCompleted: boolean = false

  constructor(private questionsApi: QuestionsService) {
  }

  ngOnInit() {
    this.userName = localStorage.getItem("name")
    this.getAllQuestion();
    this.startCounter()
  }

  getAllQuestion() {
    this.questionsApi.getQuestionsJson()
      .subscribe(res => {
        this.questionList = res.questions;
      });
  }

  nextQuestion() {
    this.currentQuestion++
  }

  prevQuestion() {
    this.currentQuestion--
  }

  answer(current: number, option: any) {
    if (option.correct) {
      this.points += 10;
      this.correctAnswer++
      setTimeout(() => {
        this.currentQuestion++
        this.getProgressPercent()
      }, 1000)
    } else {
      this.points -= 10;
      setTimeout(() => {
        this.incorrectAnswer++
        this.currentQuestion++
        this.resetCounter();
        this.getProgressPercent()
      }, 1000)
    }

    if (current == this.questionList.length) {
      this.isQuizCompleted = true;
      this.stopCounter();
    }
  }

  startCounter() {
    this.interval$ = interval(1000)
      .subscribe(val => {
        this.counter--;
        if (this.counter == 0) {
          this.currentQuestion++;
          this.points -= 10;
          this.counter = 60
        }
      });

    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000)
  }

  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }

  resetCounter() {
    this.stopCounter();
    this.counter = 60
    this.startCounter()
  }

  resetQuiz() {
    this.resetCounter();
    this.getAllQuestion();
    this.currentQuestion = 0
    this.counter = 60
    this.progress = 0
  }

  getProgressPercent() {
    this.progress = (this.currentQuestion / this.questionList.length) * 100
    console.log(this.progress)
    return this.progress;
  }



}
