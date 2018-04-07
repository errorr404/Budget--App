// BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expense = function(id,description,value){
        this.id= id;
        this.description= description;
        this.value= value;
    };

    var Income =function(id,description,value){
        this.id= id;
        this.description= description;
        this.value= value;
    };
    
    var calculateTotal =  function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        
        data.totals[type] = sum;
    };
    
    var allExpenses= [];
    var allIxpenses= [];
    var totalExpenses = 0;
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem: function(type, des, val){
            var newItem, ID;
            
            // Create new ID
            if(data.allItems[type].length>0) {
                  ID = data.allItems[type][data.allItems[type].length - 1 ].id + 1;
            }
            else {
                ID=0;
            }
          
            
            // Create new item based on 'inc' or 'exp' type
            
            if(type==='exp'){
                newItem = new Expense(ID,des,val);
            }
            else if(type==='inc'){
                newItem= new Income(ID,des,val);
            }
            
            //  push it into our data structutre
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
            
        },
        
        calculateBudget: function(){
            
            // calculate total income and expanses
            
            calculateTotal('exp');
            calculateTotal('inc');
            
            
            // calculate the budget: income - expanses
            
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income the we spent
             if(data.totals.inc>0){
                 data.percentage = Math.round(((data.totals.exp) / (data.totals.inc)) * 100);
             }
            else{
                data.percentage = -1;
            }
            
        }, 
        
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage 
            }
        },
        
        
        testing: function(){
            console.log(data);
        }
    };
    
    
    
})();

// module for UI controller
 var UIController = (function() {
     
     var DOMstrings = {
         inputType: '.add__type',
         inputDescription: '.add__description',
         inputValue: '.add__value',
         inputBtn: '.add__btn',
         incomeContainer:'.income__list',
         expensesContainer:'.expenses__list',
         budgetLabel: '.budget__value',
         incomeLabel: '.budget__income--value',
         expanseLabl: '.budget__expenses--value',
         percentageLabel: '.budget__expenses--percentage'
     };
     
    
     return {
         getInput: function(){
             
             return {
                   type:  document.querySelector(DOMstrings.inputType).value, // will be either income or expenses.
             
        description: document.querySelector(DOMstrings.inputDescription).value,
             
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
             };
             
             
           
         },
         
         addListItem: function(obj,type){
             var html,newhtml;
             // create HTML string with placeholder text
             
             if(type==='inc'){
                 element=DOMstrings.incomeContainer;
             html = 
                   '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>        <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
             }
             else if(type==='exp'){
                 element=DOMstrings.expensesContainer;
             html = 
                    
                  '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div>        <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
             }
             
             // Replace the placeholder text with some actual data
             
             newhtml = html.replace('%id%',obj.id);
             newhtml = newhtml.replace('%description%',obj.description);
             newhtml = newhtml.replace('%value%',obj.value);
             
             // Insert the HTML into the DOM  
             document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
         },
         
         clearFields: function(){
             var fields,fieldArr;
             
             fields = document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);
             
              fieldArr = Array.prototype.slice.call(fields);
             
             fieldArr.forEach(function(current, index, array){
                 current.value = "";
             });
             
             fieldArr[0].focus();
         },
         
         displayBudget: function(obj){
             
             document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
             document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
             document.querySelector(DOMstrings.expanseLabl).textContent = obj.totalExp;
             //document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
             document.querySelector('.budget__expenses--percentage').textContent = obj.percentage;
             
             if(obj.percentage>0){
                  document.querySelector('.budget__expenses--percentage').textContent = obj.percentag + '%';
             }
             else{
                  document.querySelector('.budget__expenses--percentage').textContent = '---';
             }
             
         },
         
         getDOMStrings: function(){
             return DOMstrings;
         }
     };
       
 })();


//GLOBAL APP CONTROLLER
var controller = (function(budgetctrl, UICtrl){
    
    var setupEventListners = function(){
           var DOM = UICtrl.getDOMStrings();
           document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
    
    document.addEventListener('keypress',function(event){
                               
                              if(event.keyCode===13|| event.which===13){
                                  ctrlAddItem();
                              }
                              }); 
        
    };
    
    var updateBudget = function(){
        // 1. Calculate the budget
        
         budgetctrl.calculateBudget();
        
        //2. return the budget
        
        var budget = budgetctrl.getBudget();
       
       //3. Display the budget on the UI
        
        UICtrl.displayBudget(budget);
    };
 
     
    var ctrlAddItem = function(){
        var input,newItem;
         // 1.get the field input data
       
         input = UICtrl.getInput();
        
         if(input.description!=="" && !isNaN(input.value)&& input.value>0) {
              // 2. Add the item to the budget controller. 
       
       newItem =  budgetctrl.addItem(input.type, input.description, input.value);
        
       // 3. Add the item to the UI
       
        
        UICtrl.addListItem(newItem,input.type);
        
        // 4. Clear the fields
        UICtrl.clearFields();
        
        // 5. Calculate and update Budget
        updateBudget();
         }
             
      
       
    };

    return {
        init: function(){
           UIController.displayBudget({
               
               budget: 0,
               totalInc: 0,
               totalExp: 0,
               perecntage: -1
           });
            setupEventListners();
        }
    };
    
})(budgetController, UIController);


controller.init();


