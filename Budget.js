// Budget Controller 

var budgetController = (function(){
    
    var Expenses = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    

    var data = {
        allitems: {
            exp : [],
            inc : []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
                newItem = new Expenses(ID, des, val);

            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            } 

            //Push it into our data structure
             data.allitems[type].push(newItem);

             //return the new element
             return newItem;

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
          expensesContainer: '.expenses__list'
      };


    return{
        getinput: function(){
            return {
                 type : document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
                 description : document.querySelector(DOMstrings.inputDescription).value,
                 value : document.querySelector(DOMstrings.inputValue).value
            };
          
        },
         
        addListItems: function(obj, type) {
            var html, newhtml,element;
            // Create HTML string with placeholder text
            if (type ==='inc'){
                element = DOMstrings.incomeContainer;
                html = ' <div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn">  <i class="fa fa-trash" aria-hidden="true"></i> </button> </div> </div> </div>'

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html= '<div class="item clearfix" id="expenses-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="fa fa-trash" aria-hidden="true"></i> </button> </div> </div> </div>'

            }
            

            //Replace the placeholder text with some actual data
           newhtml = html.replace('%id%',obj.id);
           newhtml = newhtml.replace('%description%',obj.description);
           newhtml = newhtml.replace('%value%',obj.value);

           //insert the html into the DOM
           document.querySelector(element).insertAdjacentHTML('beforeend' , newhtml);




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
    
    };

   

   

    var ctrlAddItem = function(){
       var input, newItem;

        // 1. Get the field input data
          input = UIctrl.getinput();
         

        // 2. add the item to the budget controller
         newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. add item the to the UI

        UIctrl.addListItems(newItem, input.type);


        // 4. calculate the budget


        // 5. display the budget on the UI

         
    };

    return {
        init: function(){
            setupEventlistner();
        }
    };


})(budgetController, UIController);

controller.init();