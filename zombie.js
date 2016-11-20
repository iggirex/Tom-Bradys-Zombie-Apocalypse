$("#dieCount").change(function() {
  var n = Number($("#dieCount option:selected").val())
  for(var i = 1; i<n+1;i++){
    var id= "youDie"+i;
     $("#visual").append("<div class='dice' id='"+id+"'></div>");
     $("#"+id+"").append("<img src='images/zombie.gif'/>");
  }
})

function rollDice() {
  document.getElementById('status').innerHTML = ''
  let zombieDie = document.getElementById('zombieDie')
  let userDie = document.getElementById('userDie')
  let status = document.getElementById('status')
  let uDie1 = Math.floor(Math.random() * 6) + 1
  let uDie2 = Math.floor(Math.random() * 6) + 1
  let uDie3 = Math.floor(Math.random() * 6) + 1
  let zDie1 = Math.floor(Math.random() * 6) + 1
  let zDie2 = Math.floor(Math.random() * 6) + 1
  $("#zombieDie1").attr("src","images/B"+zDie1+".png");
  $("#zombieDie2").attr("src","images/B"+zDie2+".png");

  $("#youDie1").attr("src","images/O"+uDie1+".png");
  $("#youDie2").attr("src","images/O"+uDie2+".png");
  $("#youDie3").attr("src","images/O"+uDie3+".png");


  // $("#zombieDie").effect( "bounce" );
  // $("#userDie").effect( "bounce" );
  //
  //
  // if(zDie === uDie) {
  //   status.innerHTML += "Tie... Roll Again"
  //   $("#winner").attr("src","images/tie.png");
  //   $("#winner").effect( "shake" );
  // } else if (zDie > uDie) {
  //   $("#winner").attr("src","images/zombie.gif");
  //   $("#winner").effect( "puff" , 2000 );
  //
  //
  // }else{
  //   $("#winner").attr("src",user.selectedHero.imageURL);
  //   $("#winner").effect( "puff", 2000 );
  //
  // }
}
