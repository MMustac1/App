





//====================================================================
//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value, percentage) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
//želimo dodati metodu, ali ne u function constructor tako da preko prototypea svi objekti dobiju metodu
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1;
        }
        
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;



        data.allItems[type].forEach(function (currentElement) { 
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
        percentage: -1 //tako se označava da nešto ne postoji
        
    }

    return {  //IZBACIT ĆE SVE PUBLIC METHODS
        addItem: function (type, desc, val) { //ovako kreira novi item

            var newItem, ID; //Što on prima od podataka? pogledaj redom: 1. var input = UICtrl.getInput()--to je u controller modulu, 2. modul UI controller returna getInput
            
            //Želimo da je ID = zadnji ID + 1. (imamo dva arraya, postoji mogućnsot da zbog brisanja može se desiti da dva itema imaju isti id. Pogledaj 8:30min lekcije 9)
            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1; //ako se gleda samo ovako, ID ne postoji jer nema itema u arrayu što znači da je length 0, a 0-1 ne može.
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
            return newItem;                      //data.allItems[exp] je primjer data arraya koji će biti sleektiran ako je exp. Pogledaj gore object All items


        },           
        //koje podatke treba imati ova funkcija da bi mogla obrisati item -  type(radi li se o exp ili inc) i id (redni broj, zapravo)
        deleteItem: function (type, id) {
            var ids, index;
            //id = 3
            //data.allItems[type][id]; //ovo nije dobro jer bi izbrisao treći po redu. 
            //ako imamo array itema s id-evima [1, 2 , 4 , 6, 8] , ovime bi on obrisao item s id-em 6, a to nije što trebam
            // ids =[1, 2 , 4 , 6, 8]  - ako želim obrisati item s id=6  onda bi to bio index = 3
            //kreiraj array sa svim id-evima koji su trenutno aktualni
            var ids = data.allItems[type].map(function (current) {
                return current.id;
            })
            index = ids.indexOf(id) //vraća index elementa iz array kojeg stavimo umjesto (id) 
                                    //ako je id koji tražimo 6, onda ovime pretražuje array ids =[1, 2 , 4 , 6, 8], nalazi 6 i onda broji koji je to index. U ovom slučaju je to 3

            //ako indeks postoji, briši
            if (index !== -1) { 
                data.allItems[type].splice(index, 1) //počne micati elemente na broju index(u primjeru je to 3), a drugi broj znači koliko će ih se izbrisati

            }
        },



        calculateBudget: function () {
            //calculate total inc and exp
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget : inc - exp
            data.budget = data.totals.inc - data.totals.exp;
            //calculate % of income we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            };
            
        },
        calculatePercentages: function () {
           
            data.allItems.exp.forEach(function (curr) {
                curr.calcPercentage(data.totals.inc);
                
            })


      


        },


        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (curr) {
                return curr.getPercentage()  

            })
            return allPerc

        },

        getBudget: function () { //ovo se gleda u displayBudget metodi
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function () {
            console.log(data);
        }
    }
})(); 








