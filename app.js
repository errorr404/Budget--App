// BUDGET CONTROLLER
var budgetController = (function(){
    
  // some code
    
    
})();

// module for UI controller
 var UIController = (function() {
     
     var DOMstrings = {
         inputType: '.add__type',
         inputDescription: '.add__description',
         inputValue: '.add__value',
         inputBtn: '.add__btn'
     };
     
    
     return {
         getInput: function(){
             
             return {
                   type:  document.querySelector(DOMstrings.inputType).value, // will be either income or expenses.
             
        description: document.querySelector(DOMstrings.inputDescription).value,
             
             value: document.querySelector(DOMstrings.inputValue).value
             };
             
             
           
         },
         getDOMStrings: function(){
             return DOMstrings;
         }
     };
       
 })();


//GLOBAL APP CONTROLLER
var controller = (function(budgetctrl, UICtrl){
    
    var DOM = UICtrl.getDOMStrings();
     
    var ctrlAddItem = function(){
         // 1.get the field input data
       
        var input = UICtrl.getInput();
        console.log(input);
        
       // 2. Add the item to the budget controller. 
       
       // 3. Add the item to the UI
       
       // 4. Calculate the budget
       
       //5. Display the budget on the UI
        
        console.log('it works');
    }
   document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
    
    document.addEventListener('keypress',function(event){
                               
                              if(event.keyCode===13|| event.which===13){
                                  ctrlAddItem();
                              }
                              });
    
})(budgetController, UIController);