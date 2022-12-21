function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function openNewCustomerForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function openTransferHistory() {
    document.getElementById("history").style.display = "block";
}

function closeTransferHistory() {
    document.getElementById("history").style.display = "none";
}

function sendMoney(){
    let EnterSenderName = document.getElementById("EnterSenderName").value;
    let enterAmount = parseInt(document.getElementById("enterAmount").value);
    console.log("Here")    
    let SenderBalance = parseInt(document.getElementById(EnterSenderName).innerHTML);
    console.log(SenderBalance)
    if (enterAmount > SenderBalance) {
        alert("Insufficient Balance.")
     }
}

function addCustomer(){
    alert('Customer Saved Successfully...!')
}
    




 





