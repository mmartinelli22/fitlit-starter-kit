///*~~~~~~~~Imports from Other Files~~~~~~~~*/
import { getUserDataFromAPI, getSleepDataFromAPI, getHydrationDataFromAPI } from './apiCalls.js';
import './css/styles.css';
import HydrationRepository from './HydrationRepository.js';
import UserRepository from './UserRepository';
import SleepRepository from './SleepRepository';

///*~~~~~~~~Global Variables~~~~~~~*/
var userRepo;
var hydrationRepo;
var sleepRepo;

const getRandomID = () => {
  return Math.floor(Math.random() * 50) + 1;
};

const userId = getRandomID();

getUserDataFromAPI().then(res => {
  setUserData(res.userData);
  const thisUser = getUserData();
  userBuildAttributes(thisUser);
});

getHydrationDataFromAPI().then(res => {
  setHydrationData(res.hydrationData);
  hydrationBuildAttributes(hydrationRepo);
});

getSleepDataFromAPI().then((res) => {
  setSleepData(res.sleepData);
  sleepBuildAttributes(sleepRepo);
});

const setUserData = (someData) => {
  userRepo = new UserRepository(someData);
};

const setHydrationData = (someData) => {
  hydrationRepo = new HydrationRepository(someData)
};

const setSleepData = (someData) => {
  sleepRepo = new SleepRepository(someData);
};

///*~~~~~~~~QUERY SELECTORS~~~~~~~*/
var userGreeting = document.querySelector("#userGreeting");
var emailAddress = document.querySelector("#emailAddress");
var stepGoal = document.querySelector("#stepGoal");
var friends = document.querySelector('#friends');
var address = document.querySelector('#address');
var strideLength = document.querySelector('#strideLength');
var averageUserGoal = document.querySelector('#averageStepGoal');
var userWaterDay = document.querySelector('#userWaterPerDay');
var userName = document.querySelector('#userName');
var hydrationDay1 = document.querySelector('#hydrationDay1');
var hydrationDay2 = document.querySelector('#hydrationDay2');
var hydrationDay3 = document.querySelector('#hydrationDay3');
var hydrationDay4 = document.querySelector('#hydrationDay4');
var hydrationDay5 = document.querySelector('#hydrationDay5');
var hydrationDay6 = document.querySelector('#hydrationDay6');
var hydrationDay7 = document.querySelector('#hydrationDay7');
var userSleepPerDay = document.querySelector('#UserSleepPerDay');
var userSleepAllTime = document.querySelector('#userSleepAllTime');
var sleepDay1 = document.querySelector('#sleepDay1');
var sleepDay2 = document.querySelector('#sleepDay2');
var sleepDay3 = document.querySelector('#sleepDay3');
var sleepDay4 = document.querySelector('#sleepDay4');
var sleepDay5 = document.querySelector('#sleepDay5');
var sleepDay6 = document.querySelector('#sleepDay6');
var sleepDay7 = document.querySelector('#sleepDay7');

var hydrationDayHTMLCollection = [
  hydrationDay1,
  hydrationDay2,
  hydrationDay3,
  hydrationDay4,
  hydrationDay5,
  hydrationDay6,
  hydrationDay7
];

var sleepDayHTMLCollection = [
  sleepDay1,
  sleepDay2,
  sleepDay3,
  sleepDay4,
  sleepDay5,
  sleepDay6,
  sleepDay7,
];

//*~~~~~~~~Functions~~~~~~~*//
function getUserData() {
  var thisUser = userRepo.getUserById(userId);
  return thisUser;
};

const userBuildAttributes = (user) => {
  userName.innerHTML = `<span class="user-property-names">Name:</span> ${user.name}`;
  emailAddress.innerHTML = `<span class="user-property-names">Email:</span> ${user.email}`;
  stepGoal.innerHTML = `<span class="user-property-names">Your step goal:</span> ${user.dailyStepGoal} steps per day`;
  friends.innerHTML = `<span class="user-property-names">Friends:</span> ${user.friends.map(num => ' ' + userRepo.users.find(user => user.id === num).name)}`;
  address.innerHTML = `<span class="user-property-names">Address:</span> ${user.address}`;
  strideLength.innerHTML = `<span class="user-property-names">Stride Length:</span> ${user.strideLength} feet`;
  userGreeting.innerHTML = `Welcome ${user.name.split(" ")[0]}!`;
  averageUserGoal.innerHTML = `The average fitlit user's goal is ${userRepo.getAverageSteps()} steps.`;
};

const formatHydrationData = () => {
  const userHydrationDataPerWeek = hydrationRepo.getUserHydrationPerWeek(userId, "2020/01/22");
  const formattedData = userHydrationDataPerWeek.map(hydrationData => {
    return `${hydrationData.date}: ${hydrationData.ounces} ounces`;
  });
  hydrationDayHTMLCollection.forEach((dayElem, index) => {
    dayElem.innerText = `${formattedData[index]}`
  });
};

const hydrationBuildAttributes = (hydrationRepoParam) => {
  userWaterDay.innerHTML = `<p>You've drank ${hydrationRepoParam.getUserHydrationForDay(userId, "2020/01/22")} ounces of water today.</p>`;
  formatHydrationData();
}

const sleepBuildAttributes = (sleepRepoParam) => {
  userSleepPerDay.innerHTML = `<p>You got ${sleepRepoParam.getSleepDataByDate('2020/01/22', 'hoursSlept', userId)} hours sleep today 
  with ${sleepRepoParam.getSleepDataByDate('2020/01/22', 'sleepQuality', userId)}/5 sleep quality.</p>`;
  formatSleepData();
  userSleepAllTime.innerHTML = `<p>On average, you sleep ${sleepRepoParam.getAverageSleepHoursForUserAllTime(userId).toFixed(2)} hours a night with an average sleep quality of ${sleepRepoParam.getAverageSleepQualityForUserAllTime(userId).toFixed(2)}/5.</p>`
};

const formatSleepData = () => {
	const userSleepHoursPerWeek = sleepRepo.getUsersSleepDataPerWeek(userId,'2020/01/22','hoursSlept');
  const userSleepQualityPerWeek = sleepRepo.getUsersSleepDataPerWeek(userId,'2020/01/22','sleepQuality');
	const formattedHours = userSleepHoursPerWeek.map((hours) => {
		return `${hours.hoursSlept}`;
	});
  const formattedQuality = userSleepQualityPerWeek.map((quality) => {
		return `${quality.sleepQuality}`;
	});
	sleepDayHTMLCollection.forEach((dayElem, index) => {
		dayElem.innerText = `${userSleepHoursPerWeek[index].date} : ${formattedHours[index]} hours, ${formattedQuality[index]}/5 sleep quality`;
	});
}
