const Modal = {
  open(){
    document
      .querySelector('.overlay')
      .classList.add('active')
    
  },
  close(){
    document
      .querySelector('.overlay')
      .classList.remove('active')
  }        
}  

const Storage  = {
  get(){
      return JSON.parse(localStorage.getItem("financer:transactions")) ||  []
  },

  set(transaction){
      localStorage.setItem("financer:transactions", JSON.stringify(transaction))
}

}
// const transaction = [
//  {
//    description: "Luz",
//    amount: -50000,
//   date: "23/02/2021"
// }, 
// {
//   description: "Job",
//   amount: 50000,
//   date: "23/02/2021"
// }, 
// {
//     description: "internet",
//   amount: -80000,
//   date: "23/02/2021"
// },
// {
//   description: "Trampo",
//   amount: 80000,
//   date: "23/02/2021"
// }
// ]

const Valor ={
  all: Storage.get(),

  add(transaction){
  Valor.all.push(transaction)

  app.reload()
  },

  remove(index){
  Valor.all.splice(index,1)
  app.reload()
  },

incomes(){
let income = 0
Valor.all.forEach(function(transaction){
if(transaction.amount>0){
  income = income + transaction.amount
  //console.log(transaction.amount)
}
})
return income
},

expenses(){
let expense = 0 
Valor.all.forEach(function(transaction){
if(transaction.amount<0){
  expense = expense - transaction.amount
}
})
return expense
},

total(){
let total = 0

//let income = 0
//let expense = 0

//transaction.forEach(function(transaction){
// if(transaction.amount>0){
//  income = income + transaction.amount
  //console.log(transaction.amount)
// }
//})

//transaction.forEach(function(transaction){
// if(transaction.amount<0){
//   expense = expense - transaction.amount
//  }
// })
total = Valor.incomes() - Valor.expenses()
if(total<0){
  document
   // .querySelector('#cartsaldo')
   // .classList.add('red')
  document
    .querySelector(".saldo").style.backgroundColor = "#820003";
}
return total
}
}

const utils ={
formatvalues(value){
value = Number(value)*100
//console.log(value)
return Math.round(value)
},

formatdate(date){
const SDate = date.split("-")
return `${SDate[2]}/${SDate[1]}/${SDate[0]}`
},

Format(value){
const signal = Number(value)<0 ? "-" : ''

value = String(value).replace(/\D/g, "")

value = Number(value)/100

value = value.toLocaleString("pt-BR", {
style: "currency",
currency: "BRL"
})

return  signal + value
}}

const DOM = {
transcont:document.querySelector('#tables tbody'),

innerT(transaction, index){
const Cssclass = transaction.amount > 0 ? "income": "expense"

const amount = utils.Format(transaction.amount)



const html = `
 
      <td>${transaction.description}</td>
      <td class=${Cssclass}>${amount}</td>
      <td>${transaction.date}</td>
      <td><img onclick=Valor.remove(${index}) class="menos" src="https://cdn.glitch.com/e01deed2-59fb-427d-8af9-049919f52b5f%2Fminus.svg?v=1622141186536" alt= "menos"></td>
    
    `
    return html
},

addTrans(transaction, index){
const tr = document.createElement("tr")
tr.innerHTML = DOM.innerT(transaction, index)
tr.dataset.index = index

DOM.transcont.appendChild(tr)
},

updateBalance(){
document
.getElementById('cartentradas')
.innerHTML = utils.Format(Valor.incomes())
document
.getElementById('cartsaida')
.innerHTML = utils.Format(Valor.expenses())
document
.getElementById('cartsaldo')
.innerHTML = utils.Format(Valor.total())
},

Clearall(){
DOM.transcont.innerHTML =""
}

}

const needs = {
   RandomColor(){
    let colors = []
    let letters = '0123456789ABCDEF'
    let color = '#'
    Valor.all.forEach(function(){
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      colors.push(color)
      color = '#'
    })
    return colors
  },

  labels(){
    let xIncomes = []
    let xExpenses = []

    Valor.all.forEach(function(transaction, index){
      //xv.push(Valor.all[index].description)
      if(Valor.all[index].amount>0){
          xIncomes.push(Valor.all[index].description)
      }else if(Valor.all[index].amount<0){
        xExpenses.push(Valor.all[index].description)
      }
    })
    return {xExpenses, xIncomes}
  },

  arguments(){
    let yIncomes = []
    let yExpenses = []

  Valor.all.forEach(function(transaction, index){
  //yv.push(Valor.all[index].amount)
    if(Valor.all[index].amount>0){
      yIncomes.push(Valor.all[index].amount)
    }else if(Valor.all[index].amount<0){
      yExpenses.push(Valor.all[index].amount)
    }
    })
    return {yIncomes, yExpenses}
  },
}

const graphs = {
  expensesGraphs(){
    var xValues = needs.labels().xExpenses
    var yValues = needs.arguments().yExpenses
    var barColors = needs.RandomColor();

  new Chart("expensesGraphs", {
    type: "doughnut",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      title: {
        display: false,
        text: "World Wide Wine Production 2018"
      }
    }
  });

  },

  incomesGraphs(){
    var xValues = needs.labels().xIncomes
    var yValues = needs.arguments().yIncomes
    var barColors = needs.RandomColor();

  new Chart("incomesGraphs", {
    type: "doughnut",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      title: {
        display: false,
        text: "World Wide Wine Production 2018"
      }
    }
  });

  }
}

const form = {
description:document.querySelector('input#description'),
amount:document.querySelector('input#amount'),
date:document.querySelector('input#date'),

values(){
return {description: form.description.value,
      amount: form.amount.value,
      date: form.date.value,
}},

validate(){
const {description, amount, date} = form.values()
if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
  throw new Error("Por favor, preencha todos os campos")
}
},

formatValues(){
let {description, amount, date} = form.values()

amount = utils.formatvalues(amount)

//console.log(amount)

date = utils.formatdate(date)

return {
//description: description,
description,
amount, 
date
}
},

savetransit(transaction){
Valor.add(transaction)
},

clearFields(){
form.description.value = ""
form.amount.value = ""
form.date.value = ""
},



submit(event){
event.preventDefault()
//validar os campos
try{
form.validate()
const transaction = form.formatValues()
form.savetransit(transaction)
form.clearFields()
Modal.close()
app.reload()

}catch(error){
alert(error.message)
}

}
}


const app ={
init(){
Valor.all.forEach(function(T, index){
DOM.addTrans(T, index)

graphs.expensesGraphs()
graphs.incomesGraphs()
})

DOM.updateBalance()

Storage.set(Valor.all)
},

reload(){
DOM.Clearall()
app.init()
}
}


app.init()









console.log(needs.labels().xExpenses)
console.log(needs.labels().xIncomes)

console.log(needs.arguments().yIncomes)
console.log(needs.arguments().yExpenses)

//console.log(xIncomes)
//console.log(xExpenses)

//console.log(yIncomes)
//console.log(yExpenses)
//console.log(Valor.all[0].description)


//console.log(transaction)
//Valor.remove(0)