





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



    var data = { //u jednoj strukturi pohranjujemo sve podatke 
        allItems: {
            exp: [],
            inc: []

        },
        totals: {
            exp: 0,
            inc:0
        }
  
    }

    return {  //izbacit će sve public methods
        addItem: function (type, desc, val) { //ovako kreira novi item

            var newItem, ID; //Što on prima od podataka? pogledaj redom: 1. var input = UICtrl.getInput()--to je u controller modulu, 2. modul UI controller returna getInput
            ID = 0;

            if (type==="exp") {
                newItem = new Expense(id, des, val);
            } else if (type==="inc") {
                newItem = new Income(id, des, val);
            }

            data.allItems[type].push(newItem);//type je exp ili inc koji dolazi iz gore addItem:function(type...) 
            return newItem;                      //data.allItems[exp] je primjer data arraya koji će biti sleektiran ako je exp. Pogledaj gore object All items


        }                                      
    }
})();








//UI CONTROLLER
var UIController = (function () {
 

    //Problem je što ako u HTMLu promijenimo nešto npr. add__type, onda moramo sve promijeniti opet
    //to riješavamo DOMstrings koji ima sve na jednom mjestu--> object sa svim varijablama Samo se promijeni u DOMstrings.
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    }

     
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //citamo vrijednost. Bit ce inc(prihod) ili exp(trosak)
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
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
 
    

    var ctrlAddItem = function () { //funkcija koja se zove kad želimo dodati novi item
        //1. get the field input data
        var input = UICtrl.getInput()  //1.
      
        //2 .add the item to the budget controller

        //3. add new item to the UI

        //4. calculate the budget

        //5. display the budget
        
    }

    //moramo nekako pozvati funkciju eventlisteners i da bude public
    return {
        init: function () {
            console.log("ap started");
            setupEventListeners();
        }
    }


})(budgetController, UIController);//global app controler

controller.init();