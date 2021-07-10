async function getRestaurant(){
    // let randomNumber = getRandomInt(1,11);
    // console.log("random number",randomNumber)
    // let id = JSON.stringify(randomNumber);
    let res = await fetch(`https://q09wvlpvn5.execute-api.sa-east-1.amazonaws.com/prod/restaurant`);
    let data = await res.json();
    if(data){
        console.log("data",data.restaurantName)
        appendData(data.restaurantName)
        // return JSON.parse(data.restaurantName);
    }
}


async function saveRestaurant(){
    const restaurantName = document.getElementById('restaurantName').value;
    document.getElementById('restaurantName').value = '';
    // const restaurantId = document.getElementById('restaurantId').value;
    // console.log(restaurantName,restaurantId)
    let res = await fetch("https://q09wvlpvn5.execute-api.sa-east-1.amazonaws.com/prod/restaurant", {
        method: "POST",
        body: JSON.stringify({
            restaurantName: `${restaurantName}`
        }),
        headers: {
            "Content-type": "application/json"
        }
    });
    let data = await res.json();
  
    if(data){
        console.log("data",data)
       
        alert("Restaurant Added Successfully!");
        // return JSON.parse(data.restaurantName);
    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function appendData(data) {
    let mainContainer = document.getElementById("myData");
    //   let span = document.createElement("span");
      mainContainer.innerHTML = ' ' + 'Restaurant Name: ' + data ;
    //   mainContainer.appendChild(span);
  }