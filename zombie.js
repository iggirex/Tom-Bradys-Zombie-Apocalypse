function rollDice() {
  let zombieDie = document.getElementById('zombieDie')
  let userDie = document.getElementById('userDie')
  let status = document.getElementById('status')
  let zDie = Math.floor(Math.random() * 6) + 1
  let uDie = Math.floor(Math.random() * 6) + 1
  let diceTotal = zDie + uDie
  zombieDie.innerHTML = zDie
  userDie.innerHTML = userDie
  if(zDie = uDie) {
    status.innerHTML += "Tie... roll again"
  } else if (zDie > uDie) {
    //code for when zombies win roll
  }else{
    //code for when user wins roll
  }
}
