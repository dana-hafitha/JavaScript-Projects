// creating the calculator 
function add(...numbers){ //rest parameter
    let sum = 0;  
    for (let i = 0; i < numbers.length; i++) {
        sum += parseFloat(numbers[i]);
    }
    return sum;
}

function sub(...numbers){
    let subRes = parseFloat(numbers[0]);
    for (let i = numbers.length -1 ; i > 0; i--) {
        subRes = subRes - parseFloat(numbers[i]);
    }
    return subRes;
}


function mul(...numbers){
    let mulRes = parseFloat(numbers[0]);
    for (let i = (numbers.length - 1); i > 0; i--) {
        mulRes = mulRes * parseFloat(numbers[i]);
    }
    return mulRes;
}

function div(...numbers){
    let divRes = parseFloat(numbers[0]);
    for (let i = (numbers.length - 1); i > 0; i--) {
        try{
            divRes = divRes / parseFloat(numbers[i]); 
            if (parseFloat(numbers[i]) === 0){
                throw new Error("can't divide on zero");
            }
        } 
        catch(error){
            alert(error)
        }
    }
    return divRes;
}

let calculate = document.createElement("span");
let numbers = document.getElementById("numbers");
let display = document.getElementById("disp");

numbers.addEventListener("click", function(element) {
    if (element.target.closest(".num_btn") || element.target.closest(".op_btn")) {
        calculate.textContent += element.target.textContent;
        display.appendChild(calculate) 
    }
    else if(element.target.closest(".eq_btn")){
        if (calculate.textContent.includes("+")){
            let op = calculate.textContent.split("+");
            let res = document.createElement("span");
            res.textContent = add(...op);
            calculate.textContent = `${res.textContent}`;
            console.log(res.textContent)
        }
        else if (calculate.textContent.includes("-")){
            let op = calculate.textContent.split("-");
            let res = document.createElement("span");
            res.textContent = sub(...op);
            calculate.textContent = `${res.textContent}`;
            console.log(res.textContent)

        }
        else if (calculate.textContent.includes("*")){
            let op = calculate.textContent.split("*");
            let res = document.createElement("span");
            res.textContent = mul(...op);
            calculate.textContent = `${res.textContent}`;
            console.log(res.textContent)

        }
        else if (calculate.textContent.includes("/")){
            let op = calculate.textContent.split("/");
            let res = document.createElement("span");
            res.textContent = div(...op);
            calculate.textContent = `${res.textContent}`;
            console.log(res.textContent)

        }
        else{
            alert("there is no operation")
        }
    }
    else if(element.target.closest(".rmv_btn")){
        if (calculate.textContent !== null){
            calculate.textContent = calculate.textContent.slice(0, -1);
            display.appendChild(calculate);
        }
        else {
            alert("there are nothing to delete yet");
        }
    }
});