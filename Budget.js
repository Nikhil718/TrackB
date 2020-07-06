// Budget Controller 

var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome)* 100);

        } else { 
            
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
         var sum = 0;
         data.allitems[type].forEach(function(cur){
             sum += cur.value;
         });
         data.totals[type] = sum;
    };
    

    var data = {
        allitems: {
            exp : [],
            inc : []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem : function(type, des, val){
            var newItem, ID;
           // Create new id
           if(data.allitems[type].length > 0){
            ID = data.allitems[type][data.allitems[type].length-1].id + 1;
           } else {
               ID = 0;
           }
           
           
            // Create new items based on 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);

            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            } 

            //Push it into our data structure
             data.allitems[type].push(newItem);

             //return the new element
             return newItem;

        },


        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allitems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allitems[type].splice(index, 1);
            }

        },

        calculateBudget: function(){

            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income-expenses
            data.budget = data.totals.inc - data.totals.exp;

            //  Calculate the percentage of the income that we spent
            if(data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {

            data.allitems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });

        },

        getPercentages: function() {
            var allPerc = data.allitems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget : function() {
          return{
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
          };
        },


        testing: function(){
            console.log(data);
        }
    };


})();









//UI Controller

var UIController = (function(){

      var DOMstrings = {
          inputType: '.add__type',
          inputDescription: '.add__description',
          inputValue: '.add__value',
          inputbtn: '.add__btn',
          incomeContainer: '.income__list',
          expensesContainer: '.expenses__list',
          budgetLable: '.budget__value',
          incomeLable: '.budget__income--value',
          expenseLable: '.budget__expenses--value',
          percentageLable: '.budget__expenses--percentage',
          container: '.container',
          expensesPercentageLabel: '.item__percentage',
          dateLable: '.budget__title--month'

      };

     var formatNumber = function(num, type){
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);


        numSplit = num.split('.');

        int = numSplit[0];
        if(int.length > 3) {
           int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3,3);
        }

        dec = numSplit[1];

        return   (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec; 

    };

    
    var  NodeListForEach = function(list, callback){
        for ( var i = 0; i < list.length; i++) {
            callback(list[i],i);
        }

    };




    return{
        getinput: function(){
            return {
                 type : document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
                 description : document.querySelector(DOMstrings.inputDescription).value,
                 value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
          
        },
         
        addListItems: function(obj, type) {
            var html, newhtml,element;
            // Create HTML string with placeholder text
            if (type ==='inc'){
                element = DOMstrings.incomeContainer;
                html = ' <div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn">  <i class="fa fa-trash" aria-hidden="true"></i> </button> </div> </div> </div>'

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html= '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="fa fa-trash" aria-hidden="true"></i> </button> </div> </div> </div>'

            }
            

            //Replace the placeholder text with some actual data
           newhtml = html.replace('%id%',obj.id);
           newhtml = newhtml.replace('%description%', obj.description);
           newhtml = newhtml.replace('%value%',formatNumber(obj.value, type));

           //insert the html into the DOM
           document.querySelector(element).insertAdjacentHTML('beforeend' , newhtml);
        },

        deleteListItems: function(selectorID){

            var el =  document.getElementById(selectorID);
           el.parentNode.removeChild(el);
           

        },

        clearFields: function() {
            var fields , fieldsArr;

            fields =  document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

           fieldsArr = Array.prototype.slice.call(fields);

           fieldsArr.forEach(function(current , index , array) {
               current.value = "";
           });

           fieldsArr[0].focus();
           
         
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLable).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLable).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLable).textContent = formatNumber(obj.totalExp, 'exp');
           
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';

            } else {
                document.querySelector(DOMstrings.percentageLable).textContent = '---';

            }

        },

        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);


            NodeListForEach(fields, function(current,index){
                if (percentages[index] > 0) {

                    current.textContent = percentages[index] + '%';
                } else {

                    current.textContent = '---';

                }
                
            });

        },

        displayMonth: function() {
            var now, year, month, months;
             now = new Date();


             months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
             month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLable).textContent = months[month] + ' ' + year;
        },

        changeType: function(){
           
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

                NodeListForEach(fields, function(cur){
                    
                    cur.classList.toggle('red-focus');
                });

                document.querySelector(DOMstrings.inputbtn).classList.toggle('red');
            
        },

      

      
        getDOMstrings: function(){
            return DOMstrings;
        }

     
    };
})();








//Global App Controller


var controller = (function(budgetCtrl, UIctrl){

    var setupEventlistner = function() {
        var DOM = UIctrl.getDOMstrings();

        document.querySelector(DOM.inputbtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
          if (event.keyCode === 13 || event.which === 13) {
              ctrlAddItem();
          }
          
    
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changeType);

    
    };



    var updateBudget = function(){
        
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Returns the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI

        UIctrl.displayBudget(budget);

    };



    var updatePercentages = function() {

        //1. calculate percentage
           budgetCtrl.calculatePercentages();

        //2. Read percentage from the budget controller
          var percentages = budgetCtrl.getPercentages();


        //3. Update the new percentage in the UI 
         UIctrl. displayPercentages(percentages);
    
    };

   
    var ctrlAddItem = function(){
       var input, newItem;

        // 1. Get the field input data
          input = UIctrl.getinput();


          if (input.description !== "" && !isNaN(input.value) && input.value > 0 ){

            
        // 2. add the item to the budget controller
         newItem = budgetCtrl.addItem(input.type, input.description, input.value);

         // 3. add item the to the UI
 
         UIctrl.addListItems(newItem, input.type);
 
 
         // 4. Clear the fields
 
         UIctrl.clearFields();
 
 
 
         // 5. Calculate and update the budget
 
         updateBudget();


         //6. Calculate and update percentages
         updatePercentages();
 

          }
              
    };


    var ctrlDeleteItem = function(event) {
        var itemID, splitID,type,ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. delete the item from the data structure

            budgetCtrl.deleteItem(type, ID);

            //2. Delete the item from the UI

            UIctrl.deleteListItems(itemID);

            //3.Update and show the new budget
            updateBudget();


        }
      
    };

    return {
        init: function(){
            UIctrl.displayMonth();
            UIctrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventlistner();
        }
    };


})(budgetController, UIController);

controller.init();