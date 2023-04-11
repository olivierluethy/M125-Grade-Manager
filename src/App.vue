<template>
  <router-view/>
</template>

<style lang="scss">
::-webkit-input-placeholder {
   text-align: center;
}
.home {
  font-family: Arial, Helvetica, sans-serif;
  h1 {
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    font-size: 3rem;
  }
  .grid-container {
    display: grid;
    grid-template-columns: auto auto auto auto;
    gap: 10px;
    background-color: #0A2463;
    padding: 10px;
    grid-template-columns: repeat(auto-fill, 20em);
    h1 {
      font-size: 2rem;
      margin-bottom: 0rem;
    }
    .inputForMark {
      width: 80%;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      resize: vertical;
      text-align: center;
      margin-bottom: 1rem;
    }
    @keyframes addSubjectInput {
      0% {
        width: 0%;
      }
      50% {
        width: 80%;
      }
      100% {
        width: 80%;
      }
    }
    .nameOfSubject{
      display: none;
      input {
        width: 80%;
        animation-duration: 1.5s;
        animation-name: addSubjectInput;
        animation-iteration-count: 1;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        resize: vertical;
        text-align: center;
        margin-top: 5rem;
        margin-bottom: 5rem;
      }
    }
    .addNewGrade {
      background-color: white;
      border: 1px solid white;
      color: black;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 2.5rem;
      margin: 76px 135px;
      transition-duration: 0.4s;
      border-radius: 30px;
      box-shadow: rgba(255, 255, 255) 0px 5px 15px;
      cursor: pointer;
      &:hover {
        background-color: black;
        border: 1px solid white;
        color: white;
      }
    }
    .marks{
      max-height: 14.42vh;
      overflow-y: auto;
      .mark {
        display: flex;
        justify-content: center;
        p {
          margin-top: 1rem;
          margin-bottom: 0rem;
        }
        .deleteGrade{
          margin-left: 1rem;
          margin-top: 1rem;
          border-radius: 50px;
          height: 5vh;
          background-color: red; /* Green */
          border: 1px solid red;
          color: white;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          transition-duration: 0.4s;
          cursor: pointer;
          &:hover {
            background-color: white; 
            color: red; 
            border: 1px solid red;
          }
        }
      }
    }
  }
  .grid-container > div {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid black;
    text-align: center;
    font-size: 30px;
  }
  .averageOfAllSubjects {
      font-size: 2rem;
      span {
        font-weight: bold;
      }
    }
}
</style>