//UI CONTROLLER
var UIController = (function () {
 
  

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list", 
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage"
    }
   var  formatNumber = function (num, type) {
        var numSplit, int, dec, type
        /*
         + or -  before number
         2 decimale
         zarez u tisućama
         2310.4567 = + 2,310.46
         */

        num = Math.abs(num);
        num = num.toFixed(2); //string
        numSplit = num.split(".")
        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3) //input 2310 , output 2,310
        }
        dec = numSplit[1]


        return (type === "exp" ? "-" : "+") + " " + int +"." + dec
    }
     
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //citamo vrijednost. Bit ce inc(prihod) ili exp(trosak)
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) 
            };
        },

        addListItem: function (obj, type) {
            var html, newHTML, element;
            //create HTML string with placeholder tags
            if (type === 'inc') { 
                element = DOMstrings.incomeContainer; //postoji varijabla element koja ovisno o type postaje ili .expensesList ili .incomeList jednako kako imamo html varijablu koja , ovisno o type, postaje jedan ili drugi ovaj veliki string.
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; //tu je promijenjen income-0 u inc radi konzistentnosti. Isto je s exp učinjeno
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
          
 
            //replace placeholder tags with actual data
            newHTML = html.replace("%id%", obj.id);
            newHTML = newHTML.replace("%description%", obj.description);
            newHTML = newHTML.replace("%value%", formatNumber(obj.value, type));
            //Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHTML)//ovaj element ce biti incomeContainer(income list) ako je income ili expensesContainer(expensesList) ako je expense
        },


        deleteListItem : function (selectorID) {
            //remova se child element, dakle treba potražiti parent element
           var element = document.getElementById(selectorID) //to je item kojeg želim removati
            element.parentNode.removeChild(element);
        },






        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue)

            fieldsArr = Array.prototype.slice.call(fields);.

            fieldsArr.forEach(function (current, index, array) { 
                current.value = "";

            });
            fieldsArr[0].focus(); //vraća fokus na prvi dio arraya. Uovom slučaju prvi dio arraya je inputDescription kako je gore prikazano u var fields
        },

        displayBudget: function (obj) {
            obj.budget > 0 ? type = "inc" : type = "exp";
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type); //obj.budget dolazi iz objekta koji je uključen u ovo (obj)
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc"); 
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, "exp"); 
            

            if (obj.percentage >0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + " %";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            };

        },

        displayPercetages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); 
            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i) 
                }
            }
                            //list              //callback
            nodeListForEach(fields, function (current, index) {
                if (percentages[index]/*sadašnji percentage*/ > 0) {
                    current.textContent = percentages[index] + " %"
                } else {
                    current.textContent = "---"

                }
            })
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

        document.addEventListener("keypress", function (event) {//bilokoje ime mogu koristiti, 
            if (event.keyCode === 13 || event.which === 13) {

                ctrlAddItem();

            }
        });
        //DOM.container jer (par redova gore) dobijemo DOMstrings preko DOM varijable
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
    };



 
    var updateBudget = function () {
        //1.calculate the budget
        budgetCtrl.calculateBudget();
        //2. return the budget
        var budget = budgetCtrl.getBudget();
        //3. Display the budget on the UI

        UICtrl.displayBudget(budget);  //vraćamo ovaj gore pod točkom 2.
    };

    var updatePercentages = function () {
        //1.calculate percent
        budgetController.calculatePercentages()
        //2 read perc from the budget controller
       var percentages = budgetCtrl.getPercentages()
        //3 update UI
        UICtrl.displayPercetages(percentages)//što je ova gore varijabla pod br.2
       console.log(percentages)
    }

    var ctrlAddItem = function () { //funkcija koja se zove kad želimo dodati novi item
        var input, newItem;

        //1. get the field input data
        input = UICtrl.getInput()  //1.

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2 .add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);//ova tri itema dobijemo iz Inputa iz UICtrl
            //3. add new item to the UI
            UICtrl.addListItem(newItem, input.type);
            //4. clear fields
            UICtrl.clearFields();
            //5. calculate the budget and update it

            updateBudget();
          // 6. calculate and updatep ercentages
            updatePercentages()
        }
    };
   
    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID 

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) { //
            //inc-1
            //razdvojit će HTML-ov id na npr. ["inc", "1"]
            splitID = itemID.split("-") 
            type = splitID[0];
            ID = parseInt(splitID[1]);  //pazi, ovdje ID vraća kao string. Gore se uspoređuje string s brojem

            //1.delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            //2. Delete item from the UI
            UICtrl.deleteListItem(itemID)


            //3 Update and show new budget
            updateBudget();
            // 4. calculate and update percentages
            updatePercentages()

        }

 
    }



    //moramo nekako pozvati funkciju eventlisteners i da bude public
    return {
        init: function () {
            console.log("ap started");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1})
            setupEventListeners();
        }
    }


})(budgetController, UIController);//global app controler

controller.init();

