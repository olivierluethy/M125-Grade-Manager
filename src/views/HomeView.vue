<template>
  <div class="home">
    <h1>Grade-Manager</h1>

    <div class="grid-container">
      <div v-for="(grades, subject) in subjects">
        <h1>{{ subject }}</h1><br>
        <div class="marks">
          <div v-for="grade in grades.mark">
          <div class="mark">
            <p>{{ grade }}</p>
            <button class="deleteGrade" title="Delete Grade" @click="removeMark(subject, grade)">X</button>
          </div>
        </div>
        </div>
        <p v-if="grades.average">
          Average Ø:
          <span v-if="grades.average >= 4" style="color: green; font-weight: bold;">
            {{ parseFloat(grades.average).toFixed(2) }}
          </span>
          <span v-if="grades.average < 4" style="color: red; font-weight: bold;">
            {{ parseFloat(grades.average).toFixed(2) }}
          </span>
        </p>
        <p v-else-if="grades.average && grades.average < 4" style="color: red">
          Average Ø: {{ parseFloat(grades.average).toFixed(2) }}
        </p>
        <input type="number" min="1" max="6" class="inputForMark" v-on:keyup.enter="addMark(subject, $event.target)" placeholder="Enter New Grade"/>
      </div>
      <div class="nameOfSubject">
        <input type="text" v-on:keyup.enter="addSubject()" v-model="newSubject" placeholder="Name Of Grade"/>
      </div>
      <button class="addNewGrade" title="Add New Grade" @click="showInput()">+</button>
    </div>
    <p class="averageOfAllSubjects" v-if="getAverageOfAllSubjects()">
      Average Of All Subjects 
      <span v-if="getAverageOfAllSubjects() >= 4" style="color: green">
        {{ parseFloat(roundHalf(getAverageOfAllSubjects())).toFixed(2) }}
      </span>
      <span v-else-if="getAverageOfAllSubjects() < 4" style="color: red">
        {{ parseFloat(roundHalf(getAverageOfAllSubjects())).toFixed(2) }}
      </span>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'HomeView',
  setup: function(){
    /* To add new subject */
    var newSubject = ref("");
    /* To add new mark */
    var newMark = ref("");
    /* Get total marks of one subject */
    var totalMarks = 0;
    /* Get amount of marks of one subject */
    var calculMarks = 0;
    /* To store average of one subject */
    var average = 0;
    /* Get total of all marks */
    var totalOfAllMarks = 0;
    /* Get amount of all marks */
    var calculAllMarks = 0;
    /* To show subject */
    var subjects = ref({
      "GES": {
        mark: [],
        average: 0,
      },
      "M146": {
        mark: [],
        average: 0,
      },
      "M151": {
        mark: [],
        average: 0,
      },
      "M152": {
        mark: [],
        average: 0,
      },
      "M153": {
        mark: [],
        average: 0,
      },
      "M306": {
        mark: [],
        average: 0,
      },
      "NWS": {
        mark: [],
        average: 0,
      },
      "SPK": {
        mark: [],
        average: 0,
      },
      "WUR": {
        mark: [],
        average: 0,
      },
    })
    /* Funktion um Note hinzuzufügen */
    function addMark(subject, inputField){
      let grade = inputField.value;
      calculMarks = 0;
      totalMarks = 0;
      if(grade < 1 || grade > 6){
        alert("Please enter a valid grade!");
      }else{
        grade = Math.round(grade * 100) / 100;
        subjects.value[subject].mark.push(grade);

        for (let i = 0; i < subjects.value[subject].mark.length; i++) {
          calculMarks += subjects.value[subject].mark[i];
          totalMarks++;
        }
        average = calculMarks / totalMarks;
        subjects.value[subject].average = average;

        inputField.value = "";
      }
    }
    function getAverageOfAllSubjects(){
      totalOfAllMarks = 0;
      calculAllMarks = 0;
      for(let subject in subjects.value){
        for(let mark of subjects.value[subject].mark){
          totalOfAllMarks += mark;
          calculAllMarks++;
        }
      }
      return totalOfAllMarks / calculAllMarks;
    }
    /* Funktion um Note zu löschen */
    function removeMark(subject, grade){
      calculMarks = 0;
      totalMarks = 0;
      const index = subjects.value[subject].mark.indexOf(grade);
      subjects.value[subject].mark.splice(index, 1);
      for (let i = 0; i < subjects.value[subject].mark.length; i++) {
          calculMarks += subjects.value[subject].mark[i];
          totalMarks++;
      }
      average = calculMarks / totalMarks;
      subjects.value[subject].average = average;
    }
    /* Inputfeld anzeigen um ein neues Fach hinzuzufügen */
    function showInput(){
      document.querySelector(".nameOfSubject").style.display="block";
    }
    /* Neues Fach in Liste hinzufügen */
    function addSubject(){
      if(newSubject.value.length < 1){
        alert("Please Enter A Valid Grade!");
      }else if(!isNaN(newSubject.value)){
        alert("Please enter a subject-name not a number!");
      }else{
        subjects.value[newSubject.value]={
          mark: [],
          average: 0,
        }
        newSubject.value ="";
        document.querySelector(".nameOfSubject").style.display="none";
      }
    }
    function roundHalf(num) {
      return Math.round(num*2)/2;
    }
    return {
      /* Für Durchschnitt */
      average,
      totalMarks,
      calculMarks,
      newMark,
      newSubject,
      subjects,
      totalOfAllMarks,
      calculAllMarks,
      roundHalf,
      addSubject,
      removeMark,
      showInput,
      addMark,
      getAverageOfAllSubjects
    }
  }
}
</script>