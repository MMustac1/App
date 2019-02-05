





//====================================================================
//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {//stavljamo data koju želimo da function constructor ima
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {//stavljamo data koju želimo da function constructor ima
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (currentElement) { //currentElement se odnosi na objekt koji se trenutno gleda, a koji je dio arraya
            sum += currentElement.value;
        });
        data.totals[type] = sum;
    };
    var data = { //u jednoj strukturi pohranjujemo sve podatke 
        allItems: {
            exp: [],
            inc: []

        },
        totals: {
            exp: 0,
            inc:0
        },
        budget: 0,
        percentage: -1 //ne postoji
        
    }

    return {  //IZBACIT ĆE SVE PUBLIC METHODS
        addItem: function (type, desc, val) { //kreira novi item

            var newItem, ID; 
            
            //Želimo da je ID = zadnji ID + 1. 
            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
           
            //Create new item based on "inc" or "exp" type
            if (type==="exp") {
                newItem = new Expense(ID, desc, val);
            } else if (type==="inc") {
                newItem = new Income(ID, desc, val);
            }
            //push the item into data structure
            data.allItems[type].push(newItem);//type je exp ili inc koji dolazi iz gore addItem:function(type...) 

            //return the new element
            return newItem;                      /


        },          

        calculateBudget: function () {
            //calculate total inc and exp
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget : inc - exp
            data.budget = data.totals.inc - data.totals.exp;
            //calculate % of income we spent
            data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
        },

        testing: function () {
            console.log(data);
        }
    }
})(); 








//UI CONTROLLER
var UIController = (function () {
 
    //HTML+js

    //all in one
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list", /
        expensesContainer:".expenses__list"
    }

     
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //citamo vrijednost. Bit ce inc(prihod) ili exp(trosak)
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //ovime pretvori string u broj. Isto kao i Number()
            };
        },

        addListItem: function (obj, type) {
            var html, newHTML, element;
            //kreiraj HTML string s placeholder tags
            if (type === 'inc') { //zamijeni data koja je ovdje s pravim data. %id% da je lakše za pronaći placeholder tekst
                element = DOMstrings.incomeContainer; //postoji varijabla element koja ovisno o type postaje ili .expensesList ili .incomeList jednako kako imamo html varijablu koja , ovisno o type, postaje jedan ili drugi ovaj veliki string.
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
          
 
            //zamijeni placeholder tags s pravim podacima
            newHTML = html.replace("%id%", obj.id);
            newHTML = newHTML.replace("%description%", obj.description);
            newHTML = newHTML.replace("%value%", obj.value);
            //Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHTML)//ovaj element ce biti incomeContainer(income list) ako je income ili expensesContainer(expensesList) ako je expense
        },
        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue)// prebaciti listu u array

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) { 
                current.value = "";

            });
            fieldsArr[0].focus(); //vraća fokus na prvi dio arraya. Uovom slučaju prvi dio arraya je inputDescription kako je gore prikazano u var fields
        },
        getDOMstrings: function () {
            return DOMstrings; //ovom metodom smo izložili javnosti var DOMstrings
        }
    }
})();





//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    //Problem je kad ima više event-listenera.Lakše je napraviti funkciju s njima
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function (event) {//bilokoje ime mogu koristiti
            if (event.keyCode === 13 || event.which === 13) {
                
                ctrlAddItem();

            }
        });
    }
 
    var updateBudget = function () {
        //1.kalkuliraj budget
        budgetCtrl.calculateBudget();
        //2. return  budget

        //3. Prikaži budget na UI-u
    }

    var ctrlAddItem = function () { //funkcija koja se zove kad želimo dodati novi item
        var input, newItem;

        //1. get the field input data
        input = UICtrl.getInput() 

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2 dodaj item u budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);//ova tri itema dobijemo iz Inputa iz UICtrl
            //3. dodaj novi item u UI
            UICtrl.addListItem(newItem, input.type);
            //4. isprazni polja nakon utipkavanja
            UICtrl.clearFields();
            //5. izračunaj budget i update

            updateBudget();
            //6. prikaži budget
        }
    };

    //moramo nekako pozvati funkciju eventlisteners i da bude public
    return {
        init: function () {
            console.log("ap started");
            setupEventListeners();
        }
    }


})(budgetController, UIController);//global app controler

controller.init();

