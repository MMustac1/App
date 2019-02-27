










//====================================================================
//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value, percentage) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {

        this.percentage = Math.round(this.value / totalIncome)*100
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;

        //for (var i = 0; i < data.allItems[type].length; i++) {                            // FOR LOOP
        //    sum += data.allItems[type][i].value;
        //}; data.totals[type] = sum;

        data.allItems[type].forEach(function (currentElement) { 
            sum += currentElement.value;
        });
        data.totals[type] = sum;
    };
    var data = { 
        allItems: {
            exp: [],
            inc: []

        },
        totals: {
            exp: 0,
            inc:0
        },
        budget: 0,
        percentage: -1
        
    }
//====================PUBLIC==============
    return {  
        addItem: function (type, desc, val) { 

            var newItem, ID; getInput
            
            //Želimo da je ID = zadnji ID + 1. (imamo dva arraya, postoji mogućnsot da zbog brisanja može se desiti da dva itema imaju isti id. 
            //Kreiraj ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1; //ako se gleda samo ovako, ID ne postoji jer nema itema u arrayu što znači da je length 0, a 0-1 ne može.
            } else {
                ID = 0;
            }
           
            //Kreiraj novi item "inc" ili "exp"type
            if (type==="exp") {
                newItem = new Expense(ID, desc, val);
            } else if (type==="inc") {
                newItem = new Income(ID, desc, val);
            }
            //pushaj item 
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;             


        },           
        //pitaj se koje podatke treba imati ova funkcija da bi mogla obrisati item -  type(radi li se o exp ili inc) i id (redni broj, zapravo)
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
            /*
             a=20
             b=10
             c=40
             income=100
             a=20/100 = 20%
             b=10/100 = 10%
             c=40/100 = 40%
             */

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
 
    //spajamo HTML i js.
    //Problem je što ako u HTMLu promijenimo nešto npr. add__type, onda moramo sve promijeniti opet
    //to riješavamo DOMstrings koji ima sve na jednom mjestu--> object sa svim varijablama Samo se promijeni u DOMstrings.
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list", //element koji selektiramo ako imamo income. U tu listu cemo ubaciti veliki HTML file definiran s var html i newHTML
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container"
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
            //create HTML string with placeholder tags
            if (type === 'inc') { //zamijeni data koja je ovdje s pravim data. %id% da je lakše za pronaći placeholder tekst
                element = DOMstrings.incomeContainer; //postoji varijabla element koja ovisno o type postaje ili .expensesList ili .incomeList jednako kako imamo html varijablu koja , ovisno o type, postaje jedan ili drugi ovaj veliki string.
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; //tu je promijenjen income-0 u inc radi konzistentnosti. Isto je s exp učinjeno
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
          
 
            //replace placeholder tags with actual data
            newHTML = html.replace("%id%", obj.id);
            newHTML = newHTML.replace("%description%", obj.description);
            newHTML = newHTML.replace("%value%", obj.value);
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
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue)//odijelimo razne selektore sa zarezom; vratit će listu, ali ne array_--> prebaciti listu u array

            fieldsArr = Array.prototype.slice.call(fields);//Array.prototype.slice je method koji već postoji u programu. Array je array,a prototype.slice je dio toga. Uprogramirano je već. Onda zovemo call i "this" varijabla je "fields". tako komp misli da je "fields" array, dok je u realnosti lista.

            fieldsArr.forEach(function (current, index, array) { //current - vrijednost arraya kojeg se trenutno gleda, index je broj lenght-1, array - pristup cijeloj array(u ovom slučaju je fieldsArr)
                current.value = "";

            });
            fieldsArr[0].focus(); //vraća fokus na prvi dio arraya. Uovom slučaju prvi dio arraya je inputDescription kako je gore prikazano u var fields
        },

        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget; //obj.budget dolazi iz objekta koji je uključen u ovo (obj)
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc; 
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp; 
            

            if (obj.percentage >0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + " %";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            };

        },
        getDOMstrings: function () {
            return DOMstrings; //ovom metodom smo izložili javnosti var DOMstrings
        }
    }
})();





//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    //ima više event-listenera.Lakše je napraviti funkciju s njima
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function (event) {//bilokoje ime mogu koristiti, 
            if (event.keyCode === 13 || event.which === 13) {

                ctrlAddItem();

            }
        });
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
    };



 
    var updateBudget = function () {
        //1.calculate the budget
        budgetCtrl.calculateBudget();
        //2. returnaj budget
        var budget = budgetCtrl.getBudget();
        //3. Display the budget on the UI

        UICtrl.displayBudget(budget); 
    };

    var updatePercentages = function () {
        //1.calculate percent

        //2 read perc from the budget controller

        //3 update UI
    }

    var ctrlAddItem = function () { 
        var input, newItem;

        //1. get the field input data
        input = UICtrl.getInput()  //1.

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2 .add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
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
        var itemID, splitID, type, ID //pošto nema drugih id u HTML dokumentu, možemo kasnije reći da se stvari dešavaju ako je id definiran. U HTML-u pod "id" je ovaj itemID koji se sastoji od type i broja.

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) { //
            //inc-1
            splitID = itemID.split("-") 
            type = splitID[0];
            ID = parseInt(splitID[1]);  //ovdje ID vraća kao string. Gore se uspoređuje string s brojem

            //1.delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            //2. Delete item from the UI
            UICtrl.deleteListItem(itemID)


            //3 Update and show new budget
            updateBudget();
            // 4. calculate and update percentages
            updatePercentages()

        }

        //console.log(event.target.parentNode.parentNode.parentNode.parentNode.id) //igraj se s ovime da vidiš što sve označava
        //console.log(event.target);to označava HTML node, ali pošto želim obrisati cijeli div(pogledaj HTML), mene zanima id="income-0", npr.jer je jedinstven identifier
    }



    //public
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


