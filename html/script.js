var bluron = false
var HSN = []
var downloaded = {}
var twData = {}
var lastimage 
var clicked = false
var photoOnScreen = false
var noteslength = 0
var editnote = [bool = false, noteid = ""]
var lastSelectedBankAction = 0
var currentCar = {}
var currentstateHeader = "police"
var currentcarHeader = "info"
var currentContactId = 0
var inCall = false
var CurrentCryptoValue = "bitcoin"
var CurrentAmbulanceHeader = "CreateRecord"
var CurrentPoliceHeader = "pbuttons-citizen"
var CurrentContactsHeader = "contacts"
var CurrentPlayer = 0
var PhotosLoaded = false
var RingsLoaded = false
var CurrentEditedAdds = 0
var xDs = false
var set = {}
var MessagesSelectedFeature = false
var MessageData = {}
var localcontact = {}
let MessageLocalIds = {}
totalBill = 0
totalBillPrice = 0
HSN.IsPhoneOpened = false
HSN.CryptoCommissions = {}
HSN.PhoneBackgrounds = {}
HSN.PlayedMusics = {}
HSN.TwitterData = {}
HSN.PlayerMessages = []
HSN.PlayerIdentifier = 0
HSN.PhoneNumber = 0
var recent = [
    {id: 123,age :12,start: "10/17/13 13:07"}, 
    {id: 13,age :62,start: "07/30/13 16:30"}
];

HSN.EnableAnonymousCall = false
const input = document.getElementById('police-search-citizen-input');
const inputveh = document.getElementById("police-search-vehicle-input");
input.addEventListener('input', updateValue);
inputveh.addEventListener('input', updateValue);
function updateValue(e) {
  $(".citizen-result").remove()
}

window.addEventListener('message', function(event) {
    if (event.data.message == "open") {
        HSN.OpenPhone()
        HSN.SetPhotos(event.data.result)
        HSN.SetBankBalance(event.data.result.charinfo.bankbalance)
        HSN.SetBankPhoto(event.data.result.charinfo.photo)
        HSN.SetIBAN(event.data.result.charinfo.iban)
        HSN.SetPhoneNumber(event.data.result.phonenumber)
        HSN.SetCharacterName(event.data.result.charinfo.firstname,event.data.result.charinfo.lastname)
        HSN.SetEmail(event.data.result.charinfo.firstname.trim()+"_"+event.data.result.charinfo.lastname.trim())
        HSN.SetCryptoName(event.data.result.charinfo.firstname,event.data.result.charinfo.lastname,event.data.result.charinfo.cryptoid, event.data.result.charinfo.bankbalance)
        HSN.SetCryptoData(event.data.result.CryptoCurrency)
        $(".ambulance-welcome").html("Welcome "+ event.data.result.charinfo.firstname+ " " +event.data.result.charinfo.lastname)
        $(".ambulance-job-label").html(event.data.result.job)
        HSN.CryptoCommissions = event.data.cryptoCommissions
        HSN.PhoneBackgrounds = event.data.PhoneBackgrounds
        $(".commission").html("Commission = "+HSN.CryptoCommissions[CurrentCryptoValue]+"%")
        HSN.SetupApps(event.data.result.Apps)
        HSN.SetupBackgrounds(event.data.PhoneBackgrounds)

        var totalApp = document.getElementsByClassName("hsn-phone-apps").length;
        $(".phone-totalapp").html('<strong>Total App</strong>: '+totalApp+'')
        $(".s-m-img").html('<img src="'+event.data.ServerInfo.Photo+'">')
        $(".phone-name").html(event.data.ServerInfo.Name)
        if (!xDs) {
            $(".phone-serialnumber").html('<strong>****</strong>: '+HSN.GenerateRandomStr(7)+'')
            xDs = true
        }
        
        HSN.EnableAnonymousCall = event.data.EnableAnonymousCall
        if (HSN.EnableAnonymousCall) {
            $(".s-settings-index-container").find("[s-id='anon-call']").find("i").css({
                "color":"#197278"
            })
        } else {
            $(".s-settings-index-container").find("[s-id='anon-call']").find("i").css({
                "color":"#ae2012"
            })
        }
        HSN.PlayerIdentifier = event.data.Identifier
        HSN.TwitterData = event.data.result.twitterData
        if (HSN.TwitterData.photo != undefined) {
            if (HSN.TwitterData.photo == "default") {
                $(".twitter-settings-userphoto").html('<img  src="./images/default.png">')
            } else {
                $(".twitter-settings-userphoto").html('<img  src='+HSN.TwitterData.photo+'>')
            }
        } else if (HSN.TwitterData.username != undefined) {
            $(".twitter-settings-username").html('<p>'+HSN.TwitterData.username+'</p>')
        }
        HSN.PlayerMessages = event.data.result.messages
        HSN.PhoneNumber = event.data.result.phonenumber
    } else if (event.data.message == "notification") {
        HSN.AddNewNotification(event.data.data)
    } else if (event.data.message == "setupnewap") {
        HSN.AddNewApp(event.data.newApp)
    } else if (event.data.message == "Download") {
        HSN.DownloadTime(event.data)
    } else if (event.data.message == "DeleteApp") {
        HSN.DeleteApp(event.data.app)
    } else if (event.data.message == "SendNewTweet") {
        HSN.AddNewTweet(event.data.index)
    } else if (event.data.message == "RefreshTwitterLikes") {
        HSN.RefreshTwitterLikes(event.data)
    } else if (event.data.message == "SetPhoto") {
        HSN.SetPhoto(event.data.data)
    } else if (event.data.message == "AddNewNote") {
        HSN.AddNewNote(event.data.data)
    } else if (event.data.message == "DeleteNote") {
        HSN.DeleteNote(event.data.noteid)
    } else if (event.data.message == "AddNewContact") {
        HSN.AddNewContact(event.data.data)
    } else if (event.data.message == "AddNewPhotoToGallert") {
        HSN.AddNewPhotoToGallery(event.data)
    } else if (event.data.message == "SendMoney") {
        HSN.SendBankMoney(event.data.returndata)
    } else if (event.data.message == "AddNewMail") {
        HSN.AddNewMail(event.data.mailData)
    } else if (event.data.message == "AddNewMailToPage") {
        HSN.AddNewMailToPage(event.data.mailData)
    } else if (event.data.message == "DeleteMail") {
        HSN.DeleteMail(event.data.mailId)
    } else if (event.data.message == "RefreshVehicles") {
        HSN.GetPlayerCars()
    } else if (event.data.message == "onlytest") {
        HSN.TestT(event.data)
    } else if (event.data.message == "Close") {
        HSN.ClosePhone()
    } else if (event.data.message == "OpenForNotification") {
        HSN.OpenPhoneForNotifications(event.data.data)
    } else if (event.data.message == "RemoveContact") {
        HSN.RemoveContact(event.data.id)
    } else if (event.data.message ==  "declineCall") {
        HSN.PhoneShowNotification(event.data.reason,"error")
    } else if (event.data.message == "call-answer") {
        HSN.AnswerCall(event.data.type, event.data.photo, event.data.id)
    } else if (event.data.message == "UpdateCryptoValue") {
        HSN.UpdateCryptoValues(event.data.crypto, event.data.value)
    } else if (event.data.message == "PhoneShowNotification") {
        HSN.PhoneShowNotification(event.data.reason,event.data.type)
    } else if (event.data.message == "AddNewCryptoTransfer") {
        HSN.AddNewCryptoTransfer(event.data.data)
    } else if (event.data.message == "DeleteBill") {
        HSN.DeleteBill(event.data.id)
    } else if (event.data.message == "CreateNewPatientData") {
        HSN.AddNewPatientData(event.data.patientData)
    } else if (event.data.message == "DeletePatientData") {
        HSN.DeletePatientData(event.data.id)
    } else if (event.data.message == "DeletePhotoFromGallery") {
        HSN.DeletePhotoFromGallery(event.data.id)
    } else if (event.data.message == "AddNewBolo") {
        HSN.AddNewBolo(event.data.bolodata)
    } else if (event.data.message == "DeleteBolo" ) {
        HSN.DeleteBolo(event.data.boloid)
    } else if (event.data.message == "UpdateBankBalance") {
        HSN.SetBankBalance(event.data.amount)
    } else if (event.data.message == "UpdateAnonymousCall") {
        HSN.EnableAnonymousCall = event.data.EnableAnonymousCall
        if (HSN.EnableAnonymousCall) {
            $(".s-settings-index-container").find("[s-id='anon-call']").find("i").css({
                "color":"#197278"
            })
        } else {
            $(".s-settings-index-container").find("[s-id='anon-call']").find("i").css({
                "color":"#ae2012"
            })
        }
    } else if (event.data.message == "SetJobApp") {
        HSN.AddJobApp(event.data.job)
    } else if (event.data.message == "AddNewAdds") {
        HSN.AddNewAddvertisement(event.data.data)
    } else if (event.data.message == "UpdateMessages") {
        HSN.UpdateMessageData(event.data.newData, event.data.allData, event.data.number)
    } else if (event.data.message == "DeleteAdd") {
        HSN.DeleteAdd(event.data.id)
    } else if (event.data.message == "EditAdd") {
        HSN.EditAdd(event.data.id, event.data.newtext)
    } else if (event.data.message == "UpdateTwitterData") {
        HSN.TwitterData = event.data.data  
        if (HSN.TwitterData.photo != undefined) {
            if (HSN.TwitterData.photo == "default") {
                $(".twitter-settings-userphoto").html('<img  src="./images/default.png">')
            } else {
                $(".twitter-settings-userphoto").html('<img  src='+HSN.TwitterData.photo+'>')
            }
        }
        if (HSN.TwitterData.username != undefined) {
            $(".twitter-settings-username").html('<p>'+HSN.TwitterData.username+'</p>')
        }
    } else if (event.data.message == "UpdateCryptoChanges") {
        HSN.UpdateCryptoChanges(event.data.changes)
    } else if(event.data.message == "PlaySound") {
        HSN.PlaySound(event.data)
    }
})




$(document).on('click', '.bills-payall', function(e){
    $.post("http://hsn-phone/PayAllBils", JSON.stringify({}));
});

$(document).on('click', '.gallery-photos', function(e){
    var img = $(this).attr("photoid")
    var imgSrc = document.getElementById(img).src
    HSN.ShowPhotoOnScreen(imgSrc)
});



$(document).on('click', '.messages-openedchat-message-photo img', function(e){
    HSN.ShowPhotoOnScreen($(this).attr("src"))
});
$(document).on('click', '.ads-index-tooltip-msgside-photo img', function(e){
    HSN.ShowPhotoOnScreen($(this).attr("src"))
});








$(document).on('click', '.messages-index', function(e){
    HSN.GetMessages($(this).attr("phonenumber"))
    
    $(".messages-messageindex").css({'display':'block'}).animate({
        left: 0+"%",
    }, 500);
    HSN.ShowGoBack(true, "messages-index")
    MessageData.number = $(this).attr('phonenumber')
});

$(document).on('click', '.top-info-settings', function(e){
    
    
});


$(document).on('click', '.ads-nads', function(e){
    $(".ads-newads-page").css({'display':'block'}).animate({
        left: 0+"%",
    }, 500);
    HSN.ShowGoBack(true, "ads-nads")
});



$(document).on('click', '.features-index', function(e){
    var feature = $(this).data("feature")
    if (feature == "photo-camera") {
        if (inCall) {
            $(".hsn-phonemain").css({'display':'block'}).animate({
                top: "55%",
            }, 500);
        } else {
            $(".hsn-phonemain").css({'display':'block'}).animate({
                top:"80%",
            }, 100, function(){
                $(".hsn-phonemain").css({'display':'none'});
            });
        }
        $.post('http://hsn-phone/takePhoto', JSON.stringify({}), function(data){
            if (data == "nil") {
                $(".messages-features-container").fadeOut()
                HSN.OpenPhone()
            } else {
                $(".messages-features-container").fadeOut()
                HSN.OpenPhone()
                MessageData.photo = data
            }
        })  
    } else if (feature == "photo-gallery") {
        $(".messages-features-container").fadeOut()
        HSN.OpenGalleryForSelect("messages")
        
    } else if (feature == "gps") {
        $.post('http://hsn-phone/getPlayerGPSCoord', JSON.stringify({}), function(data){
            MessageData.gps = data
        })
        $(".messages-features-container").fadeOut()
    }
});



$(document).on('click', '.sendNote', function(e){
    var title = document.getElementById("notes-title").value
    var text = document.getElementById("notes-text").value 
    var photo = document.getElementById("notes-photo").value
    if (title !== "" && text !== "") {
        noteData = {}
        noteData.title = title
        noteData.text = text
        noteData.photo = photo
        noteData.date = new Date()
        $.post("http://hsn-phone/AddNewNote", JSON.stringify({noteData : noteData}));
       // HSN.SetupNotes()
       $(".shownote").css({'display':'block'}).animate({
        top: "-90%",
    }, 500, function(){
        $(".shownote").css({'display':'none'});
        $(".notes-main").fadeIn()
        HSN.ShowGoBack(true, "Notes")
    });
        HSN.ClearValues("id","notes-text")
        HSN.ClearValues("id","notes-photo")
        HSN.ClearValues("id","notes-title")
    }
});


$(document).on('click', '.newNotee', function(e){
    $(".notes-main").fadeOut()
    setTimeout(function(){ 
        $(".shownote").css({'display':'block'}).animate({
            top: "0",
        });
    },300);
    HSN.ShowGoBack(true, "newnote")
});

$(document).on('click', '.ads-indexs-tooltip-d', function(e){
    var addid = $(this).data("id")
    if (addid) {
        $.post("http://hsn-phone/DeleteAdds", JSON.stringify({id : addid}));
    }
});

$(document).on('click', '.ads-indexs-tooltip-e', function(e){
    var addid = $(this).data("id")
    document.getElementById("ads-edit-message").value = $(".ads-index-container").find("[ads-id="+addid+"]").find(".ads-index-tooltip-msgside-msg").html()
    $(".ads-editadd").css({'display':'block'}).animate({
        bottom: "0",
    });
    CurrentEditedAdds = addid
});
$(document).on('click', '.ads-indexs-tooltip-c', function(e){
    var phonenumber = $(this).data("phonenumber")
    $.post("http://hsn-phone/call", JSON.stringify({phonenumber : phonenumber}));

});


$(document).on('click', '.ads-edit-index', function(e){
    var selected = $(this).attr("id")
    if (selected == "send") {
        var text = document.getElementById("ads-edit-message").value
        if (text != "") {
            $.post("http://hsn-phone/EditAdd", JSON.stringify({id : CurrentEditedAdds, newtext : text}));
            $(".ads-editadd").css({'display':'block'}).animate({
                bottom: "-90%",
            }, 500, function(){
                document.getElementById("ads-edit-message").value = ""
                $(".ads-editadd").css({'display':'none'})
                CurrentEditedAdds = 0
            });
        }
    } else if (selected == "close") {
        $(".ads-editadd").css({'display':'block'}).animate({
            bottom: "-90%",
        }, 500, function(){
            document.getElementById("ads-edit-message").value = ""
            $(".ads-editadd").css({'display':'none'})
            CurrentEditedAdds = 0
        });
    }
});



$(document).on('click', '.messages-send-2', function(e){
    var today = new Date();
    var messagetime = today.getHours() + ":" + today.getMinutes();
    if (document.getElementById("messages-text-2").value == "" && MessageData.photo == undefined && MessageData.gps == undefined) {
        return
    }
    $.post("http://hsn-phone/sendmessage", JSON.stringify({number : MessageData.number, photo : MessageData.photo, gps : MessageData.gps, message : document.getElementById("messages-text-2").value, time : new Date(), messagetime : messagetime, localtime : today}));
    MessageData.photo = undefined
    MessageData.gps = undefined
    document.getElementById("messages-text-2").value = ""
});

$('.messages-send-2').keypress(function(e) {
    if (e.which == 13) {
        var today = new Date();
        var messagetime = today.getHours() + ":" + today.getMinutes();
        if (document.getElementById("messages-text-2").value == "" && MessageData.photo == undefined && MessageData.gps == undefined) {
            return
        }
        $.post("http://hsn-phone/sendmessage", JSON.stringify({number : MessageData.number, photo : MessageData.photo, gps : MessageData.gps, message : document.getElementById("messages-text-2").value, time : new Date(), messagetime : messagetime, localtime : today}));
        MessageData.photo = undefined
        MessageData.gps = undefined
        document.getElementById("messages-text-2").value = ""
    }
});

$('.messages-send').keypress(function(e) {
    if (e.which == 13) {
        var today = new Date();
        var messagetime = today.getHours() + ":" + today.getMinutes();
        if (document.getElementById("messages-text").value == "" && MessageData.photo == undefined && MessageData.gps == undefined) {
            return
        }
        $.post("http://hsn-phone/sendmessage", JSON.stringify({number : MessageData.number, photo : MessageData.photo, gps : MessageData.gps, message : document.getElementById("messages-text").value, time : new Date(), messagetime : messagetime}));
        MessageData.photo = undefined
        MessageData.gps = undefined
        document.getElementById("messages-text").value = ""
    }
});



$(document).on('click', '.messages-send', function(e){
    var today = new Date();
    var messagetime = today.getHours() + ":" + today.getMinutes();
    if (document.getElementById("messages-text").value == "" && MessageData.photo == undefined && MessageData.gps == undefined) {
        return
    }
    $.post("http://hsn-phone/sendmessage", JSON.stringify({number : MessageData.number, photo : MessageData.photo, gps : MessageData.gps, message : document.getElementById("messages-text").value, time : new Date(), messagetime : messagetime}));
    MessageData.photo = undefined
    MessageData.gps = undefined
    document.getElementById("messages-text").value = ""
});



$(document).on('click', '.download', function(e){
    if (downloaded[$(this).attr("id")] != true) {
        $.post("http://hsn-phone/downloadApp", JSON.stringify({appname : $(this).attr("id")}));
    } else if (downloaded[$(this).attr("id")] == true) {
        $.post("http://hsn-phone/deleteApp", JSON.stringify({appname : $(this).attr("id")}));
    }
});

$(document).on('click', '.s-settings-index', function(e){
    var Name = $(this).attr("s-id")
    if (Name == "anon-call") {
        $.post("http://hsn-phone/SetAnonymousCall", JSON.stringify({}));
        return
    }
    $(".settings-pages-"+Name+"").css({'display':'block'}).animate({
        left: 0+"%",
    });
    HSN.ShowGoBack(true, "s-page"+Name+"")
});

$(document).on('click', '.s-cs-i-icon', function(e){
    var id = $(this).attr("id")
    if (id != undefined) {
        if (HSN.PlayedMusics[id] != undefined) {
            HSN.PlayedMusics[id].pause();
            HSN.PlayedMusics[id] = undefined

        } else {
            var music = $(this).data("Music")
            var audioElement = new Audio("rings/"+music+"");
            audioElement.play();
            HSN.PlayedMusics[id] = audioElement
        }
    }
});

$(document).on('click', '.s-plypoto', function(e){
    $(".hsn-phone-changephotocontainer").css({'display':'block'}).animate({
        left: "0%",
    }, 500, function(){
        $(".hsn-phone-changephotocontainer").data("photodata", "charinfo");
    });
});






$(document).on('click', '.ads-newAdd', function(e){
    $(".ads-newadd-page").css({'display':'block'}).animate({
        bottom: 0,
    });
});

$(document).on('click', '.ads-send', function(e){
    var photo = document.getElementById("ads-new-url").value
    var text = document.getElementById("ads-new-message").value
    if (text != "") {
        $.post("http://hsn-phone/AddNewAdds", JSON.stringify({text : text, photo : photo, date : new Date()}));
        $(".ads-newads-page").css({'display':'block'}).animate({
            left: "-90%",
        }, 500, function(){
            HSN.ShowGoBack(true, "Advertisement")
            $(".ads-newads-page").css({'display':'none'})
        });
    }
});



$(document).on('click', '.finance-buyside-icons-index', function(e){
    var SelectedCryptoValue = $(this).attr('cryptoindex')
    var PressedObject = $(".finance-buyside-icons").find('[cryptoindex="'+SelectedCryptoValue+'"]');
    if (CurrentCryptoValue !== SelectedCryptoValue) {
        var PreviousObject = $(".finance-buyside-icons").find('[cryptoindex="'+CurrentCryptoValue+'"]');
        $(PreviousObject).removeClass('selectedcrypto');
        $(PressedObject).addClass('selectedcrypto');
        CurrentCryptoValue = SelectedCryptoValue
        $(".commission").html("Commission = "+HSN.CryptoCommissions[CurrentCryptoValue]+"%")
    }
});


$(document).on('click', '.contacts-keyboard', function(e){
    HSN.ShowGoBack(true,"keyboard")
    $(".contacts-mainside").fadeOut()
    $(".contact-keyboard-page").fadeIn()
});




$(document).on('click', '.buyside-newTransaction', function(e){
    var amount = document.getElementById("finance-amount").value
    var target = document.getElementById("transaction").value
    if (CurrentCryptoValue != undefined) {
        $.post("http://hsn-phone/TransferCrypto", JSON.stringify({crypto : CurrentCryptoValue, amount : amount, targetId : target}));
        HSN.ClearValues("id","finance-amount")
        HSN.ClearValues("id","transaction")
    } 
});




$(document).on('click', '.ambulance-topButtons', function(e){
    var SelectedAmbulanceHeader = $(this).attr('id')
    var PressedObject = $(".ambulance-bottomcontainer").find('[id="'+SelectedAmbulanceHeader+'"]');
    if (CurrentAmbulanceHeader !== SelectedAmbulanceHeader) {
        var PreviousObject = $(".ambulance-bottomcontainer").find('[id="'+CurrentAmbulanceHeader+'"]');
        $(PreviousObject).removeClass('ap-selected');
        $(PressedObject).addClass('ap-selected');
        CurrentAmbulanceHeader = SelectedAmbulanceHeader
        if (SelectedAmbulanceHeader == "TotalRecords") {
            $(".ambulance-createcontainer").fadeOut()
            setTimeout(function(){ $(".ambulance-recordscontainer").fadeIn(); },100);
            $(".ambulance-recordscontainer").fadeIn()
        } else if (SelectedAmbulanceHeader == "CreateRecord") {
            $(".ambulance-recordscontainer").fadeOut()
            setTimeout(function(){ $(".ambulance-createcontainer").fadeIn(); },100);
        }
    }
});

$(document).on('click', '.police-buttons', function(e){
    var SelectedPoliceHeader = $(this).attr('id')
    var PressedObject = $(".police-bottomside").find('[id="'+SelectedPoliceHeader+'"]');
    if (CurrentPoliceHeader !== SelectedPoliceHeader) {
        var PreviousObject = $(".police-bottomside").find('[id="'+CurrentPoliceHeader+'"]');
        $(PreviousObject).removeClass('policeselected');
        $(PressedObject).addClass('policeselected');
        CurrentPoliceHeader = SelectedPoliceHeader
        if (SelectedPoliceHeader == "pbuttons-citizen") {
            $(".police-search-vehicle").fadeOut()
            setTimeout(function(){ $(".police-search-citizen").fadeIn(); },100);
        } else if (SelectedPoliceHeader == "pbuttons-vehicle") {
            $(".police-search-citizen").fadeOut()
            setTimeout(function(){ $(".police-search-vehicle").fadeIn(); },100);
        }
        $(".citizen-result").remove()
    }
});

$(document).on('click', '.messages-features', function(e){
    if (MessagesSelectedFeature) {
        $(".messages-features-container").fadeOut()
    } else {
        $(".messages-features-container").fadeIn()
    }
    MessagesSelectedFeature = !MessagesSelectedFeature
});




$(document).on('click', '.police-search', function(e){
    var index = $(this).attr("id")
    if (index == "citizen") {
        var FLName = document.getElementById("police-search-citizen-input").value
        if (FLName != "") {
            $.post('http://hsn-phone/SearchCitizen', JSON.stringify({data : FLName}), function(data){
                if (data.length == 0) {
                    $(".noresults-search").fadeIn()
                } else {
                    $.each(data, function (i, result) {
                        $(".noresults-search").fadeOut()
                        var fullName = result.firstname +' '+result.lastname
                        i = i + 1
                        $(".citizen-search-resultside").append('<div class="citizen-result" type="citizen" citizenid='+i+'><p>'+fullName+'</p> </div>')
                        $(".citizen-search-resultside").find("[citizenid="+i+"]").data("PlayerData", result)  
                    })
                }
            })
        }  
    } else if (index == "vehicle") {
        var plate = document.getElementById("police-search-vehicle-input").value
        if (plate != "") {
            $.post('http://hsn-phone/SearchVehicle', JSON.stringify({plate : plate}), function(data){
                if (data.length == 0) {
                    $(".noresults-search").fadeIn()
                } else {
                    $.each(data, function (i, result) {
                        $(".noresults-search").fadeOut()
                        $(".citizen-search-resultside").append('<div class="citizen-result " type="vehicle" vehid='+i+'><p>'+result.plate+'</p> </div>')
                        $(".citizen-search-resultside").find("[vehid="+i+"]").data("VehicleData", result)  
                    })
                }
            })
        }  
    }

});

$(document).on('click', '.pd-plyfile-delete', function(e){
    var id = $(this).attr("deleteid")
    $.post("http://hsn-phone/DeleteBolo", JSON.stringify({Player : CurrentPlayer, boloid : id}));
});




$(document).on('click', '.citizen-result', function(e){
    var type = $(this).attr("type")
    if (type == "citizen"){
        var Id = $(this).attr("citizenid")
        var PlyData = $(".citizen-search-resultside").find("[citizenid="+Id+"]").data("PlayerData")
        CurrentPlayer = PlyData.identifier
        $(".police-showply").html('<div class="police-plyname">Fullname</div><div class="police-plyname-index">'+PlyData.firstname+'</div><div class="police-phonenumber">P. Number</div><div class="police-phonenumber-index">'+PlyData.phone_number+'</div><div class="police-plyphoto"><img  src="'+PlyData.phonedata.photo+'"></div><div class="pd-plyfile-container"><div class="pd-plyfile-header">Add Bolo</div><textarea id="plyfile-textarea-reason" style="text-align:left; padding-top:7px; padding-left:15px;" placeholder="Reason" cols="30" maxlength = "70" rows="10" spellcheck="false" required></textarea><textarea id="plyfile-textarea-photo" style="text-align:left; padding-top:7px; padding-left:15px;" placeholder="Photo" cols="30" maxlength = "70" rows="10" spellcheck="false" required></textarea><div class="police-selectfromgallery"><i class="fas fa-image"></i></div><div class="plyfile-submitbutton"><i class="fas fa-check-circle"></i></div></div><div class="pd-plyfiles-container"><div class="pd-plyfiles-none">The person has not got any bolos!</div></div>')
        HSN.GetBolos(PlyData.bolos)
        if (Id) {
            HSN.ShowGoBack(true, "PoliceShowPly")
            $(".police-indexside").fadeOut()
            $(".police-showply").css({'display':'block'}).animate({
                left: 0+"%",
            });
        }
    } else if (type == "vehicle") {
        var Id = $(this).attr("vehid")
        var VehicleData = $(".citizen-search-resultside").find("[vehid="+Id+"]").data("VehicleData")
        $(".police-showvehdata").find("[id='owner']").find(".showvehdata-title-index").html(VehicleData.carowner)
        $(".police-showvehdata").find("[id='plate']").find(".showvehdata-title-index").html(VehicleData.plate)
        $(".police-showvehdata").find("[id='model']").find(".showvehdata-title-index").html(VehicleData.vehLabel)
        $(".police-showvehdata").find("[id='stored']").find(".showvehdata-title-index").html(VehicleData.stored)
        HSN.ShowGoBack(true, "PoliceShowVeh")
        $(".police-indexside").fadeOut()
        $(".police-showvehdata").css({'display':'block'}).animate({
            left: 0+"%",
        });
    }
});



$(document).on('click', '.plyfile-submitbutton', function(e){
    var reason = document.getElementById("plyfile-textarea-reason").value
    var photo = document.getElementById("plyfile-textarea-photo").value
    if (reason != "" && CurrentPlayer != 0) {
        $.post("http://hsn-phone/addnewbolo", JSON.stringify({player : CurrentPlayer, reason : reason, photo : photo}));
    }
});




$(document).on('click', '.ambulance-records-photolink', function(e){
    var PhotoSrc = $(this).attr("photoid")
    HSN.ShowPhotoOnScreen(PhotoSrc)
});

$(document).on('click', '.pd-plyfile-link', function(e){
    var PhotoSrc = $(this).attr("hoverImg")
    HSN.ShowPhotoOnScreen(PhotoSrc)
});



$(document).on('click', '.ambulance-records-delete', function(e){
    var PatientId = $(this).attr("patientDeleteId")
    $.post("http://hsn-phone/AmbulanceDeletePatient", JSON.stringify({patient : PatientId }));
});

$(document).on('click', '.notes-selectfromgallery', function(e){
    HSN.OpenGalleryForSelect("notes")
});

$(document).on('click', '.ambulance-selectfromgallery', function(e){
    HSN.OpenGalleryForSelect("ambulanceapp")
});

$(document).on('click', '.police-selectfromgallery', function(e){
    HSN.OpenGalleryForSelect("policeapp")
});


$(document).on('click', '.twitter-selectfromgallery', function(e){
    HSN.OpenGalleryForSelect("twitter")
});

$(document).on('click', '.ads-selectfromgallery', function(e){
    HSN.OpenGalleryForSelect("ads")
});












$(document).on('click', '.ambulance-SubmitData', function(e){
    var fullname = document.getElementById("ambulance-target").value
    var message = document.getElementById("ambulance-createtext").value
    var photo = document.getElementById("ambulance-photo").value
    $.post("http://hsn-phone/AmbulanceCreateNewPatientData", JSON.stringify({date : new Date(), name : fullname, message : message, photo : photo }));
});


$(document).on('click', '.hsn-phone-apps', function(e){
    var appName = $(this).attr('id')
    HSN.OpenApp(appName)
    HSN.ShowGoBack(true,appName)
});



$(document).on('click', '.bottomside-settings', function(e){
    var id = $(this).attr('id')
    if (id == "edit") {
        
    }else if (id == "delete") {
        if (currentContactId != 0) {
            $.post("http://hsn-phone/DeleteContact", JSON.stringify({contactid : currentContactId}));
            $(".contact-showcontact").fadeOut()
            $(".contacts-mainside").fadeIn()
            HSN.ShowGoBack(true,"contacts")
        }
    }
});



$(document).on('click', '.rotate', function(e){
    var id = $(this).attr("id")
    if (id != undefined) {
        $(".finance-bottomside").find("[cryptoid="+id+"]").css({'display':'block'}).animate({
            left: "-80%",
        }, 500, function(){
            $(".finance-bottomside").find("[cryptoid="+id+"]").css({'display':'none'});
            $(".finance-bottomside").find("[cryptoid2="+id+"]").css({'display':'block'}).animate({
                right: "0",
            }, 500);
        });
    }
});


$(document).on('click', '.messages-openedchat-message-gps i', function(e){
    $.post("http://hsn-phone/SetLocation", JSON.stringify({x : $(this).attr("coord-x"), y : $(this).attr("coord-y"), z : $(this).attr("coord-z") }));
});





$(document).on('click', '.rotate2', function(e){
    var id = $(this).attr("id2")
    if (id != undefined) {
        $(".finance-bottomside").find("[cryptoid2="+id+"]").css({'display':'block'}).animate({
            right: "-80%",
        }, 500, function(){
            $(".finance-bottomside").find("[cryptoid2="+id+"]").css({'display':'none'});

            $(".finance-bottomside").find("[cryptoid="+id+"]").css({'display':'block'}).animate({
                left: "0",
            }, 500);

        });
    }
});

$(document).on('click', '.crypto-iconnn', function(e){
    var id = $(this).attr("idd")
    var CryptoCurrency = (id).split("-")[1]
    if (id.includes('buy')) { // check string
        var amount = document.getElementById("crypto-buy-amount-"+CryptoCurrency+"-buy").value
        $.post("http://hsn-phone/BuyOrSellCryptoCurrency", JSON.stringify({type : "buy", amount : amount, crypto : CryptoCurrency}));
    } else if (id.includes('sell')) { // check string
        var amount = document.getElementById("crypto-buy-amount-"+CryptoCurrency+"-sell").value
        $.post("http://hsn-phone/BuyOrSellCryptoCurrency", JSON.stringify({type : "sell", amount : amount, crypto : CryptoCurrency}));
    }
});


$(document).on('click', '.finance-buybutton', function(e){
    $(".finance-main").fadeOut()
    $(".finance-buy-side").fadeIn()
    HSN.ShowGoBack(true, "finance-buy-side")
});

$(document).on('click', '.hsn-phonemain-closephone', function(e){
    HSN.ClosePhone()
});


$(document).on('keydown', function() {
    switch(event.keyCode) {
        case 27: // ESC
            HSN.ClosePhone()
            break;
        case 113: // ESC
            HSN.ClosePhone()
            break;
    }
});

$(document).on('click', '.newcontact-submit', function(e){
    var name = document.getElementById("contact-name").value
    var number = document.getElementById("contact-phonenumber").value
    if (name != "" && number != "") {
        data = {}
        data.name = name
        data.phonenumber = number
        $.post("http://hsn-phone/addnewContact", JSON.stringify({contactData : data}));
        $(".contact-addnewcontact").fadeOut()
        $(".contacts-mainside").fadeIn()
        HSN.ShowGoBack(true,"contacts")
        HSN.ClearValues("id","contact-phonenumber")
        HSN.ClearValues("id","contact-name")
    }else {
        HSN.PhoneShowNotification("Name or number can not be blank!","error")
    }
});

$(document).on('click', '.calls', function(e){
    var id = $(this).attr('lastcall-id')
    $(".lastcalls-container").find("[lastcall-id="+id+"]").css({"left":"-10%"}) 
    $(".lastcalls-container").find("[lastcall-id="+id+"]").find(".onlytest").show()
    $(".lastcalls-container").find("[lastcall-id="+id+"]").find(".onlytest").css({"left":"100%"})
});

$("body").delegate('.calls', 'mouseleave', function(){
    var id = $(this).attr('lastcall-id')
    $(".lastcalls-container").find("[lastcall-id="+id+"]").css({"left":"7%"})
    //$(".lastcalls-container").find("[lastcall-id="+id+"]").find(".onlytest").hide()
    $(".lastcalls-container").find("[lastcall-id="+id+"]").find(".onlytest").fadeOut(600)
});





$(document).on('click', '.carinfo', function(e){
    var CarData = $(this).data("CarData")
    var stored = $(this).data("stored")
    if (stored == "stored") {
        HSN.ToggleValet(CarData)
    }
    
    
});

$(document).on('dblclick', '.s-background-photo', function(e){
    var id = $(this).attr('id')
    var Photo = HSN.PhoneBackgrounds[Number(id)]
    $.post("http://hsn-phone/ChangePhoto", JSON.stringify({photoindex : "phone-background", photo : Photo})); 
    $(".settings-pages-background").css({'display':'block'}).animate({
        left: -100+"%",
    }, 500, function(){
        $(".settings-pages-background").css({'display':'none'});
        HSN.ShowGoBack(true, "settings")
    });
});

$(document).on('click', '.remote-checkbox', function(e){
    var id = $(this).attr('id')
    if (document.getElementById(id).checked) {
        document.getElementById(id).checked = false
        $.post("http://hsn-phone/RemoteVehicle", JSON.stringify({index : id, plate : currentCar.plate, bool : true}));
    } else {
        document.getElementById(id).checked = true
        $.post("http://hsn-phone/RemoteVehicle", JSON.stringify({index : id, plate : currentCar.plate, bool : false}));
    }
});

$(document).on('click', '.hsn-phonemain-createnotification-interactions', function(e){
    var id = $(this).attr('id')
    if (id == "cancelcall") {
        $.post("http://hsn-phone/AnswerCall", JSON.stringify({type : id}));
    } else if (id == "accept") {
        $.post("http://hsn-phone/AnswerCall", JSON.stringify({type : id}));
    } else if (id == "decline") {
        $.post("http://hsn-phone/AnswerCall", JSON.stringify({type : id}));
    }
});



$(document).on('click', '.ads-index-s', function(e){
    var id = $(this).attr('id')

    if (id == "phonecall") {
        var number = $(this).attr("number")
        $.post("http://hsn-phone/call", JSON.stringify({phonenumber :number }));
    } 
});

$(document).on('click', '.showcontact-index', function(e){
    var id = $(this).attr('id')

    if (id == "call") {
        $.post("http://hsn-phone/call", JSON.stringify({phonenumber : $(this).attr('contactid')}));
    } else if (id == "message") {
        //if (HSN.PhoneNumber != $(this).attr('number') ) {
            HSN.ShowGoBack(false)
            $(".contact-showcontact").fadeOut()
            $(".contacts-mainside").fadeIn()
            HSN.CloseAppPage(".hsn-phonemain-contacts-entry",-100)
            setTimeout(function(){
                HSN.GetMessagePlayers()
                HSN.OpenAppPage(".hsn-phonemain-messages-entry",1)
            },500);
            setTimeout(function(){
                HSN.GetMessages(localcontact.phonenumber, localcontact)
                $(".messages-messageindex").css({'display':'block'}).animate({
                    left: 0+"%",
                }, 500);
                HSN.ShowGoBack(true, "messages-index")
            },1000);
            MessageData.number = $(this).attr('number')
        //}
    } 
});






function copyFormatted (html) {
    // Create container for the HTML
    // [1]
    var container = document.createElement('div')
    container.innerHTML = html
  
    // Hide element
    // [2]

  
    // Detect all style sheets of the page

  
    // Mount the container to the DOM to make `contentWindow` available
    // [3]
    document.body.appendChild(container)
  
    // Copy to clipboard
    // [4]
    window.getSelection().removeAllRanges()
  
    var range = document.createRange()
    range.selectNode(container)
    window.getSelection().addRange(range)
  
    // [5.1]
    document.execCommand('copy')
  
    // [5.2]

  
    // [5.3]
    document.execCommand('copy')
  
    // [5.4]

  
    // Remove the container
    // [6]
    document.body.removeChild(container)
  }
  


$(document).on('click', '.cryptocurrency-decrease', function(e){
    selectedBox = $(this).find("p").html();
    copyFormatted(selectedBox) 
    //HSN.PhoneShowNotification("Coppied!","success")
});

$(document).on('click', '.finance-cryptoid', function(e){
    selectedBox = $(this).html();
    copyFormatted(selectedBox) 
    //HSN.PhoneShowNotification("Coppied!","success")
});



$(document).on('click', '.save-icon', function(e){
    var id = $(this).attr('id')
    $.post("http://hsn-phone/addPhotoToGallery", JSON.stringify({photo : id}));
    $(".phone-photo-container").fadeOut(80)
});

$(document).on('click', '.contact', function(e){
    var id = $(this).attr("contactid")
    var contactData = $(".contacts-contactside").find("[contactid="+id+"]").data("contactData")
    currentContactId = contactData.id
    localcontact = contactData
    $(".contacts-mainside").fadeOut()
    $(".contact-showcontact").html('<div class="showcontact-plyphoto"><img src='+HSN.CalculateMessagesPhoto(contactData.photo)+'></div><div class="showcontact-plyname">'+contactData.name+'</div><div class="showcontact-number">'+contactData.phonenumber+'</div><div class="showcontact-index" id="call" contactid='+contactData.phonenumber+'><i class="fas fa-phone-alt"></i></div><div class="showcontact-index" number='+contactData.phonenumber+' style="background: #6c5aee;" id="message"><i class="fas fa-envelope"></i></div><div class="contact-showcontact-bottomside"><div class="bottomside-settings" id="delete"><div class="settings-header">Delete Contact</div><div class="bottomside-settings-iconside" iconindex='+contactData.phonenumber+'><i class="fas fa-trash-alt"></i></div></div></div>')
    $(".contact-showcontact").fadeIn()
    
    HSN.ShowGoBack(true,"showcontact")
});

$(document).on('click', '.cars-info-index-buttons', function(e){
    var id = $(this).attr('id')
    if (currentcarHeader != id) {
        if (currentcarHeader == "info") {
            $(".cars-info").fadeOut()
            $(".cars-remote").fadeIn()
            if (!currentCar.IsCarAllowedForRemote) {
                $(".cars-remote-features-container").hide()
                $(".remote-notallowedmessage").fadeIn()
                if (currentCar.stored) {
                    $(".cars-remote-useValet").show()
                } else {
                    $(".cars-remote-useValet").hide()
                }
            } else {
                $(".cars-remote-features-container").show()
                if (currentCar.stored) {
                    $(".cars-remote-features-container").hide()
                    $(".cars-remote-useValet").show()
                    HSN.PhoneShowNotification("We can't find your vehicle","error")
                } else {
                    $(".cars-remote-useValet").hide()
                    $(".remote-notallowedmessage").hide()
                }
            }
        } else if (currentcarHeader == "remote") {
            $(".cars-remote").fadeOut()
            $(".cars-info").fadeIn()
        }
        currentcarHeader = id
    }
});

$(document).on('click', '.hsn-phonemain', function(e){
    if (photoOnScreen) {
        $(".phone-photo-container").fadeOut(300)
        photoOnScreen = false
    }
});






$(document).on('click', '.hsn-phonemain-bottomcontainer-gallery-photo', function(e){
    HSN.OpenApp("Gallery")
    HSN.ShowGoBack(true,"Gallery")
});

$(document).on('click', '.hsn-phonemain-bottomcontainer-contacts-photo', function(e){
    
});

$(document).on('click', '.hsn-phonemain-bottomcontainer-camera-photo', function(e){
    
});


$(document).on('click', '.onlytest', function(e){
    var id = $(this).attr('id')
    HSN.DeleteLastCall(id)
});


$(document).on('click', '.cars-mycars-', function(e){
    HSN.SetCarFeatures($(this).data("carData"))
});


$(document).on('click', '.state-jobs-container-index-icon ', function(e){
    $.post("http://hsn-phone/call", JSON.stringify({phonenumber : $(this).attr("phonenumber")}));
});






$(document).on('click', '#mail-delete', function(e){
    var id = $(this).attr('mailId')
    setTimeout(function(){ $(".mail-showmail").fadeOut(100); },100);
    $.post("http://hsn-phone/DeleteMail", JSON.stringify({id : id}));
    HSN.ShowGoBack(true,"Mail")
});


$(document).on('click', '.tweetside-icons', function(e){
    var id = $(this).attr('id')
    if (id == "like") {
        var tweetid = $(this).attr('tweetid') 
        // $(".twitter-tweetside").find('[tweetid='+tweetid+']').html('<i class="fas fa-heart"></i><p>1</p>')
        // $(".twitter-tweetside").find('[tweetid='+tweetid+']').find("i").css({"color":"red"})
        HSN.ToggleLikeTweet(tweetid)
    }
});

HSN.ToggleLikeTweet = function(tweetid) {
    $.post("http://hsn-phone/LikeTweet", JSON.stringify({tweetid : tweetid}));
}

HSN.RefreshTwitterLikes = function(data) {
    if (data.tweetid == null || data.tweetid == undefined) {
        data.tweetid = data.id
    }
    if (data.likes == 0) {
        $(".twitter-tweetside").find('[tweetid='+data.tweetid+']').html('<i class="fas fa-heart"></i>')  
    } else {
        $(".twitter-tweetside").find('[tweetid='+data.tweetid+']').html('<i class="fas fa-heart"></i><p>'+data.likes+'</p>')  
    }
}





$(document).on('click', '.twitter-settings-index-class', function(e){
    var id = $(this).attr('id')
    if (id == "logout") {
        HSN.TwitterLogOut()
    } else if (id == "deleteaccount") {
        HSN.DeleteTwitterAccount()
    } else if (id == "changephoto") {
        $(".hsn-phone-changephotocontainer").css({'display':'block'}).animate({
            left: "0%",
        }, 500, function(){
            $(".hsn-phone-changephotocontainer").data("photodata", "twitter");
        });
    } else if (id == "notifications") {
        
    }
});


$(document).on('click', '.contacts-addnewContact', function(e){
    $(".contacts-addnewcontact-container").fadeIn(300)
    HSN.ShowGoBack(true,"contacts-addnewcontact")
});




$(document).on('click', '.hsn-phone-changephotocontainer-icons', function(e){
    var id = $(this).attr('id')
    if (id == "submit") {
        $(".hsn-phone-changephotocontainer").css({'display':'block'}).animate({
            left: "-100%",
        }, 500, function(){
            $(".hsn-phone-changephotocontainer").css({'display':'none'})
            HSN.ChangePhoto(document.getElementById("changephoto-textarea").value)
            $(".hsn-phone-changephotocontainer").removeData("photodata");
            document.getElementById("changephoto-textarea").value = ""
        });
    } else if (id == "close") {
        $(".hsn-phone-changephotocontainer").css({'display':'block'}).animate({
            left: "-100%",
        }, 500, function(){
            $(".hsn-phone-changephotocontainer").css({'display':'none'})
            $(".hsn-phone-changephotocontainer").removeData("photodata");
        });
    }
});



$(document).on('click', '.removeoutput', function(e){
    document.getElementById("outputtest").innerText = document.getElementById("outputtest").innerText.toString().slice(0, -1)
});



$(document).on('click', '.notifications-container-index-topside-delete', function(e){
    let messageId = $(this).attr('id')
    $(".notifications-container").find("[message-id="+messageId+"]").fadeOut(150)
    $.post("http://hsn-phone/deleteMessage", JSON.stringify({messageId : messageId}));
});



$(document).on('click', '.goback', function(e){
    var backId = $(this).attr('id')
    HSN.GoBack(backId)
});







$(document).on("click", ".twitter-main-addtweet", function(e){
    HSN.ShowGoBack(true,"addtweet")
    HSN.OpenApp("twitter-addtweet")
});

$(document).on("click", ".twitter-settingspage", function(e){
    HSN.ShowGoBack(true,"twitter-settings")
    HSN.OpenApp("twitter-settings")
});

$(document).on("click", ".myNotes-delete", function(e){
    var deleteid = $(this).attr('deleteid')
    $.post("http://hsn-phone/deleteNote", JSON.stringify({noteid : deleteid}));
});

// $(document).on("click", ".gallery-photos img", function(e){
//     var photoid = $(this).attr('src')
//     HSN.ShowPhotoOnScreen(photoid)
// });






$(document).on("click", ".tweetside-photoside img", function(e){
    var photoid = $(this).attr('src')
    HSN.ShowPhotoOnScreen(photoid)
});
$(document).on("click", ".messages-photoside img", function(e){
    var photoid = $(this).attr('src')
    HSN.ShowPhotoOnScreen(photoid)
});


$(document).on("click", ".recents-ply-container", function(e){
    $(this).addClass('recents-ply-container-info');
});



$(document).on("click", ".addnewcontact", function(e){
    $(".contacts-mainside").fadeOut()
    $(".contact-addnewcontact").fadeIn()
    HSN.ShowGoBack(true,"AddNewContact")
});


$(document).on("click", ".myBills", function(e){
    let billId = $(this).attr("id")
    if (billId !== undefined) {
        var Sended = $.post("http://hsn-phone/PayBill", JSON.stringify({id : billId}));
    }
});





$(document).on("click", ".banks-bottom-acts", function(e){
    var id = $(this).attr('id');
    if (id !== lastSelectedBankAction) {
        $('.hsn-phonemain-bank-entry').find('[id='+lastSelectedBankAction+']').removeClass('banks-bottom-acts-active');
        $(this).addClass('banks-bottom-acts-active');
        lastSelectedBankAction = id;
            if (id == "newtransfer") {
                // $(".banks-newtransfer-container").css({"display":"block"})
                // $(".banks-newtransfer-container").css({"width":"100%"})
                $(".banks-newtransfer-container").css({'display':'block'}).animate({
                    left: "0",
                }, 500);
            } else if (id == "recents") {
                $(".banks-recents-container").css({'display':'block'}).animate({
                    left: "0",
                }, 500);
            }
    } else {
        if (id == "newtransfer") {
            $(".banks-newtransfer-container").css({'display':'block'}).animate({
                left: "-80%",
            }, 500, function(){
                $(".banks-newtransfer-container").css({'display':'none'});
            });
            $('.hsn-phonemain-bank-entry').find('[id='+id+']').removeClass('banks-bottom-acts-active');
            lastSelectedBankAction = 0
        } else if (id == "recents") {
            $(".banks-recents-container").css({'display':'block'}).animate({
                left: "-80%",
            }, 500, function(){
                $(".banks-recents-container").css({'display':'none'});
            });
            $('.hsn-phonemain-bank-entry').find('[id='+id+']').removeClass('banks-bottom-acts-active');
            lastSelectedBankAction = 0
        }
    }
    // if (id == "newtransfer") {
    //     $(".banks-newtransfer-container").css({"display":"block"})
    //     $(".banks-newtransfer-container").css({"width":"100%"})
    // }
});






$(document).on("click", ".send", function(e){
    var value = document.getElementById("tweet-new-message").value
    var photovalue = document.getElementById("tweet-new-url").value
    if (value !=="") {
        var data = {}
        data.message = value
        data.photo = photovalue
        data.date = new Date()
        $.post("http://hsn-phone/SendNewTweet", JSON.stringify({index : data}));
        $("#tweet-new-message").val("")
        $(".twitter-addtweet-container").fadeOut(300)
        $(".twitter-main").fadeIn(300)
        $(".twitter-main-bottomcontainer").fadeIn(300)
        HSN.ShowGoBack(true,"Twitter")
       // HSN.GetTweets()
    }
})


HSN.TestT = function(data) {
    
}


$(document).on('click', '.hsn-phonemain-bottomcontainer-settings', function(e){
    HSN.OpenApp("settings")
    HSN.ShowGoBack(true,"settings")
});

// $(document).on('click', '.interaction', function(e){
//     var selector = $(this).attr('id')
//     if (selector == 'call') {
//         $(".last-calls").fadeOut(50)
//         $(".calls-callside").fadeIn(300)
//     } else if (selector == "homepage") {
//         HSN.GetLastCalls()
//         $(".calls-callside").hide()
//         $(".last-calls").fadeIn(300)
//     }
// });


$(document).on('click', '.state-jobs-name', function(e){
    var selectedstateheader = $(this).attr('id')
    var PressedObject = $(".hsn-phonemain-state-entry").find('[id="'+selectedstateheader+'"]');
    if (currentstateHeader !== selectedstateheader) {
        var PreviousObject = $(".hsn-phonemain-state-entry").find('[id="'+currentstateHeader+'"]');

        if (selectedstateheader == "police") {
            HSN.SetActiveJobs(selectedstateheader)
        } else if (selectedstateheader == "ambulance") {
            HSN.SetActiveJobs(selectedstateheader)
        } else if (selectedstateheader == "lawyer") {
            HSN.SetActiveJobs(selectedstateheader)
        } else if (selectedstateheader == "taxi") {
            HSN.SetActiveJobs(selectedstateheader)
        }

        $(PreviousObject).removeClass('banks-bottom-acts-active');
        $(PressedObject).addClass('banks-bottom-acts-active');
        setTimeout(function(){ currentstateHeader = selectedstateheader; }, 100)
    }
});

HSN.SetActiveJobs = function(cur) {
    var message = ""
    if (cur == "police") {
        message = "Active Polices"
    } else if (cur == "ambulance") {
        message = "Active Doctors"
    } else if (cur == "lawyer") {
        message = "Active Lawyers"
    } else if (cur == "taxi") {
        message = "Active Taxi"
    }
    $(".state-jobs-container").html("")
    $(".state-active-jobs").html(message)
    $.post('http://hsn-phone/GetActiveJob', JSON.stringify({job : cur}), function(data){
        if (data !== "") {
            $.each(data, function (i, result) {
                $(".state-nonenotify").fadeOut()
                //$(".state-jobs-container").find("[id="+result.phonenumber+"]").remove();
                $(".state-jobs-container").append('<div class="state-jobs-container-index" id='+result.phonenumber+'><div class="state-jobs-container-index-name">'+result.firstname+' '+result.lastname+'</div><div class="state-jobs-container-index-icon" phonenumber='+result.phonenumber+'><i class="fas fa-phone"></i></div></div>')
            })
        } else if (data == ""){
            $(".state-nonenotify").fadeIn()
        }
    });
}



$(document).on('click', '.hsn-phonemain-settings-entry .settings-charinfo .settings-charinfo-photo-changephoto', function(e){
    $(".hsn-phone-changephotocontainer").css({'display':'block'}).animate({
        left: "0%",
    }, 500, function(){
        $(".hsn-phone-changephotocontainer").data("photodata", "charinfo");
    });
});

$(document).on('click', '.delete-notification', function(e){
    var notificationid = $(this).attr('notification-id')
    $(".notifications-table").find("[id="+notificationid+"]").fadeOut(250)
});



$(document).on('click', '.photo-text-exit', function(e){
    $(".photo-text").css("width","0")
        setTimeout(function(){ $(".photo-text").hide(); }, 50);
 });

$(document).on('click', '.photo-text-yes', function(e){
    let inputValue = $(".text-bar").val()
    if (inputValue != "") {
        $(".settings-charinfo-photo").css("background-image","url('"+inputValue+"')")
        return
    }
});

$(document).on('click', '.settings-background .background-fasfa', function(e){

    $(".hsn-phone-changephotocontainer").css({'display':'block'}).animate({
        left: "0%",
    }, 500, function(){
        $(".hsn-phone-changephotocontainer").data("photodata", "phone-background");
    });
});

$(document).on('click', '.photo-text2-exit', function(e){
    $(".photo-text2").css("width","0")
    setTimeout(function(){ $(".photo-text2").hide(); }, 50);
 });

 









$(document).on('click', '#test-bar', function(e){
   if (inputValue == "on") {
       inputValue = "off"
       $(".phonemain-accts").html("<i class='fas fa-plane'></i>")
       //$(".phonemain-accts").fadeOut(300)
   }  else if (inputValue == "off") {
       inputValue = "on"
       $(".phonemain-accts").html('<i class="fas fa-signal"></i><i class="fas fa-wifi"></i><i class="fas fa-battery-full"></i>')
   }
});

$(document).on('click', '.addnewNote-icon', function(e){
    var id = $(this).attr('id')
    if (id == "submit") {
        var title = document.getElementById("notes-titlecontainer").value
        var text = document.getElementById("notes-textcontainer").value 
        var photo = ""
        if (title !== "" && text !== "") {
            if (editnote.bool) {
                noteData = {}
                noteData.title = title
                noteData.text = text
                noteData.photo = photo
                noteData.date = new Date()
                $.post("http://hsn-phone/editnote", JSON.stringify({noteid : editnote.noteid, noteData : noteData}));
                HSN.SetupNotes()
                $(".hsn-phonemain-notes-addNewNote").fadeOut(300)
                HSN.ShowGoBack(true,"Notes")
                HSN.ClearValues("id","notes-titlecontainer")
                HSN.ClearValues("id","notes-textcontainer")
            } else {
                noteData = {}
                noteData.title = title
                noteData.text = text
                noteData.photo = photo
                noteData.date = new Date()
                $.post("http://hsn-phone/AddNewNote", JSON.stringify({noteData : noteData}));
                $(".hsn-phonemain-notes-addNewNote").fadeOut(300)
                HSN.ShowGoBack(true,"Notes")
                HSN.ClearValues("id","notes-titlecontainer")
                HSN.ClearValues("id","notes-textcontainer")
            }
        }
    }
});




 $(document).on('click', '.twitter-nextbutton', function(e){
    let name = document.getElementById("nameinput").value
    let username = document.getElementById("numberinput").value
    let password = document.getElementById("passwordinput").value
    if (name !== "" && username !== "" && password !== "") {
        $.post('http://hsn-phone/IsUserNameTaken', JSON.stringify({username : username}), function(data){
            if (data) {
                $(".line2").css({"background-color":"red"})
                HSN.PhoneShowNotification("Bu kullanıcı adı zaten alınmış","error")
                setTimeout(function(){ $(".line2").css({"background-color":"rgba(255, 255, 255, 0.679)"}); }, 2000);
            } else {
                $(".line2").css({"background-color":"rgba(255, 255, 255, 0.679)"})
                twData.username = username
                twData.password = password
                HSN.TwitterNext()
            }
        });
    }
 });



 $("body").delegate('.password-show', 'mouseleave', function(){
    var id = $(this).attr('id')
    if (id == "register") {
        var x = document.getElementById("passwordinput");
        x.type = "password";
    } else {
        var x = document.getElementById("login-passwordinput");
        x.type = "password";
    }
});

$(document).on("mouseenter", ".password-show", function(e){
    var id = $(this).attr('id')

    if (id == "register") {
        var x = document.getElementById("passwordinput");
        x.type = "text";
    } else {
        var x = document.getElementById("login-passwordinput");
        x.type = "text";
    }
})

$(document).on('click', '.confirm', function(e){
    $.post("http://hsn-phone/registerTwitter", JSON.stringify({twData : twData}));
    $(".twitter-register-main").fadeOut(80)
    $(".twitter-register-confirm").fadeOut(80)
    $(".twitter-main").fadeIn(80)
    HSN.ShowGoBack(true,"Twitter Main")
    HSN.GetTweets()
});


$(document).on('click', '.delete-galleryphoto', function(e){
    var id = $(this).attr('imgid')
    
});


HSN.DeletePhotoGallery = function(imgid) {
    $(".gallery-photoside").find("[id="+imgid+"]").remove()
}


$(document).on('click', '.noteContainer-notes', function(e){
    var id = $(this).attr('noteId')
    HSN.SetupNote(id)
});


$(document).on('click', '.mail-mails', function(e){
    var id = $(this).attr('id')
    HSN.SetupMail(id)
});









// Functions


HSN.OpenApp = function(appname) {
    if (appname == "AppStore") {
        HSN.OpenAppPage(".hsn-phonemain-apps-entry",1)
    } else if (appname == "settings") {
        HSN.OpenAppPage(".hsn-phonemain-settings-entry",1)
    } else if (appname == "Twitter") {
        HSN.OpenAppPage(".hsn-phonemain-twitter-entry",1)
        if (HSN.TwitterData.username != undefined) {
                HSN.GetTweets()
                $(".twitter-login").fadeOut()
                $(".twitter-register-main").fadeOut()
                $(".twitter-main").fadeIn()
                $(".twitter-settings-username").html('<p>'+HSN.TwitterData.username+'</p>')
                if (HSN.TwitterData.photo != undefined) {
                    if (HSN.TwitterData.photo == "default") {
                        $(".twitter-settings-userphoto").html('<img  src="./images/default.png">')
                    } else {
                        $(".twitter-settings-userphoto").html('<img  src='+HSN.TwitterData.photo+'>')
                    }
                }
        } else {
            $(".twitter-login").fadeOut()
            $(".twitter-register-main").fadeIn()
            $(".twitter-main").fadeOut()
        }
    } else if (appname == "notifications") {
        HSN.GetNotifications()
        // $(".hsn-phonemain-notifications-entry").fadeIn(300)
        // $(".hsn-phonemain-apps").fadeOut(300)
        // $(".hsn-phonemain-bottomcontainer").fadeOut(300)
    } else if (appname == "twitter-addtweet") {
        $(".twitter-addtweet-container").fadeIn(300)
        $(".twitter-main-bottomcontainer").fadeOut(300)
    } else if (appname == "Calls") {
        HSN.GetLastCalls()
        HSN.OpenAppPage(".calls-main",1)
    } else if (appname == "twitter-settings") {
        $(".twitter-settings-container").fadeIn(300)
        $(".twitter-main-bottomcontainer").fadeOut(300)
    } else if (appname == "Notes") {
        HSN.SetupNotes()
        HSN.OpenAppPage(".hsn-phonemain-notes-entry",1)
    } else if (appname == "Contacts") {
        HSN.GetPlayerContacts()
        HSN.OpenAppPage(".hsn-phonemain-contacts-entry",1)
    } else if (appname == "Bank") {
        HSN.OpenAppPage(".hsn-phonemain-bank-entry",1)
    } else if (appname == "Mail") {
        HSN.GetMails()
        HSN.OpenAppPage(".hsn-phonemain-mail-entry",1)
    } else if (appname == "Tiktok") {
        HSN.SetupTiktok()
    } else if (appname == "State") {
        HSN.OpenAppPage(".hsn-phonemain-state-entry",1)
        HSN.SetActiveJobs(currentstateHeader)
    } else if (appname == "Cars") {
        HSN.GetPlayerCars()
        HSN.OpenAppPage(".hsn-phonemain-cars-entry",1)
    } else if (appname == "Finance") {
        HSN.GetTransactions()
        HSN.OpenAppPage(".hsn-phonemain-finance-entry",1)
    } else if (appname == "Billings") {
        HSN.GetBills()
        HSN.OpenAppPage(".hsn-phonemain-billing-entry",1)
    } else if (appname == "Ambulance") {
        HSN.OpenAppPage(".hsn-phonemain-ambulance-entry",1)
        HSN.GetAmbulancePatientData()
    } else if (appname == "camera") {
        if (inCall) {
            $(".hsn-phonemain").css({'display':'block'}).animate({
                top: "55%",
            }, 500);
        } else {
            $(".hsn-phonemain").css({'display':'block'}).animate({
                top:"80%",
            }, 100, function(){
                $(".hsn-phonemain").css({'display':'none'});
            });
        }
        $.post('http://hsn-phone/takePhoto', JSON.stringify({}), function(data){
            if (data == "nil") {
                HSN.OpenPhone()
            } else {
                HSN.OpenPhone()
                $.post("http://hsn-phone/addPhotoToGallery", JSON.stringify({photo : data}));
            }
        })  
    } else if (appname == "gallery") {
        HSN.OpenAppPage(".hsn-phonemain-gallery-entry",1)
        HSN.GetGalleryPhotos()
    } else if (appname == "Polices") {
        HSN.OpenAppPage(".hsn-phonemain-police-entry",1)
    } else if (appname == "messages") {
        HSN.GetMessagePlayers()
        HSN.OpenAppPage(".hsn-phonemain-messages-entry",1)
    } else if (appname == "Advertisement") {
        HSN.GetAdds()
        HSN.OpenAppPage(".hsn-phonemain-ads-entry",1)
    }
}

HSN.GetTransactions = function() {
    $.post('http://hsn-phone/GetTransactions', JSON.stringify({}), function(data){
        if (data.length == 0) {
            $(".finance-transactions-none").fadeIn()
        } else {
            $(".finance-transactions-none").fadeOut()
            for(i = 0; i < (data.length); i++) {
                var icon = HSN.GetCryptoIcon(data[i].crypto)
                $(".finance-transactions-container").find("[id='"+i+"']").remove();
                $(".finance-transactions-container").append('<div class="finance-transactions-container-index" id='+i+'><div class="finance-transactions-container-index-icon">'+icon+'</div><div class="finance-transactions-container-index-label">Transaction </div><div class="finance-transactions-container-index-label">Amount</div><div class="finance-transactions-container-index-text">'+data[i].target+'</div><div class="finance-transactions-container-index-text">'+data[i].amount+'</div></div>')
            };
        }
    })  
}



HSN.DeleteBill = function(id) {
    var billData = $(".billing-bcontainer").find("[id="+id+"]").data("Bill")
    $(".billing-bcontainer").find("[id="+id+"]").css({'display':'block'}).animate({
        left: "-100%",
    }, 500, function(){
        $(".billing-bcontainer").find("[id="+id+"]").remove();
        var bills = document.getElementsByClassName("myBills");
            totalBillPrice = totalBillPrice - billData.amount
            $(".bills-payall-index").html("$"+totalBillPrice)
            totalBill = totalBill - 1
            $(".billing-header-totalbill-index").html(totalBill)
            if (bills.length == 0) {
                $(".billing-nonenotify").css({'display':'block'}).animate({
                    left: "10%",
                }, 500);
            }
    });
}

HSN.GetBills = function() {
    totalBill = 0
    totalBillPrice = 0
    $.post('http://hsn-phone/getBills', JSON.stringify({}), function(data){
        if (data.length == 0) {
            $(".billing-nonenotify").css({'display':'block'}).animate({
                left: "10%",
            }, 500);
            $(".billing-bcontainer").html("")
        } else {
            if ($(".billing-nonenotify").css("display") == "block") {
                $(".billing-nonenotify").css({'display':'block'}).animate({
                    left: "-100%",
                }, 500, function(){
                    $(".billing-nonenotify").css({'display':'none'});
                    $(".billing-bcontainer").html("")
                    for(i = 0; i < (data.length); i++) {
                        $(".billing-bcontainer").find("[id="+data[i].id+"]").remove()
                        $(".billing-bcontainer").append('<div class="myBills" id='+data[i].id+'><div class="myBills-cost">$'+data[i].amount+'</div><div class="myBills-reason">'+data[i].label+'</div></div>')
                        $(".billing-bcontainer").find("[id="+data[i].id+"]").data("Bill", data[i])
                        totalBillPrice = totalBillPrice + (data[i].amount)
                        totalBill++;
                    }
                    $(".billing-header-totalbill-index").html(totalBill)
                    $(".bills-payall-index").html("$"+totalBillPrice)
                });
            } else {
                $(".billing-bcontainer").html("")
                for(i = 0; i < (data.length); i++) {
                    totalBillPrice = totalBillPrice + (data[i].amount)
                    totalBill++;
                    $(".billing-bcontainer").find("[id="+data[i].id+"]").remove()
                    $(".billing-bcontainer").append('<div class="myBills" id='+data[i].id+'><div class="myBills-cost">$'+data[i].amount+'</div><div class="myBills-reason">'+data[i].label+'</div></div>')
                    $(".billing-bcontainer").find("[id="+data[i].id+"]").data("Bill", data[i])
                    
                }
                $(".billing-header-totalbill-index").html(totalBill)
                $(".bills-payall-index").html("$"+totalBillPrice)
            }
        }
    })   
}

HSN.GetCryptoIcon = function(crypto) {
    if (crypto == "bitcoin") {
        return '<i class="fab fa-btc"></i>';
    } else if (crypto == "ethereum") {
        return '<i class="fab fa-ethereum"></i>';
    } else if (crypto == "ggcoin") {
        return '<i class="fab fa-gg"></i>';
    } else if (crypto == "devcoin") {
        return '<i class="fab fa-dev"></i>';
    }
}



HSN.CloseApp = function(appname) {
    if (appname == "AppStore") {
        HSN.CloseAppPage(".hsn-phonemain-apps-entry",-100)
    } else if (appname == "settings") {
        HSN.CloseAppPage(".hsn-phonemain-settings-entry",-100)
    }  else if (appname == "Twitter") {
        HSN.CloseAppPage(".hsn-phonemain-twitter-entry",-100)
    }  else if (appname == "notifications") {
        // $(".hsn-phonemain-notifications-entry").fadeOut(300)
        //  $(".hsn-phonemain-bottomcontainer").fadeIn(300)
        //  $(".hsn-phonemain-apps").fadeIn(300)
    } else if (appname == "Calls") {
        HSN.CloseAppPage(".calls-main",-100)
    }
    
}

function a(e, i) {
    return Math.floor(Math.random() * (i - e)) + e
}


HSN.AddNewNote = function(data) {
    if (data !==undefined) {
        $(".notes-nonenotify").hide()
        noteslength = noteslength + 1
        HSN.RefreshNotesLength()
        if (data.photo !== "" && HSN.CheckIfImageExists(data.photo) == true) {
            $(".notes-bottomcontainer").prepend('<div class="myNotes" noteid='+data.id+'><div class="myNotes-title">'+data.title+'</div><div class="myNotes-delete" deleteid='+data.id+'><i class="fas fa-trash"></i></div><div class="myNotes-photo"><img src="'+data.photo+'"></div>  <div class="myNotes-textside">'+data.message+'</div><div class="myNotes-time">'+HSN.CalculateTime(data.date)+'</div></div>')
        } else {
            $(".notes-bottomcontainer").prepend('<div class="myNotes" noteid='+data.id+'><div class="myNotes-title">'+data.title+'</div><div class="myNotes-delete" deleteid='+data.id+'><i class="fas fa-trash"></i></div> <div class="myNotes-textside">'+data.message+'</div><div class="myNotes-time">'+HSN.CalculateTime(data.date)+'</div></div>')
        }
    }
}

HSN.OpenNoteContainer = function() {
    $(".hsn-phonemain-notes-addNewNote").fadeIn(300)   
    HSN.ShowGoBack(true,"AddNewNote")
    $(".notes-addnewnote-title").html("Add New Note")
    editnote.bool = false
}

HSN.RefreshNotesLength = function() {
    $(".notes-totalnotes-index").html(noteslength)
}

HSN.ShowGoBack = function(bool, id) {
    if (bool) {
        $(".hsn-phonemain-goBack").html('<div class="goback" id='+id+'><i class="fas fa-chevron-left"></i></div>')
        $(".hsn-phonemain-goBack").show()
        return
    }
    $(".hsn-phonemain-goBack").fadeOut(80)
}




HSN.SendMoney = function() {
    var iban = document.getElementById("bank-app-iban").value
    var amount = document.getElementById("bank-app-amount").value
    if (iban !=="" && amount !== "") {
        $.post("http://hsn-phone/SendMoney", JSON.stringify({iban : iban, amount : amount})); 
        HSN.ClearValues("id", "bank-app-iban")
        HSN.ClearValues("id", "bank-app-amount")
    }

}

HSN.SendBankMoney = function(data) {
    if (data.ok) {
        HSN.PhoneShowNotification("Money send!","success")
    } else {
        HSN.PhoneShowNotification(data.reason,"error")
    }
}

HSN.GoBack = function(id) {
    if (id == "AppStore") {
        HSN.CloseApp("AppStore")
        HSN.ShowGoBack(false)
    } else if(id == "settings") {
        HSN.CloseApp("settings")
        HSN.ShowGoBack(false)
    } else if (id == "Twitter") {
        HSN.CloseApp("Twitter")
        HSN.ShowGoBack(false)
    } else if (id == "Twitter-confirm") {
        $(".twitter-register-main").fadeIn(300)
        $(".twitter-register-confirm").fadeOut(300)
        HSN.ShowGoBack(true,"Twitter")
    } else if (id == "notifications") {
        HSN.CloseApp("notifications")
        HSN.ShowGoBack(false)
    } else if (id =="Twitter Main") {
        $(".twitter-main").fadeOut(300)
    } else if (id == "addtweet") {
        $(".twitter-addtweet-container").fadeOut(300)
        $(".twitter-main").fadeIn(300)
        $(".twitter-main-bottomcontainer").fadeIn(300)
        HSN.ShowGoBack(true,"Twitter")
      //  HSN.GetTweets()
    } else if (id == "Calls") {
        HSN.CloseApp("Calls")
        HSN.ShowGoBack(false)
    } else if (id == "Twitter-login") {
        $(".twitter-login").fadeOut(300)
        $(".twitter-register-main").fadeIn(300)
        HSN.ShowGoBack(true,"Twitter")
    } else if (id == "twitter-settings") {
        $(".twitter-settings-container").fadeOut(300)
        $(".twitter-main").fadeIn(300)
        $(".twitter-main-bottomcontainer").fadeIn(300)
        HSN.ShowGoBack(true,"Twitter")
       // HSN.GetTweets()
    } else if (id == "Notes") {
        HSN.CloseAppPage(".hsn-phonemain-notes-entry",-100)
        HSN.ShowGoBack(false)
    } else if (id == "Shownote") {
        $(".hsn-phonemain-shownote").fadeOut(300)
        HSN.ShowGoBack(true,"Notes")
    } else if (id == "AddNewNote") {
        $(".hsn-phonemain-notes-addNewNote").fadeOut(300)
        HSN.ShowGoBack(true,"Notes")
    } else if (id == "Contacts") {
        HSN.CloseAppPage(".hsn-phonemain-contacts-entry",-100)
        HSN.ShowGoBack(false)
    } else if (id == "contacts-plyinfo") {
        $(".contacts-plyinfo-container").fadeOut(300)
        HSN.ShowGoBack(true,"Contacts")
    } else if (id == "Bank") {
        HSN.ShowGoBack(false)
        HSN.CloseAppPage(".hsn-phonemain-bank-entry",-100)
    } else if (id == "Mail") {
        HSN.ShowGoBack(false)
        HSN.CloseAppPage(".hsn-phonemain-mail-entry",-100)
    } else if (id == "showmail") {
        $(".mail-showmail").fadeOut();
    } else if (id == "State") {
        HSN.ShowGoBack(false)
        HSN.CloseAppPage(".hsn-phonemain-state-entry",-100)
    } else if (id == "contacts") {
        HSN.ShowGoBack(false)
        HSN.CloseAppPage(".hsn-phonemain-contacts-entry",-100)
    } else if (id == "Cars") {
        HSN.ShowGoBack(false)
        HSN.CloseAppPage(".hsn-phonemain-cars-entry",-100)
    } else if (id == "carfeatures" ) {
        $(".cars-info").fadeOut(300)
        $(".cars-remote").fadeOut(300)
        $(".cars-main").fadeIn()
        HSN.ShowGoBack(true,"Cars")
        currentcarHeader = "info"
    } else if (id == "Gambling") {
        $(".hsn-phonemain-gambling-entry").fadeOut(300)
    } else if (id == "Gambling-Register") {
        $(".gambling-register").fadeOut()
        $(".gambling-login").fadeIn()
        HSN.ShowGoBack(true,"Gambling")
    } else if (id == "AddNewContact") {
        $(".contact-addnewcontact").fadeOut()
        $(".contacts-mainside").fadeIn()
        HSN.ShowGoBack(true,"contacts")
    } else if (id == "showcontact") {
        $(".contact-showcontact").fadeOut()
        $(".contacts-mainside").fadeIn()
        HSN.ShowGoBack(true,"contacts")
    } else if (id == "Gallery") {
        HSN.CloseAppPage(".hsn-phonemain-gallery-entry",-100)
        HSN.ShowGoBack(false)
    } else if (id == "finance-buy-side") {
        $(".finance-buy-side").fadeOut()
        $(".finance-main").fadeIn()
        HSN.ShowGoBack(true, "Finance")
    } else if (id  == "Finance") {
        HSN.CloseAppPage(".hsn-phonemain-finance-entry",-100)
        HSN.ShowGoBack(false)
    } else if (id == "newnote") {
        $(".shownote").css({'display':'block'}).animate({
            top: "-90%",
        }, 500, function(){
            $(".shownote").css({'display':'none'});
            $(".notes-main").fadeIn()
            HSN.ShowGoBack(true, "Notes")
        });
    } else if (id == "Billings") {
        HSN.CloseAppPage(".hsn-phonemain-billing-entry",-100)
    } else if (id == "Ambulance") {
        HSN.CloseAppPage(".hsn-phonemain-ambulance-entry",-100)
        HSN.ShowGoBack(false)
    } else if (id == "camera") {
        HSN.CloseAppPage(".hsn-phonemain-camera",-100)
        HSN.ShowGoBack(false)
    } else if (id == "gallery" ) {
        HSN.CloseAppPage(".hsn-phonemain-gallery-entry",-100)
        HSN.ShowGoBack(false)
    } else if (id == "Polices") {
        HSN.CloseAppPage(".hsn-phonemain-police-entry",-100)
        HSN.ShowGoBack(false)
    } else if (id == "PoliceShowPly") {
        $(".police-showply").css({'display':'block'}).animate({
            left: -100+"%",
        }, 500, function(){
            $(".police-showply").css({'display':'none'});
            $(".police-indexside").fadeIn()
            HSN.ShowGoBack(true, "Polices")

        });
    } else if (id == "PoliceShowVeh") {
        $(".police-showvehdata").css({'display':'block'}).animate({
            left: -100+"%",
        }, 500, function(){
            $(".police-showvehdata").css({'display':'none'});
            $(".police-indexside").fadeIn()
            HSN.ShowGoBack(true, "Polices")
        });
    } else if (id == "s-pagebackground") {
        $(".settings-pages-background").css({'display':'block'}).animate({
            left: -100+"%",
        }, 500, function(){
            $(".settings-pages-background").css({'display':'none'});
            HSN.ShowGoBack(true, "settings")
        });
    } else if (id == "s-pagecallsound") {
        $(".settings-pages-callsound").css({'display':'block'}).animate({
            left: -100+"%",
        }, 500, function(){
            $(".settings-pages-callsound").css({'display':'none'});
            HSN.ShowGoBack(true, "settings")
        });
    } else if (id == "s-pagenotifications") {
        $(".settings-pages-notifications").css({'display':'block'}).animate({
            left: -100+"%",
        }, 500, function(){
            $(".settings-pages-notifications").css({'display':'none'});
            HSN.ShowGoBack(true, "settings")
        });
    } else if (id == "messages") {
        HSN.CloseAppPage(".hsn-phonemain-messages-entry",-100)
        HSN.ShowGoBack(false)
    } else if (id == "Advertisement") {
        HSN.CloseAppPage(".hsn-phonemain-ads-entry",-100)
        HSN.ShowGoBack(false)
    } else if (id == "keyboard") {
        $(".contact-keyboard-page").fadeOut()
        $(".contacts-mainside").fadeIn()
        HSN.ShowGoBack(true, "contacts")
    } else if (id == "messages-index") {
        $(".messages-messageindex").css({'display':'block'}).animate({
            left: -100+"%",
        }, 500, function(){
            $(".messages-messageindex").css({'display':'none'});
            HSN.ShowGoBack(true, "messages")
        });
    } else if (id == "ads-nads") {
        $(".ads-newads-page").css({'display':'block'}).animate({
            left: -90+"%",
        }, 500, function(){
            $(".ads-newads-page").css({'display':'none'});
            HSN.ShowGoBack(true, "Advertisement")
        });
    }
}

HSN.OpenLogInPage = function() {
    HSN.ShowGoBack(true,"Twitter-login")
    $(".twitter-register-main").fadeOut(150)
    $(".twitter-login").fadeIn(150)
}



HSN.SetupNote = function(noteId) {
    $.post('http://hsn-phone/getNote', JSON.stringify({noteid : noteId}), function(data){
        $(".hsn-phonemain-shownote").html('<div class="note-title">'+data.title+'</div><div class="notes-message">'+data.message+'</div><div class="notes-photo"><img src='+data.photo+'></div><div class="note-bottomcontainer-icons" id="delete" noteiconid='+data.id+'><i class="fas fa-trash"></i></div><div class="note-bottomcontainer-icons" id="edit" noteiconid='+data.id+'><i class="fas fa-edit"></i></div>')
        $(".hsn-phonemain-shownote").fadeIn(300)
        HSN.ShowGoBack(true,"Shownote")
    })  
}

HSN.EditNote = function(noteid) {
    $.post('http://hsn-phone/getNote', JSON.stringify({noteid : noteid}), function(data){
        $(".notes-addnewnote-title").html("Edit Note")
        document.getElementById("notes-titlecontainer").value = data.title
        document.getElementById("notes-textcontainer").value = data.message
        $(".hsn-phonemain-shownote").fadeOut(300)
        $(".hsn-phonemain-notes-addNewNote").fadeIn(300)   
        HSN.ShowGoBack(true,"AddNewNote")
        editnote.noteid = noteid
    }) 
}



HSN.SetAppColor = function(appName) {
    if (appName == "Twitter") {
        $(".hsn-phonemain-apps").find("[appname="+appName+"]").css({"background-color":"#00a8ff"})
    } else if (appName == "Cars") {
        $(".hsn-phonemain-apps").find("[appname="+appName+"]").css({"background-color":"#339977"})
        //$(".hsn-phonemain-apps").find("[appname="+appName+"]").find("i").css({"left":"17%"})
    } else if (appName == "Finance") {
        $(".hsn-phonemain-apps").find("[appname="+appName+"]").css({"background-color":"#993833"})
       // $(".hsn-phonemain-apps").find("[appname="+appName+"]").find("i").css({"padding-left":"32%"})
    } else if (appName == "Advertisement") {
        //$(".hsn-phonemain-apps").find("[appname="+appName+"]").find("i").css({"left":"15%"})
        //$(".hsn-phonemain-apps").find("[appname="+appName+"]").find("i").css({"color":"#247ba0;"})
        $(".hsn-phonemain-apps").find("[appname="+appName+"]").css({"background-color":"#e09f3e"})
    } else if (appName == "Twitch") {
        //$(".hsn-phonemain-apps").find("[appname="+appName+"]").find("i").css({"top":"27%"})
        // $(".hsn-phonemain-apps").find("[appname="+appName+"]").find("i").css({"color":"rgb(24, 24, 24);"})
        $(".hsn-phonemain-apps").find("[appname="+appName+"]").css({"background-color":"#9e31fe"})
    }
}

HSN.AddNewApp = function(appName) {

    let appIcon = null
    if (appName == "Twitter") {
        appIcon =  '<i class="fab fa-twitter"></i>'
    }else if (appName == "Twitch") {
        appIcon =  '<i class="fab fa-twitch"></i>'
    }else if (appName == "Advertisement") {
        appIcon =  '<i class="fas fa-ad"></i>'
    }else if (appName == "Finance") {
        appIcon = '<i class="fas fa-wallet"></i>'
    }else if (appName == "Cars") {
        appIcon = '<i class="fas fa-car"></i>'
    }
    if (appName == "Advertisement") {
        $(".hsn-phonemain-apps").append('<div class="hsn-phone-apps" id='+appName+'><div class="hsn-phone-apps-iconside" appname='+appName+'>'+appIcon+'</div><div class="hsn-phone-apps-textside">Ads</div></div>')
    } else {
        $(".hsn-phonemain-apps").append('<div class="hsn-phone-apps" id='+appName+'><div class="hsn-phone-apps-iconside" appname='+appName+'>'+appIcon+'</div><div class="hsn-phone-apps-textside">'+appName+'</div></div>')
    }
    
    HSN.SetAppColor(appName)
    $(".hsn-phonemain-apps-entry").find("[id="+appName+"]").html('<i class="fas fa-check-circle"></i>')
    $(".hsn-phonemain-apps-entry").find("[id="+appName+"]").addClass("hoverappstore")
}





// HSN.AddNewApp("Twitter")
// HSN.AddNewApp("Finance")
// HSN.AddNewApp("Cars")
// HSN.AddNewApp("Ads")
// HSN.AddNewApp("Twitch")
//s



HSN.SetBackgroundImage = function(image) {
    $(".hsn-phonemain-container").css("background-image","url('"+image+"')")
}

HSN.AddNewNotification = function(data) {
    let appIcon = null
    if (data.app == "Twitter") {
        appIcon =  '<i class="fab fa-twitter"></i>'
    }else if (data.app == "Tiktok") {
        appIcon =  '<i class="fab fa-tiktok"></i>'
    }else if (data.app == "Notes") {
        appIcon =  '<i class="fas fa-clipboard"></i>'
    }else if (data.app == "Finance") {
        appIcon = '<i class="fas fa-wallet"></i>'
    }else if (data.app == "Cars") {
        appIcon = '<i class="fas fa-car"></i>'
    }else if (data.app == "App Store") {
        appIcon = '<i class="fab fa-app-store"></i>'
    }
    $(".notifications-container").prepend('<div class="notifications-container-index" message-id="'+data.id+'"><div class="notifications-container-index-topside"><div class="notifications-container-index-topside-appicon">'+appIcon+'</div><div class="notifications-container-index-topside-appname"><p>'+data.app+'</p></div><div class="notifications-container-index-topside-delete" id="'+data.id+'"><i class="fas fa-trash"></i></div></div><div class="notifications-container-index-bottomside"><p>'+data.message+'</p></div></div>')
}




HSN.TwitterNext = function() {
    HSN.ShowGoBack(true,"Twitter-confirm")
    $(".twitter-register-main").fadeOut(150)
    $(".twitter-register-confirm").fadeIn(150)
}





// $(document).on("mouseleave", ".fas", function(e){
//     var th = $(this)
//     if ("#label" + th.data("id") != "#label"+current) {
//         $("#label"+th.data("id")).fadeOut(250);
//     }
// });

HSN.RemoveContact = function(id) {
    $(".contacts-contactside").find("[contactid="+id+"]").css({'display':'block'}).animate({
        left: "-100%",
    }, 500, function(){
        $(".contacts-contactside").find("[contactid="+id+"]").remove();
        var length = document.getElementsByClassName("contact").length
        if (length == 0) {
            $(".contacts-none").fadeIn()
        }
    }); 
}

HSN.DeleteApp = function(app) {
    downloaded[app] = false
    $(".hsn-phonemain-apps-entry").find("[id="+app+"]").html('<i class="fas fa-cloud-download-alt"></i>')
    $(".hsn-phonemain-apps-entry").find("[id="+app+"]").removeClass("hoverappstore")
    $(".hsn-phonemain-apps").find("[id="+app+"]").remove();
}

HSN.AddNewTweet = function(data) {i
    $(".twitternonenotify").fadeOut(150)
    if (data.photo == null || data.photo == undefined || data.photo == "") {
        $(".twitter-main-side").prepend('<div class="twitter-tweetside"><div class="tweetside-playerphoto"><img  src="'+HSN.GetPlayerTwitterPhoto(data.user_photo)+'"></div>  <div class="tweetside-f-lastname">'+data.flastname+'</div>  <div class="tweetside-username">@'+data.username+'</div>     <div class="tweetside-timediff">'+HSN.CalculateTime(data.date)+'</div>  <div class="tweetside-messagebox"><div class="tweetside-textside">'+data.message+'</div></div><div class="tweetside-icons" id="like" tweetid='+data.id+'><i class="fas fa-heart"></i></div><div class="tweetside-icons" id="retweet"><i class="fas fa-retweet"></i></div></div>')
    } else {
        if (HSN.CheckIfImageExists(data.photo) == true) {
            $(".twitter-main-side").prepend('<div class="twitter-tweetside"><div class="tweetside-playerphoto"><img  src="'+HSN.GetPlayerTwitterPhoto(data.user_photo)+'"></div> <div class="tweetside-f-lastname">'+data.flastname+'</div> <div class="tweetside-username">@'+data.username+'</div>  <div class="tweetside-timediff">'+HSN.CalculateTime(data.date)+'</div>  <div class="tweetside-messagebox"><div class="tweetside-textside">'+data.message+'</div><div class="tweetside-photoside"><img src='+data.photo+'></div></div><div class="tweetside-icons" id="like" tweetid='+data.id+'><i class="fas fa-heart"></i></div><div class="tweetside-icons" id="retweet"><i class="fas fa-retweet"></i></div></div>')
        } else {
            $(".twitter-main-side").prepend('<div class="twitter-tweetside"><div class="tweetside-playerphoto"><img  src="'+HSN.GetPlayerTwitterPhoto(data.user_photo)+'"></div>  <div class="tweetside-f-lastname">'+data.flastname+'</div>  <div class="tweetside-username">@'+data.username+'</div>     <div class="tweetside-timediff">'+HSN.CalculateTime(data.date)+'</div>  <div class="tweetside-messagebox"><div class="tweetside-textside">'+data.message+'</div></div><div class="tweetside-icons" id="like" tweetid='+data.id+'><i class="fas fa-heart"></i></div><div class="tweetside-icons" id="retweet"><i class="fas fa-retweet"></i></div></div>')
        }
    }
}






HSN.GetTweets = function() {
    $(".twitter-main-side").html("")
    $.post('http://hsn-phone/getTweets', JSON.stringify({}), function(data){
        if (data == undefined || data == null || data == "") {
            $(".twitternonenotify").fadeIn(150)
        } else {
            $(".twitternonenotify").fadeOut(150)
           for(i = 0; i < (data.length); i++) {
            HSN.RefreshTwitterLikes(data[i])
            $(".twitter-main-side").find("[maintweet=" + data[i].id + "]").remove();
                if (data[i].photo == null || data[i].photo == undefined || data[i].photo == "") {
                    $(".twitter-main-side").prepend('<div class="twitter-tweetside" maintweet ='+data[i].id+'><div class="tweetside-playerphoto"><img  src="'+HSN.GetPlayerTwitterPhoto(data[i].user_photo)+'"></div> <div class="tweetside-f-lastname">'+data[i].flastname+'</div> <div class="tweetside-username">@'+data[i].username+'</div>  <div class="tweetside-timediff">'+HSN.CalculateTime(data[i].date)+'</div> <div class="tweetside-messagebox"><div class="tweetside-textside">'+data[i].message+'</div></div><div class="tweetside-icons" id="like" tweetid='+data[i].id+'><i class="fas fa-heart"></i></div><div class="tweetside-icons" id="retweet"><i class="fas fa-retweet"></i></div></div>')
                    if (data[i].likes > 0 ) {
                        $(".twitter-tweetside").find('[tweetid='+data[i].id+']').html('<i class="fas fa-heart"></i><p>'+data[i].likes+'</p>')  
                    }
                } else {
                    if (HSN.CheckIfImageExists(data[i].photo) == true) {
                        $(".twitter-main-side").prepend('<div class="twitter-tweetside" maintweet='+data[i].id+'><div class="tweetside-playerphoto"><img  src="'+HSN.GetPlayerTwitterPhoto(data[i].user_photo)+'"></div> <div class="tweetside-f-lastname">'+data[i].flastname+'</div> <div class="tweetside-username">@'+data[i].username+'</div> <div class="tweetside-timediff">'+HSN.CalculateTime(data[i].date)+'</div> <div class="tweetside-messagebox"><div class="tweetside-textside">'+data[i].message+'</div><div class="tweetside-photoside"><img src='+data[i].photo+'></div></div><div class="tweetside-icons" id="like" tweetid='+data[i].id+'><i class="fas fa-heart"></i></div><div class="tweetside-icons" id="retweet"><i class="fas fa-retweet"></i></div></div>')
                    } else {
                        $(".twitter-main-side").prepend('<div class="twitter-tweetside" maintweet ='+data[i].id+'><div class="tweetside-playerphoto"><img  src="'+HSN.GetPlayerTwitterPhoto(data[i].user_photo)+'"></div> <div class="tweetside-f-lastname">'+data[i].flastname+'</div> <div class="tweetside-username">@'+data[i].username+'</div>  <div class="tweetside-timediff">'+HSN.CalculateTime(data[i].date)+'</div> <div class="tweetside-messagebox"><div class="tweetside-textside">'+data[i].message+'</div></div><div class="tweetside-icons" id="like" tweetid='+data[i].id+'><i class="fas fa-heart"></i></div><div class="tweetside-icons" id="retweet"><i class="fas fa-retweet"></i></div></div>')
                    }
                    if (data[i].likes > 0 ) {
                        $(".twitter-tweetside").find('[tweetid='+data[i].id+']').html('<i class="fas fa-heart"></i><p>'+data[i].likes+'</p>')  
                    }
                }
           }
        }
    });
}

HSN.GetMails = function() {
    $.post('http://hsn-phone/getMails', JSON.stringify({}), function(data){
        if (data == undefined || data == null || data == "") {
            $(".mails-nonenotify").fadeIn(150)
            $(".mail-mailside").html("")
        } else {
            $(".mails-nonenotify").hide()
            $(".mail-mailside").html("")
            for(i = 0; i < (data.length); i++) {
                $(".mail-mailside").find("[id="+data[i].id+"]").remove()
                $(".mail-mailside").prepend('<div class="mail-mails" id='+data[i].id+'><div class="mail-mails-appname">'+data[i].app+'</div><div class="mail-mails-message">'+data[i].message+' </div><div class="mail-mails-time">'+HSN.CalculateTime(data[i].date)+'</div></div>')
            }i
        }
    });
}

HSN.DeleteMail = function(mailId) {
    $(".mail-mailside").find("[id="+mailId+"]").fadeOut()
    $(".mail-mailside").find("[id="+mailId+"]").remove()
    var number = document.getElementsByClassName("mail-mails");
    if (number.length == 0) {
        $(".mails-nonenotify").fadeIn(150)
    }
}




HSN.GetPlayerTwitterPhoto = function(photo) {
    returnPhoto = null;
    if (photo == "default") {
        returnPhoto = "./images/default.png"
    } else {
        returnPhoto = photo
    }
    return returnPhoto
}


// HSN.GetLastCalls = function() {
//     $.post('http://hsn-phone/getLastCalls', JSON.stringify({}), function(data){

//         if (data == undefined || data == null || data == "") {
//             $(".lastcalls-0notify").fadeIn(150)
//         } else {
//             $(".lastcalls-0notify").hide()
//             $.each(data, function (i, result) {
//                 $(".lastcalls-container").find("[lastcall-id=" + result.id + "]").remove();
//                 $(".lastcalls-container").append('<div class="calls" lastcall-id='+result.id+'><div class="calls-callername"><p>'+result.name+'</p></div><div class="calls-time"><p>'+result.time+'</p></div><div class="onlytest" id='+result.id+'><i><i class="fas fa-trash"></i></i></div></div>')
//             })
//         }
//     });
// }


HSN.AddNewPhotoToGallery = function(data) {
    $(".gallery-bottomside").prepend('<div class="gallery-photos" photoid='+data.id+'><img id='+data.id+' ondblclick="HSN.dblclicktophoto('+data.id+')" src="'+data.photo+'"></div>')
}

// HSN.DeleteLastCall = function(id) {
//     if (id !== null) {
//         $(".lastcalls-container").find("[lastcall-id=" + id + "]").fadeOut();
//         $(".lastcalls-container").find("[lastcall-id=" + id + "]").remove();
//         $.post("http://hsn-phone/deletelastcall", JSON.stringify({id : id}));
//         var number = document.getElementsByClassName("calls");
//         if (number.length == 0) {
//             $(".lastcalls-0notify").fadeIn()
//         }
//     }
// }

HSN.TwitterLogIn = function() {
    let username = document.getElementById("username").value
    let password = document.getElementById("login-passwordinput").value
    if (username !== "" && password !== "") {
        $.post('http://hsn-phone/AccountCheck', JSON.stringify({username : username, password : password}), function(data){
            if (data.data == false) {
                $(".line").css({"background-color":"red"})
                $(".line2").css({"background-color":"red"})
                HSN.PhoneShowNotification(data.reason,"error")
                setTimeout(function(){ $(".line2").css({"background-color":"rgba(255, 255, 255, 0.679)"}); $(".line").css({"background-color":"rgba(255, 255, 255, 0.679)"})}, 2000);
            } else if (data.data == true) {
                $(".twitter-login").fadeOut(300)
                $(".twitter-main").fadeIn(300)
                HSN.ShowGoBack(true,"Twitter")
                HSN.GetTweets()
                HSN.TwitterData.username = username,
                HSN.TwitterData.password = password
                HSN.TwitterData.photo = data.photo
                if (HSN.TwitterData.photo == "default") {
                    $(".twitter-settings-userphoto").html('<img  src="./images/default.png">')
                } else {
                    $(".twitter-settings-userphoto").html('<img  src='+HSN.TwitterData.photo+'>')
                }
                $(".twitter-settings-username").html('<p>'+HSN.TwitterData.username+'</p>')
            }
        });
    } else {
        HSN.PhoneShowNotification("Kullanıcı adı veya şifre boş bırakılamaz.","error")
    }
}


HSN.GetPlayerContacts = function() {
    $.post('http://hsn-phone/GetContacts', JSON.stringify({}), function(data){
        if (data == "0") {
            $(".contacts-none").fadeIn()
            $(".contacts-contactside").html("")
        } else {
            $(".contacts-none").fadeOut()
            $(".contacts-contactside").html("")
            for(i = 0; i < (data.length); i++) {
                $(".contacts-contactside").find("[contactid="+data[i].id+"]").remove();
                $(".contacts-contactside").prepend('<div class="contact" contactid='+data[i].id+'><div class="contact-photo"> <img src='+HSN.CalculateMessagesPhoto(data[i].photo)+'> </div><div class="contact-name">'+data[i].name+'</div><div class="contact-phonenumber">'+data[i].phonenumber+'</div></div>') 
                $(".contacts-contactside").find("[contactid="+data[i].id+"]").data("contactData",data[i])
            }
        }
    })
}

var Delete = "delete"

HSN.GetGalleryPhotos = function() {
    $.post('http://hsn-phone/GetGalleryPhotos', JSON.stringify({}), function(data){
        if (data.length == 0) {
            $(".gallery-nonenotify").css({'display':'block'}).animate({
                left: "0",
            }, 500);
            $(".gallery-bottomside").html("")
        } else {
            $(".gallery-bottomside").html("")
            if ($(".gallery-nonenotify").css("display") == "block") {
                $(".gallery-nonenotify").css({'display':'block'}).animate({
                    left: "-100%",
                }, 500, function(){
                    $(".gallery-nonenotify").css({'display':'none'});
                    $(".gallery-bottomside").html("")
                    for(i = 0; i < (data.length); i++) {
                        
                        $(".gallery-bottomside").find("[photoid="+data[i].id+"]").remove();
                        $(".gallery-bottomside").prepend('<div class="gallery-photos" photoid='+data[i].id+'><img id='+data[i].id+' ondblclick="HSN.dblclicktophoto('+data[i].id+')" src="'+data[i].photo+'"></div>')
                    }
                });
            } else {
                for(i = 0; i < (data.length); i++) {
            
                    $(".gallery-bottomside").find("[photoid="+data[i].id+"]").remove();
                        $(".gallery-bottomside").prepend('<div class="gallery-photos" photoid='+data[i].id+'><img id='+data[i].id+' ondblclick="HSN.dblclicktophoto('+data[i].id+')" src="'+data[i].photo+'"></div>')
                    
                }
            }
        }
    })
}

HSN.CalculateMessagesPhoto = function(photo) {
    returnPhoto = null;
    if (photo == "default" || photo == undefined) {
        returnPhoto = "./images/default.png"
    } else {
        returnPhoto = photo
    }
    return returnPhoto
}

HSN.SetupNotes = function() {
    $.post('http://hsn-phone/getNotes', JSON.stringify({}), function(data){
        if (data.length == 0) {
            $(".notes-nonenotify").css({'display':'block'}).animate({
                left: "10%",
            }, 500);
            $(".notes-bottomcontainer").html("")
        } else {
            if ($(".notes-nonenotify").css("display") == "block") {
                $(".notes-nonenotify").css({'display':'block'}).animate({
                    left: "-100%",
                }, 500, function(){
                    $(".notes-bottomcontainer").html("")
                    $(".notes-nonenotify").css({'display':'none'});
                    for(i = 0; i < (data.length); i++) {
                        $(".notes-bottomcontainer").find("[noteid="+data[i].id+"]").remove();
                        if (data[i].photo !== "" && HSN.CheckIfImageExists(data[i].photo) == true) {
                            $(".notes-bottomcontainer").prepend('<div class="myNotes" noteid='+data[i].id+'><div class="myNotes-title">'+data[i].title+'</div><div class="myNotes-delete" deleteid='+data[i].id+'><i class="fas fa-trash"></i></div><div class="myNotes-photo"><img src="'+data[i].photo+'"></div>  <div class="myNotes-textside">'+data[i].message+'</div><div class="myNotes-time">'+HSN.CalculateTime(data[i].date)+'</div></div>')
                        } else {
                            $(".notes-bottomcontainer").prepend('<div class="myNotes" noteid='+data[i].id+'><div class="myNotes-title">'+data[i].title+'</div><div class="myNotes-delete" deleteid='+data[i].id+'><i class="fas fa-trash"></i></div> <div class="myNotes-textside">'+data[i].message+'</div><div class="myNotes-time">'+HSN.CalculateTime(data[i].date)+'</div></div>')
                        }
                    }
                });
            } else {
                $(".notes-bottomcontainer").html("")
                for(i = 0; i < (data.length); i++) {
                    $(".notes-bottomcontainer").find("[noteid="+data[i].id+"]").remove();
                    if (data[i].photo !== "" && HSN.CheckIfImageExists(data[i].photo) == true) {
                        $(".notes-bottomcontainer").prepend('<div class="myNotes" noteid='+data[i].id+'><div class="myNotes-title">'+data[i].title+'</div><div class="myNotes-delete" deleteid='+data[i].id+'><i class="fas fa-trash"></i></div><div class="myNotes-photo"><img src="'+data[i].photo+'"></div>  <div class="myNotes-textside">'+data[i].message+'</div><div class="myNotes-time">'+HSN.CalculateTime(data[i].date)+'</div></div>')
                    } else {
                        $(".notes-bottomcontainer").prepend('<div class="myNotes" noteid='+data[i].id+'><div class="myNotes-title">'+data[i].title+'</div><div class="myNotes-delete" deleteid='+data[i].id+'><i class="fas fa-trash"></i></div> <div class="myNotes-textside">'+data[i].message+'</div><div class="myNotes-time">'+HSN.CalculateTime(data[i].date)+'</div></div>')
                    }
                }
            }
        }
        noteslength = data.length
        HSN.RefreshNotesLength()
    })  
}


HSN.CheckIfImageExists = function(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}

HSN.DeleteNote = function(noteid) {
    $(".notes-bottomcontainer").find("[noteid="+noteid+"]").css({'display':'block'}).animate({
        left: "-100%",
    }, 500, function(){
        $(".notes-bottomcontainer").find("[noteid="+noteid+"]").remove()
        noteslength = noteslength - 1
    HSN.RefreshNotesLength()
    var notes = document.getElementsByClassName("myNotes");
    if (notes.length == 0) {
        $(".notes-nonenotify").css({'display':'block'}).animate({
            left: "10%",
        }, 500);
    }
    });
    
}


HSN.GetPlayerCars = function() {
    $.post('http://hsn-phone/getPlayerCars', JSON.stringify({}), function(data){
        if (data.length == 0) {
            $(".cars-container").html("")
            $(".cars-nonenotify").fadeIn()
        } else {
            $(".cars-container").html("")
            for(i = 0; i < (data.length); i++) {
                if (data[i].stored == 1) {
                    addClass = "stored"
                } else {
                    addClass = "notstored"
                }
                $(".cars-container").find("[id="+i+"]").remove();
                $(".cars-container").append('<div class="cars-index" id='+i+'><div class="carlabel">'+data[i].vehLabel+'</div><div class="carplate">'+data[i].plate+'</div><div class="carinfo '+addClass+'"><div class="carinfo-box">This car isnt stored!</div><i class="fas fa-map-marker-alt"></i></div></div>')
                $(".cars-container").find("[id="+i+"]").find(".carinfo").data("CarData", data[i])
                $(".cars-container").find("[id="+i+"]").find(".carinfo").data("stored", addClass)
            } 
        }
    })  
}

HSN.AddNewMail = function(data) {
    $(".mails-nonenotify").fadeOut(100)
    let date = new Date();
    $.post("http://hsn-phone/AddNewMail", JSON.stringify({date : date, message : data.message, app : data.app})); 
    
}
HSN.AddNewMailToPage = function(data) {
    let date = new Date();
    $(".mail-mailside").prepend('<div class="mail-mails" id='+data.id+'><div class="mail-mails-appname">'+data.app+'</div><div class="mail-mails-message">'+data.message+' </div><div class="mail-mails-time">'+HSN.CalculateTime(date)+'</div></div>')
}


HSN.CalculateTime = function(oldtime) {
    let today = new Date();
    let old = new Date(oldtime);
    let diffMs = (today - old);
    let Daydifference = Math.floor(diffMs / 86400000);
    let Hoursdifference = Math.floor((diffMs % 86400000) / 3600000);
    let Minutedifference = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    let Secondsdifference = Math.round(diffMs / 1000);
    if (Secondsdifference == 0) {
        Secondsdifference = 1
    }
    let TimeAgo = Secondsdifference + 's';
    if (Daydifference > 0 && Hoursdifference > 0) {
        TimeAgo = Daydifference  + 'd'
    } else if (Daydifference > 0 && Hoursdifference == 0) {
        TimeAgo = Daydifference  + 'd'
    } else if (Daydifference == 0 && Hoursdifference > 0) {
        TimeAgo = Hoursdifference + 'h'
    } else if (Daydifference == 0 && Hoursdifference == 0 && Minutedifference > 0) {
        TimeAgo = Minutedifference + 'm'
    }
    return TimeAgo
}

HSN.PhoneShowNotification = function(message,type) {
    
    if (type == "error") {
        $(".phonenotification-textside").html('<p>'+message+'</p>')
        $(".phonenotification-iconside").html('<i class="fas fa-exclamation"></i>')
        $(".phonenotification-container").css({'display':'block'}).animate({
            left: "5%",
        }, 500);
        setTimeout(function(){  
        $(".phonenotification-container").css({'display':'block'}).animate({
            left: "5%",
        }, 500, function(){
            $(".phonenotification-container").css({'display':'block'}).animate({
                left:"-100%",
            }, 300, function(){
                $(".phonenotification-container").css({'display':'none'});
            });
        });
        }, 5000);

      
    } else if (type == "success") {
        $(".phonenotification-textside").html('<p>'+message+'</p>')
        $(".phonenotification-iconside").html('<i class="fas fa-check-circle"></i>')
        $(".phonenotification-container").css({'display':'block'}).animate({
            left: "5%",
        }, 500);
        setTimeout(function(){  

        }, 5000);
    }
}

HSN.ShowPhotoOnScreen = function(photoLink){
	if (photoOnScreen) { // fixed photo stack
        return
    }
    $(".phone-photo-container").html('<img src='+photoLink+'>')
    $(".phone-photo-container").fadeIn(300)
    setTimeout(function(){photoOnScreen = true}, 250);
}

HSN.SetupMail = function(id) {
    $.post('http://hsn-phone/GetMail', JSON.stringify({id : id}), function(data){
        if (data !== undefined) {   
            $(".mail-showmail").html('<div class="mail-fromSrc">'+data.app+' kişisinden yeni bir mail var!</div><div class="mail-fromText">'+data.message+'</div><button id="mail-delete" mailId='+data.id+'>Delete</button>')
            $(".mail-showmail").fadeIn()
            HSN.ShowGoBack(true,"showmail")
        }
    });
}



HSN.ChangePhoto = function(newPhoto) {
    var photodata = $(".hsn-phone-changephotocontainer").data("photodata")
    $.post("http://hsn-phone/ChangePhoto", JSON.stringify({photoindex : photodata, photo : newPhoto})); 

}

HSN.SetCarFeatures = function(features) {
    var ingarage = "No"
    if (features !== undefined) {
        if (features.stored == "1") {
            ingarage = "Yes"
        }
        fuelLevel = features.vehicle.fuelLevel.toFixed(2);
        $("#carmodel").find(".features-description").html(features.vehLabel)
        $("#carplate").find(".features-description").html(features.plate)
        $("#ingarage").find(".features-description").html(ingarage)
        $(".cars-main").fadeOut()
        $(".cars-info").fadeIn()
        HSN.ShowGoBack(true,"carfeatures")
        $("#fuellevel").find(".features-description-fuellevel").find(".fuellevel").css({"width": fuelLevel})
        currentCar = features
    }
}

HSN.ToggleValet = function(carData) {
    $.post("http://hsn-phone/ToggleValet", JSON.stringify({car : carData}));
    HSN.ShowGoBack(false)
    HSN.CloseAppPage(".hsn-phonemain-cars-entry",-100)
}

HSN.SetPhoto = function(data) {
    if (data.photoindex !== null || data.photoindex !== "") {
        if (data.photoindex == "charinfo") {
            if (data.photo == "default" || data.photo == undefined) {
                $(".s-plypoto").html('<img src="./images/default.png">') 
            } else {
                $(".s-plypoto").html('<img src='+data.photo+'>')
            }
        }   else if (data.photoindex == "phone-background") {
            $(".hsn-phonemain-container").css({"background-image":"url("+data.photo+")"})
        }   else if (data.photoindex == "twitter") {
            $(".twitter-settings-userphoto").html('<img  src='+data.photo+'>')
        }   
    }
}

HSN.TwitterLogOut = function() {
    $(".twitter-settings-container").fadeOut(300)
    $(".twitter-main-bottomcontainer").fadeIn(300)
    $(".twitter-main").fadeOut(300)
    $(".twitter-register-main").fadeIn(300)
    HSN.ShowGoBack(true,"Twitter")
    $.post("http://hsn-phone/logOutTwitter", JSON.stringify({})); 
    HSN.TwitterData = {}
}

HSN.DeleteTwitterAccount = function() {
    $(".twitter-settings-container").fadeOut(300)
    $(".twitter-main-bottomcontainer").fadeIn(300)
    $(".twitter-main").fadeOut(300)
    $(".twitter-register-main").fadeIn(300)
    HSN.ShowGoBack(true,"Twitter")
    $.post("http://hsn-phone/DeleteTwitterAccount", JSON.stringify({})); 
    HSN.TwitterData = {}
}


HSN.OpenPhone = function() {
    $(".hsn-phonemain").css({'display':'block'}).animate({
        top: "0",
    }, 500);
    HSN.IsPhoneOpened = true
}

HSN.ClosePhone = function() {
    if (inCall) {
        $(".hsn-phonemain").css({'display':'block'}).animate({
            top: "55%",
        }, 500);
    } else {
        $(".hsn-phonemain").css({'display':'block'}).animate({
            top:"80%",
        }, 100, function(){
            $(".hsn-phonemain").css({'display':'none'});
        });
    }
    $.post("http://hsn-phone/close", JSON.stringify({})); 
    HSN.IsPhoneOpened = false
}

HSN.AddNewContact = function(data) {
    $(".contacts-none").fadeOut()
    $(".contacts-contactside").prepend('<div class="contact" contactid='+data.id+'><div class="contact-photo"> <img src='+HSN.CalculateMessagesPhoto(data.photo)+'> </div><div class="contact-name">'+data.name+'</div><div class="contact-phonenumber">'+data.phonenumber+'</div></div>')
    $(".contacts-contactside").find("[contactid="+data.id+"]").data("contactData",data)
}



HSN.ClearValues = function(domtype,dom) {
    if (domtype = "id") {
        document.getElementById(dom).value = ""
    } else if (domtype == "class") {
        document.getElementsByClassName(dom).value = ""
    }
}

HSN.SetPhotos = function(data) {
    $.each(data.charinfo, function (i, result) {
        if (i == "photo") {
            i = "charinfo"
        } else if (i == "phonebackground") {
            i = "phone-background"
        }
        newdata = {}
        newdata.photoindex = i,
        newdata.photo = result
        HSN.SetPhoto(newdata)
    })
}

HSN.SetBankBalance = function(amount) {
    $(".bank-üstbilgiler-amount-index").html("$"+amount.toFixed(2))
    $(".finance-totalbalance-index").html("$"+amount.toFixed(2))
}

HSN.SetBankPhoto =  function(photo) {
    if (photo == "default") {
        $(".bank-photo").html('<img  src="./images/default.png">')
    } else {
        $(".bank-photo").html('<img src='+photo+'>')
    }
}

HSN.SetIBAN = function(iban) {
    $(".bank-üstbilgiler-iban-index").html(iban)
}


HSN.SetPhoneNumber = function(number) {
    $(".s-phonenumber").html(number)
}

HSN.SetCharacterName = function(firstname, lastname) {
    $(".s-pylname").html(""+firstname+ " "+lastname+"")
    $(".bank-plyName").html(""+firstname+" "+lastname+"")
}

HSN.SetEmail = function(name) {
    $(".mail-accountside").html(name+"@gmail.com")
}


HSN.CloseLogin = function() {
    $(".gambling-login").fadeOut(300)
    $(".gambling-register").fadeIn(300)
    HSN.ShowGoBack(true,"Gambling-Register")
}

// while

  // clock
let clock = () => {
  let date = new Date();
  let hrs = date.getHours();
  let mins = date.getMinutes();
  let secs = date.getSeconds();
  let period = "AM";
  if (hrs == 0) {
    hrs = 12;
  } else if (hrs >= 12) {
    hrs = hrs - 12;
    period = "PM";
  }
  hrs = hrs < 10 ? "0" + hrs : hrs;
  mins = mins < 10 ? "0" + mins : mins;
  secs = secs < 10 ? "0" + secs : secs;

  let time = `${hrs}:${mins}:${secs}:${period}`;
  let time2 = `${hrs}:${mins}`;
  document.getElementById("date-s").innerText = time;
  document.getElementById("clock-text").innerText = time2;
  setTimeout(clock, 1000);
};

clock();

// message


$(document).on('click', '.contacts-numbers', function(e) {
    e.preventDefault();

    var Button = $(this).attr("data-number");
    var lastPressedButton = undefined
    if (!isNaN(Button)) {
        var keyPadHTML = $(".contacts-shownumberr").find("p").html();
        $(".contacts-shownumberr").find("p").html(keyPadHTML + Button)
        lastPressedButton = keyPadHTML
    } else if (Button == "Call") {
        var keyPadHTML = $(".contacts-shownumberr").find("p").html();
        if (keyPadHTML != "") {
            $.post("http://hsn-phone/call", JSON.stringify({phonenumber : keyPadHTML}));
        }
    } else if (Button == "Back") {
        let keyPadHTML = $(".contacts-shownumberr").find("p").html();
        let v = keyPadHTML.slice(0, -1);
        $(".contacts-shownumberr").find("p").html(v)
    }
})

// let CheckOutput = () => {
//     var output= document.getElementById("contacts-shownumber").innerText;
//     if (output == "") {
//         $(".removeoutput").fadeOut(300)
//         $(".callnumber").fadeOut(300)
//     } else {
//         $(".callnumber").fadeIn(300)
//         $(".removeoutput").fadeIn(300)
//     }
//     setTimeout(CheckOutput, 1000);
// }

// CheckOutput();

var number = document.getElementsByClassName("callside-buttons");
for(var i =0;i<number.length;i++){
	number[i].addEventListener('click',function(){
		var output= document.getElementById("outputtest").innerText;
			output=output+this.id;
		document.getElementById("outputtest").innerText = output
	});
}



HSN.OpenAppPage = function(selector,Percentage) {
    $(selector).css({'display':'block'}).animate({
        top: Percentage+"%",
    }, 500);
}

HSN.SetCryptoName = function(firstname, lastname, cryptoid, bank) {
        $(".finance-plyname").html(firstname+" "+lastname)
        $(".finance-cryptoid").html(cryptoid)
        $(".finance-totalbalance-index").html("$"+bank.toFixed(2))
    
}

HSN.SetCryptoData = function(cryptoTable) {
    if (cryptoTable) {
        $.each(cryptoTable, function (i, result) {
            if (result == "0") {
                result = "0.0"
            }
            $(".cryptocurrency-side-index").find("[financeid="+i+"]").find("p").html(result)
        })
    }
}

HSN.AddNewCryptoTransfer = function(data) {
    $(".finance-transactions-none").fadeOut()
    var icon = HSN.GetCryptoIcon(data.crypto)
    $(".finance-transactions-container").append('<div class="finance-transactions-container-index" id='+data.id+'><div class="finance-transactions-container-index-icon">'+icon+'</div><div class="finance-transactions-container-index-label">Transaction </div><div class="finance-transactions-container-index-label">Amount</div><div class="finance-transactions-container-index-text">'+data.target+'</div><div class="finance-transactions-container-index-text">'+data.amount+'</div></div>')
}

HSN.OpenPhoneForNotifications = function(result) {
    if (result.type == "call-src") {
        inCall = true
        if (!result.IsPhoneOpen) {
            $(".hsn-phonemain").css({'display':'block'}).animate({
                top: "55%",
            }, 500);
        }
        $(".ntfy-container").prepend('<div class="hsn-phonemain-createnotification" id='+result.id+'><div class="hsn-phonemain-createnotification-photo">'+result.TargetPlayerPhoto+'</div><div class="hsn-phonemain-createnotification-appname">Call</div><div class="hsn-phonemain-createnotification-time">just now</div><div class="hsn-phonemain-createnotification-comment kisitla">'+result.message+'</div>       <div class="hsn-phonemain-createnotification-interactions toggleleft" id="cancelcall" number='+result.targetNumber+'><i class="fas fa-window-close" style="color:rgb(177, 52, 59);"></i></div></div>')
        $(".hsn-phonemain-createnotification-photo").css({"background":result.background})
        // $(".hsn-phonemain-createnotification").css({'display':'block'}).animate({
        //     top: "8%",
        // }, 500);
    } else if (result.type == "call-target") {
        inCall = true
        if (!result.IsPhoneOpen) {
            $(".hsn-phonemain").css({'display':'block'}).animate({
                top: "55%",
            }, 500);
        }
        $(".ntfy-container").prepend('<div class="hsn-phonemain-createnotification" id='+result.id+'><div class="hsn-phonemain-createnotification-photo">'+result.TargetPlayerPhoto+'</div><div class="hsn-phonemain-createnotification-appname">Call</div><div class="hsn-phonemain-createnotification-time">just now</div><div class="hsn-phonemain-createnotification-comment kisitla">'+result.message+'</div><div class="hsn-phonemain-createnotification-interactions" id="accept"><i class="fas fa-check-circle" style="color:#1cac42;"></i></div>       <div class="hsn-phonemain-createnotification-interactions" id="decline"><i class="fas fa-window-close" style="color:rgb(177, 52, 59);"></i></div></div>') 
        $(".hsn-phonemain-createnotification-photo").css({"background":result.background})
        // $(".hsn-phonemain-createnotification").css({'display':'block'}).animate({
        //     top: "8%",
        // }, 500);
        
    } else if (result.type == "message") {
        if (result.duration == undefined) {
            result.duration = 5000
        }
        //if (!inCall) {
            if (!result.IsPhoneOpen) {
                $(".hsn-phonemain").css({'display':'block'}).animate({
                    top: "55%",
                }, 500);
            }
            $(".ntfy-container").prepend('<div class="hsn-phonemain-createnotification" id='+result.id+'><div class="hsn-phonemain-createnotification-photo">'+result.icon+'</div><div class="hsn-phonemain-createnotification-appname">'+result.app+'</div><div class="hsn-phonemain-createnotification-time">just now</div><div class="hsn-phonemain-createnotification-comment">'+result.message+'</div></div>')
            //$(".hsn-phonemain-createnotification").html('<div class="hsn-phonemain-createnotification-photo">'+result.icon+'</div><div class="hsn-phonemain-createnotification-appname">'+result.app+'</div><div class="hsn-phonemain-createnotification-time">just now</div><div class="hsn-phonemain-createnotification-comment">'+result.message+'</div>')
            $(".hsn-phonemain-createnotification-photo").css({"background":result.background})
            // $(".hsn-phonemain-createnotification").css({'display':'block'}).animate({
            //     top: "8%",
            // }, 500);
            setTimeout(function(){  
                $(".ntfy-container").find("[id="+result.id+"]").css({'display':'block'}).animate({
                    top: "-10%",
                }, 500, function(){
                    if (!HSN.IsPhoneOpened) {
                        $(".hsn-phonemain").css({'display':'block'}).animate({
                            top:"80%",
                        }, 100, function(){
                            $(".hsn-phonemain").css({'display':'none'});
                        });
                    }
                    $(".ntfy-container").find("[id="+result.id+"]").css({'display':'none'});
                });
            }, result.duration);
        //}
    }
}

GenerateRandomId = function() {
    return Math.random()
}

HSN.UpdateCryptoValues = function(crypto, value) {
    if (value == "0") {
        value = "0.0"
    }
    $(".cryptocurrency-side-index").find("[financeid="+crypto+"]").find("p").html(value)
}



HSN.CloseAppPage = function(selector,Percentage) {
    $(selector).css({'display':'block'}).animate({
        top: Percentage+"%",
    }, 500, function(){
        $(selector).css({'display':'none'});
    });
}

HSN.GetAmbulancePatientData = function() {
    $.post('http://hsn-phone/getPatients', JSON.stringify({}), function(data){
        if (data.length == 0) {
            $(".ambulance-records-nonenotify").css({'display':'block'}).animate({
                left: "5%",
            }, 500);
        } else {
            if ($(".ambulance-records-nonenotify").css("display") == "block") {
                $(".ambulance-records-nonenotify").css({'display':'block'}).animate({
                    left: "-100%",
                }, 500, function(){
                    $(".ambulance-records-nonenotify").css({'display':'none'}); // HSN.CalculateTime(data[i].date)
                    for(i = 0; i < (data.length); i++) {
                        $(".records-container").find("[patientId="+data[i].id+"]").remove();
                        if (data[i].photo !== "" && HSN.CheckIfImageExists(data[i].photo) == true) {
                            $(".records-container").prepend('<div class="records-container-index" patientId='+data[i].id+'><div class="ambulance-records-delete" patientDeleteId='+data[i].id+'><i class="fas fa-times"></i></div><div class="ambulance-records-plyname">Patient Name</div><div class="ambulance-records-plyname-index">'+data[i].name+'</div><div class="ambulance-records-message">Patient Data</div><div class="ambulance-records-message-index">'+data[i].message+'</div><div class="ambulance-records-time">'+HSN.CalculateTime(data[i].date)+'</div><div class="ambulance-records-photolink" photoid='+data[i].photo+'><div class="hovereffect">1 Link!</div><i class="fas fa-link"></i></div></div>')
                        } else {
                            $(".records-container").prepend('<div class="records-container-index" patientId='+data[i].id+'><div class="ambulance-records-delete" patientDeleteId='+data[i].id+'><i class="fas fa-times"></i></div><div class="ambulance-records-plyname">Patient Name</div><div class="ambulance-records-plyname-index">'+data[i].name+'</div><div class="ambulance-records-message">Patient Data</div><div class="ambulance-records-message-index">'+data[i].message+'</div><div class="ambulance-records-time">'+HSN.CalculateTime(data[i].date)+'</div></div>')
                        }
                    }
                });
            } else {
                for(i = 0; i < (data.length); i++) {
                    $(".records-container").find("[patientId="+data[i].id+"]").remove();
                    if (data[i].photo !== "" && HSN.CheckIfImageExists(data[i].photo) == true) {
                        $(".records-container").prepend('<div class="records-container-index" patientId='+data[i].id+'><div class="ambulance-records-delete" patientDeleteId='+data[i].id+'><i class="fas fa-times"></i></div><div class="ambulance-records-plyname">Patient Name</div><div class="ambulance-records-plyname-index">'+data[i].name+'</div><div class="ambulance-records-message">Patient Data</div><div class="ambulance-records-message-index">'+data[i].message+'</div><div class="ambulance-records-time">'+HSN.CalculateTime(data[i].date)+'</div><div class="ambulance-records-photolink" photoid='+data[i].photo+'><div class="hovereffect">1 Link!</div><i class="fas fa-link"></i></div></div>')
                    } else {
                        $(".records-container").prepend('<div class="records-container-index" patientId='+data[i].id+'><div class="ambulance-records-delete" patientDeleteId='+data[i].id+'><i class="fas fa-times"></i></div><div class="ambulance-records-plyname">Patient Name</div><div class="ambulance-records-plyname-index">'+data[i].name+'</div><div class="ambulance-records-message">Patient Data</div><div class="ambulance-records-message-index">'+data[i].message+'</div><div class="ambulance-records-time">'+HSN.CalculateTime(data[i].date)+'</div></div>')
                    }
                }
            }
        }
    })
}


HSN.AddNewPatientData = function(patientData) {
    if (patientData != undefined) {
        $(".ambulance-records-nonenotify").fadeOut()
        if (patientData.photo !== "" && HSN.CheckIfImageExists(patientData.photo) == true) {
            $(".records-container").prepend('<div class="records-container-index" patientId='+patientData.id+'><div class="ambulance-records-delete" patientDeleteId='+patientData.id+'><i class="fas fa-times"></i></div><div class="ambulance-records-plyname">Patient Name</div><div class="ambulance-records-plyname-index">'+patientData.name+'</div><div class="ambulance-records-message">Patient Data</div><div class="ambulance-records-message-index">'+patientData.message+'</div><div class="ambulance-records-time">'+HSN.CalculateTime(patientData.date)+'</div><div class="ambulance-records-photolink" photoid='+patientData.photo+'><div class="hovereffect">1 Link!</div><i class="fas fa-link"></i></div></div>')
        } else {
            $(".records-container").prepend('<div class="records-container-index" patientId='+patientData.id+'><div class="ambulance-records-delete" patientDeleteId='+patientData.id+'><i class="fas fa-times"></i></div><div class="ambulance-records-plyname">Patient Name</div><div class="ambulance-records-plyname-index">'+patientData.name+'</div><div class="ambulance-records-message">Patient Data</div><div class="ambulance-records-message-index">'+patientData.message+'</div><div class="ambulance-records-time">'+HSN.CalculateTime(patientData.date)+'</div></div>')
        }
        HSN.ClearValues("id", "ambulance-target")
        HSN.ClearValues("id", "ambulance-createtext")
        HSN.ClearValues("id", "ambulance-photo")
    }
}

HSN.DeletePatientData = function(id) {
    $(".records-container").find("[patientId="+id+"]").css({'display':'block'}).animate({
        left: "-100%",
    }, 500, function(){
        $(".records-container").find("[patientId="+id+"]").remove()
        var patients = document.getElementsByClassName("records-container-index");
        if (patients.length == 0) {
            $(".ambulance-records-nonenotify").css({'display':'block'}).animate({
                left: "5%",
            }, 500);
        }
    });
}

HSN.AnswerCall = function(type, photo, id) {
    if (type == "cancelcall") {
        $(".ntfy-container").find("[id="+id+"]").css({'display':'block'}).animate({
            top: "-10%",
        }, 500, function(){
            if (!HSN.IsPhoneOpened) {
                $(".hsn-phonemain").css({'display':'block'}).animate({
                    top:"80%",
                }, 100, function(){
                    $(".hsn-phonemain").css({'display':'none'});
                });
            }
            $(".ntfy-container").find("[id="+id+"]").css({'display':'none'});
        });
        inCall = false
    } else if (type == "accept") {
        $(".hsn-phonemain-createnotification").html('<div class="hsn-phonemain-createnotification-photo"><img src='+photo+'></div><div class="hsn-phonemain-createnotification-appname">Call</div><div class="hsn-phonemain-createnotification-time">just now</div><div class="hsn-phonemain-createnotification-comment kisitla fadeInOut">In Call</div>       <div class="hsn-phonemain-createnotification-interactions" id="decline"><i class="fas fa-window-close" style="color:rgb(177, 52, 59);"></i></div>')
        

        $(".hsn-phonemain").css({'display':'block'}).animate({
            top: "55%",
        }, 500);
        $.post("http://hsn-phone/close", JSON.stringify({})); 
        inCall = true
    } else if (type == "decline") {
        $(".ntfy-container").find("[id="+id+"]").css({'display':'block'}).animate({
            top: "-10%",
        }, 500, function(){
            //if (!HSN.IsPhoneOpened) {
                $(".hsn-phonemain").css({'display':'block'}).animate({
                    top:"80%",
                }, 100, function(){
                    $(".hsn-phonemain").css({'display':'none'});
                });
            //}
            $(".ntfy-container").find("[id="+id+"]").css({'display':'none'});
        });
        inCall = false 
    }
}






HSN.dblclicktophoto = function(photoid) {
    $.post("http://hsn-phone/DeletePhotoFromGallery", JSON.stringify({id : photoid})); 

}

HSN.DeletePhotoFromGallery = function(photoid) {
    $(".gallery-bottomside").find("[photoid="+photoid+"]").css({'display':'block'}).animate({
        left: "-100%",
    }, 500, function(){
        $(".gallery-bottomside").find("[photoid="+photoid+"]").remove()
        var galleryphotos = document.getElementsByClassName("gallery-photos");
        if (galleryphotos.length == 0) {
            $(".gallery-nonenotify").css({'display':'block'}).animate({
                left: "0%",
            }, 500);
        }
    });
}



$('.input-settings').keypress(function(e) {
    if (e.which == 13) {
        var Photo = $(".input-settings").val();
        $.post("http://hsn-phone/ChangePhoto", JSON.stringify({photoindex : "phone-background", photo : Photo})); 
        $(".settings-pages-background").css({'display':'block'}).animate({
            left: -100+"%",
        }, 500, function(){
            $(".settings-pages-background").css({'display':'none'});
            HSN.ShowGoBack(true, "settings")
        });
    }
});

HSN.OpenGalleryForSelect = function(domid) {
    HSN.OpenAppPage(".hsn-phonemain-gallery-entry-select",10)
    $.post('http://hsn-phone/GetGalleryPhotos', JSON.stringify({}), function(data){
        if (data.length == 0) {
            $(".gallery-nonenotify").css({'display':'block'}).animate({
                left: "0",
            }, 500);
        } else {
            if ($(".gallery-nonenotify").css("display") == "block") {
                $(".gallery-nonenotify").css({'display':'block'}).animate({
                    left: "-100%",
                }, 500, function(){
                    $(".gallery-nonenotify").css({'display':'none'});
                    for(i = 0; i < (data.length); i++) {
                        
                        $(".gallery-bottomside").find("[photoid="+data[i].id+"]").remove();
                        $(".gallery-bottomside").prepend('<div class="gallery-photos-select" photoid='+data[i].id+'><img id='+'photoSrc'+data[i].id+' src="'+data[i].photo+'"></div>')
                    }
                });
            } else {
                for(i = 0; i < (data.length); i++) {
            
                    $(".gallery-bottomside").find("[photoid="+data[i].id+"]").remove();
                    $(".gallery-bottomside").prepend('<div class="gallery-photos-select"  photoid='+data[i].id+'><img id='+'photoSrc'+data[i].id+' src="'+data[i].photo+'"></div>')
                    
                }
            }
        }
    })
    
    $(document).on('click', '.gallery-photos-select', function(e){
        var id = $(this).attr("photoid")
        var srcDom = document.getElementById("photoSrc"+id).src
        HSN.CloseAppPage(".hsn-phonemain-gallery-entry-select",-100)
        HSN.SetInputValue(domid, srcDom)
    });



    $(document).on('click', '.close-galleryselect', function(e){
        HSN.CloseAppPage(".hsn-phonemain-gallery-entry-select",-100)
    });

}

HSN.SetInputValue = function(id, photo) {
    if (id == "notes") {
        document.getElementById("notes-photo").value = photo
    } else if (id == "twitter") {
        document.getElementById("tweet-new-url").value = photo
    } else if (id == "ambulanceapp") {
        document.getElementById("ambulance-photo").value = photo
    } else if (id == "policeapp") {
        document.getElementById("plyfile-textarea-photo").value = photo
    } else if (id == "ads") {
        document.getElementById("ads-new-url").value = photo
    } else if (id == "messages") {
        MessageData.photo = photo
    }
}

HSN.GetBolos = function (bolos) {
    if (bolos.length == 0) {

    }else {
        $.each(bolos, function (i, result) {
            $(".pd-plyfiles-none").fadeOut()
            if (result.photo !== "" && HSN.CheckIfImageExists(result.photo) == true) {
                $(".pd-plyfiles-container").prepend('<div class="pd-plyfile" id='+result.id+'><div class="pd-plyfile-delete" deleteid='+result.id+'><i class="fas fa-times-circle"></i></div><div class="pd-plyfile-reason">'+result.reason+'</div><div class="pd-plyfile-link" hoverImg='+result.photo+'><i class="fas fa-link"> </i><div class="pd-linkhovereffect" >1 Link!</div></div></div>')
            } else {
                $(".pd-plyfiles-container").prepend('<div class="pd-plyfile" id='+result.id+'><div class="pd-plyfile-delete" deleteid='+result.id+'><i class="fas fa-times-circle"></i></div><div class="pd-plyfile-reason">'+result.reason+'</div></div>')
            }
        })
    }
}

HSN.AddNewBolo = function(bolodata) {
    if (bolodata !==undefined) {
        $(".pd-plyfiles-none").fadeOut()
        if (bolodata.photo !== "" && HSN.CheckIfImageExists(bolodata.photo) == true) {
            $(".pd-plyfiles-container").prepend('<div class="pd-plyfile" id='+bolodata.id+'><div class="pd-plyfile-delete" deleteid='+bolodata.id+'><i class="fas fa-times-circle"></i></div><div class="pd-plyfile-reason">'+bolodata.reason+'</div><div class="pd-plyfile-link" hoverImg='+bolodata.photo+'><i class="fas fa-link"></i><div class="pd-linkhovereffect">1 Link!</div></div></div>')
        } else {
            $(".pd-plyfiles-container").prepend('<div class="pd-plyfile" id='+bolodata.id+'><div class="pd-plyfile-delete" deleteid='+bolodata.id+'><i class="fas fa-times-circle"></i></div><div class="pd-plyfile-reason">'+bolodata.reason+'</div></div>')
        }
    }
}


HSN.DeleteBolo = function(id) {
    $(".pd-plyfiles-container").find("[id="+id+"]").css({'display':'block'}).animate({
        left: "-100%",
    }, 500, function(){
        $(".pd-plyfiles-container").find("[id="+id+"]").remove()
        var bolos = document.getElementsByClassName("pd-plyfile");
        if (bolos.length == 0) {
            $(".pd-plyfiles-none").fadeIn()
        }
    });
}

HSN.SetupBackgrounds = function(backgroundList) {
    if (!PhotosLoaded) {
        $.each(backgroundList, function (i, result) {
            $(".s-background-box").append('<div class="s-background-photo" id='+i+'><img src='+result+'></div>')
        })
    }
    PhotosLoaded = true
}

HSN.SetupApps = function (apps) {
    $.each(apps, function (i, result) {
        if ($(".hsn-phonemain-apps").find("[id="+result+"]").html() == undefined) {
            let appIcon = null
            if (result == "Twitter") {
                appIcon =  '<i class="fab fa-twitter"></i>'
            }else if (result == "Twitch") {
                appIcon =  '<i class="fab fa-twitch"></i>'
            }else if (result == "Advertisement") {
                appIcon =  '<i class="fas fa-ad"></i>'
            }else if (result == "Finance") {
                appIcon = '<i class="fas fa-wallet"></i>'
            }else if (result == "Cars") {
                appIcon = '<i class="fas fa-car"></i>'
            }
            if (result == "Advertisement") {
                $(".hsn-phonemain-apps").append('<div class="hsn-phone-apps" id='+result+'><div class="hsn-phone-apps-iconside" appname='+result+'>'+appIcon+'</div><div class="hsn-phone-apps-textside">Ads</div></div>')
            } else {
                $(".hsn-phonemain-apps").append('<div class="hsn-phone-apps" id='+result+'><div class="hsn-phone-apps-iconside" appname='+result+'>'+appIcon+'</div><div class="hsn-phone-apps-textside">'+result+'</div></div>')
            }
           
            HSN.SetAppColor(result)
            $(".hsn-phonemain-apps-entry").find("[id="+result+"]").html('<i class="fas fa-check-circle"></i>')
            $(".hsn-phonemain-apps-entry").find("[id="+result+"]").addClass("hoverappstore")
            downloaded[result] = true
        }
    })
}

HSN.SetupRings = function(rings) {
    if (!RingsLoaded) {
        $.each(rings, function (i, result) {
            $(".settings-pages-callsound").append('<div class="s-cs-i"><div class="s-cs-i-name">'+result.label+'</div><div class="s-cs-i-icon" id="'+i+'"><i class="fas fa-play"></i></div></div>')
            $(".settings-pages-callsound").find("[id="+i+"]").data("Music", result.musicname)
        })
    }
    RingsLoaded = true
}

HSN.GenerateRandomStr = function(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}


HSN.AddJobApp = function(job) {
    if (job == "police") {
        if (set[job] == undefined) {
            $(".hsn-phonemain-apps").append('<div class="hsn-phone-apps" id="Polices"><div class="hsn-phone-apps-iconside" style="background-color: #00509d;"><i class="fas fa-user-shield"></i></div><div class="hsn-phone-apps-textside">Polices</div></div>')
            set[job] = "Ananı sikeyim"
        }
    } else if (job == "ambulance") {
        if (set[job] == undefined) {
            $(".hsn-phonemain-apps").append('<div class="hsn-phone-apps" id="Ambulance"><div class="hsn-phone-apps-iconside" style="background-color: #ff595e;"><i class="fas fa-user-md"></i></div><div class="hsn-phone-apps-textside">Ambulance</div></div>')
            set[job] = "haşim"
        }
    }
}

HSN.DeleteAdd = function(id) {
    $(".ads-index-container").find("[ads-id="+id+"]").fadeOut()
    $(".ads-index-container").find("[ads-id="+id+"]").remove();
    var adds = document.getElementsByClassName("ads-index");
    if (adds.length == 0) {
        $(".ads-nonenotify").fadeIn()
    }
}

HSN.EditAdd = function(id, newtext) {
    $(".ads-index-container").find("[ads-id="+id+"]").find(".ads-index-tooltip-msgside-msg").html(newtext)
}

HSN.GetAdds = function() {
    $.post('http://hsn-phone/GetAdds', JSON.stringify({}), function(data){
        if (data.length == 0) {
            $(".ads-none").css({'display':'block'}).animate({
                left: "5",
            }, 500);
        } else {
            if (HSN.PlayerIdentifier == data.senderidentifier) {
                if (data[i].photo != undefined || data[i].photo != "") {
                    $(".ads-index-container").find("[ads-id="+data[i].id+"]").remove();
                    $(".ads-index-container").prepend('<div class="ads-index" ads-id='+data[i].id+'> <div class="ads-photo"><img src='+data[i].playerphoto+'></div><div class="ads-playername">'+data[i].name+'</div> <div class="ads-indexs-tooltip-c"><i class="fas fa-phone"></i></div> <div class="ads-indexs-tooltip-e"><i class="fas fa-edit"></i></div> <div class="ads-indexs-tooltip-d"><i class="fas fa-trash"></i></div> <div class="ads-index-tooltip-msgside-msg">'+data[i].text+'</div> <div class="ads-index-tooltip-msgside-photo"><img src="'+data[i].photo+'"></div> </div>')
                } else {
                    $(".ads-index-container").find("[ads-id="+data[i].id+"]").remove();
                    $(".ads-index-container").prepend('<div class="ads-index" ads-id='+data[i].id+'><div class="ads-photo"><img src="'+data[i].playerphoto+'"></div><div class="ads-playername">'+data[i].name+'</div><div class="ads-indexs-tooltip-c"><i class="fas fa-phone"></i></div><div class="ads-indexs-tooltip-e"><i class="fas fa-edit"></i></div><div class="ads-indexs-tooltip-d"><i class="fas fa-trash"></i></div><div class="ads-index-tooltip-msgside-msg">'+data[i].text+'</div></div>')
                }
                $(".ads-index-container").find("[ads-id="+data[i].id+"]").find(".ads-indexs-tooltip-e").css({"left" :  "47%"})
                $(".ads-index-container").find("[ads-id="+data[i].id+"]").find(".ads-indexs-tooltip-d").css({"left" :  "54%"})
                $(".ads-index-container").find("[ads-id="+data[i].id+"]").find(".ads-indexs-tooltip-e").data("id", data[i].id)
                $(".ads-index-container").find("[ads-id="+data[i].id+"]").find(".ads-indexs-tooltip-d").data("id", data[i].id)
            } else {
                if (data[i].photo != undefined || data[i].photo != "") {
                    $(".ads-index-container").find("[ads-id="+data[i].id+"]").remove();
                    $(".ads-index-container").prepend('<div class="ads-index" ads-id='+data[i].id+'><div class="ads-photo"><img src="'+data[i].playerphoto+'"></div><div class="ads-playername">'+data[i].name+'</div><div class="ads-index-tooltip-msgside-msg">'+data[i].text+'</div><div class="ads-index-tooltip-msgside-photo"><img src="'+data[i].photo+'"></div></div>')
                } else {
                    $(".ads-index-container").find("[ads-id="+data[i].id+"]").remove();
                    $(".ads-index-container").prepend('<div class="ads-index" ads-id='+data[i].id+'><div class="ads-photo"><img src="'+data[i].playerphoto+'"></div><div class="ads-playername">'+data[i].name+'</div><div class="ads-index-tooltip-msgside-msg">'+data[i].text+'</div></div>')
                }
                $(".ads-index-container").find("[ads-id="+data[i].id+"]").find(".ads-indexs-tooltip-c").data("phonenumber", data[i].phonenumber)
                $(".ads-index-container").find("[ads-id="+data[i].id+"]").find(".ads-indexs-tooltip-m").data("phonenumber", data[i].phonenumber)
            }
        }
    })
}

HSN.AddNewAddvertisement = function(data) {
    $(".ads-nonenotify").fadeOut()
    if (HSN.PlayerIdentifier == data.senderidentifier) {
        if (data.photo != undefined || data.photo != "") {
            $(".ads-index-container").find("[ads-id="+data.id+"]").remove();
            $(".ads-index-container").prepend('<div class="ads-index" ads-id='+data.id+'> <div class="ads-photo"><img src='+data.playerphoto+'></div><div class="ads-playername">'+data.name+'</div> <div class="ads-indexs-tooltip-e"><i class="fas fa-edit"></i></div> <div class="ads-indexs-tooltip-d"><i class="fas fa-trash"></i></div> <div class="ads-index-tooltip-msgside-msg">'+data.text+'</div> <div class="ads-index-tooltip-msgside-photo"><img src="'+data.photo+'"></div> </div>')
        } else {
            $(".ads-index-container").find("[ads-id="+data.id+"]").remove();
            $(".ads-index-container").prepend('<div class="ads-index" ads-id='+data.id+'><div class="ads-photo"><img src="'+data.playerphoto+'"></div><div class="ads-playername">'+data.name+'</div><div class="ads-indexs-tooltip-e"><i class="fas fa-edit"></i></div><div class="ads-indexs-tooltip-d"><i class="fas fa-trash"></i></div><div class="ads-index-tooltip-msgside-msg">'+data.text+'</div></div>')
        }
        $(".ads-index-container").find("[ads-id="+data.id+"]").find(".ads-indexs-tooltip-e").css({"left" :  "47%"})
        $(".ads-index-container").find("[ads-id="+data.id+"]").find(".ads-indexs-tooltip-d").css({"left" :  "54%"})
        $(".ads-index-container").find("[ads-id="+data.id+"]").find(".ads-indexs-tooltip-e").data("id", data.id)
        $(".ads-index-container").find("[ads-id="+data.id+"]").find(".ads-indexs-tooltip-d").data("id", data.id)
        
    } else {
        if (data.photo != undefined || data.photo != "") {
            $(".ads-index-container").find("[ads-id="+data.id+"]").remove();
            $(".ads-index-container").prepend('<div class="ads-index" ads-id='+data.id+'><div class="ads-photo"><img src="'+data.playerphoto+'"></div><div class="ads-playername">'+data.name+'</div> <div class="ads-indexs-tooltip-c"><i class="fas fa-phone"></i></div> <div class="ads-index-tooltip-msgside-msg">'+data.text+'</div><div class="ads-index-tooltip-msgside-photo"><img src="'+data.photo+'"></div></div>')
        } else {
            $(".ads-index-container").find("[ads-id="+data.id+"]").remove();
            $(".ads-index-container").prepend('<div class="ads-index" ads-id='+data.id+'><div class="ads-photo"><img src="'+data.playerphoto+'"></div><div class="ads-playername">'+data.name+'</div> <div class="ads-indexs-tooltip-c"><i class="fas fa-phone"></i></div> <div class="ads-index-tooltip-msgside-msg">'+data.text+'</div></div>')
        }
        $(".ads-index-container").find("[ads-id="+data.id+"]").find(".ads-indexs-tooltip-c").data("phonenumber", data.phonenumber)
        $(".ads-index-container").find("[ads-id="+data.id+"]").find(".ads-indexs-tooltip-m").data("phonenumber", data.phonenumber)
    }
}


HSN.GetMessagePlayers = function() {
    $(".messages-indexside").html("")
    $.post('http://hsn-phone/getmessages', JSON.stringify({}), function(data){
        if (data.length == 0) {

        } else {
            $.each(data, function (i, result) {
                $(".messages-indexside").find("[phonenumber="+result.number+"]").remove();
                if (result.lastmessage == "") {
                    result.lastmessage = '<i class="fas fa-link"></i>' + " A document has been sent."
                }
                HSN.PlayerMessages[result.number].playerphoto = result.playerphoto
                $(".messages-indexside").append('<div class="messages-index" href='+result.name+' phonenumber='+result.number+'><div class="messages-index-photo"><img src="'+HSN.CalculateMessagesPhoto(result.playerphoto)+'"></div><div class="messages-name">'+result.name+'</div><div class="messages-index-text">'+result.lastmessage+'</div><div class="messages-index-time">'+HSN.CalculateTime(result.lastmessagetime)+'</div></div>')
            })
        }
       
    })  

    // $.each(HSN.PlayerMessages, function (i, result) {
    //     $(".messages-indexside").find("[phonenumber="+i+"]").remove();
    //     if (result.lastmessage == "") {
    //         result.lastmessage = '<i class="fas fa-link"></i>' + " A document has been sent."
    //     }
    //     $(".messages-indexside").append('<div class="messages-index" href='+result.name+' phonenumber='+i+'><div class="messages-index-photo"><img src="'+HSN.CalculateMessagesPhoto(result.playerphoto)+'"></div><div class="messages-name">'+result.name+'</div><div class="messages-index-text">'+result.lastmessage+'</div><div class="messages-index-time">'+HSN.CalculateTime(result.lastmessagetime)+'</div></div>')
    // })
}

HSN.GetMessages = function(number, data) {
    if (number != undefined) {
        if (HSN.PlayerMessages != undefined) {
            if (HSN.PlayerMessages[number] == undefined) {
                $(".messages-side").html('')
                $(".messages-nonenotify-a").fadeIn()
                $(".top-info-photo").html("<img src="+HSN.CalculateMessagesPhoto("default")+">")
                $(".top-info-name").html(data.name)
            } else {
                $(".messages-side").html('')
                $(".top-info-photo").html("<img src="+HSN.CalculateMessagesPhoto(HSN.PlayerMessages[number].playerphoto)+">")
                $(".top-info-name").html(HSN.PlayerMessages[number].name)
                $(".messages-nonenotify-a").fadeOut()
                var messages = HSN.PlayerMessages[number].localmessages
                $.each(messages, function (i, result) {
                    if (result.sender == "me"){
                        if (result.photo !== undefined) {
                            if (result.gps !== undefined) {
                                $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-me"><span class="messages-openedchat-span">' + result.message + '</span> <div class="messages-openedchat-message-photo"><img src='+result.photo+'></div> <div class="messages-openedchat-message-gps"  ><i class="fas fa-map-marker-alt" coord-x="'+result.gps.x+'" coord-y="'+result.gps.y+'" coord-z="'+result.gps.z+'"></i> Shared Location</div>   <div class="messages-openedchat-message-time">' + result.messagetime + '</div>    </div><div class="clearfix"></div></div>')
                            } else {
                                $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-me"><span class="messages-openedchat-span">' + result.message + '</span> <div class="messages-openedchat-message-photo"><img src='+result.photo+'></div> <div class="messages-openedchat-message-time">' + result.messagetime + '</div></div><div class="clearfix"></div></div>')
                            }
                        } else {
                            if (result.gps !== undefined) {

                                $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-me"><span class="messages-openedchat-span">' + result.message + '</span> <div class="messages-openedchat-message-gps"  ><i class="fas fa-map-marker-alt" coord-x="'+result.gps.x+'" coord-y="'+result.gps.y+'" coord-z="'+result.gps.z+'"></i> Shared Location</div>  <div class="messages-openedchat-message-time">' + result.messagetime + '</div>    </div><div class="clearfix"></div></div>')
                            } else {
                                $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-me"><span class="messages-openedchat-span">' + result.message + '</span><div class="messages-openedchat-message-time">' + result.messagetime + '</div></div><div class="clearfix"></div></div>')
                            }
                        }
                    } else if (result.sender == "target") {
                        if (result.photo !== undefined) {
                            if (result.gps !== undefined) {
                                $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-target"><span class="messages-openedchat-span">' + result.message + '</span> <div class="messages-openedchat-message-photo"><img src='+result.photo+'></div> <div class="messages-openedchat-message-gps"  ><i class="fas fa-map-marker-alt" coord-x="'+result.gps.x+'" coord-y="'+result.gps.y+'" coord-z="'+result.gps.z+'"></i> Shared Location</div>   <div class="messages-openedchat-message-time">' + result.messagetime + '</div>    </div><div class="clearfix"></div></div>')
                            } else {
                                $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-target"><span class="messages-openedchat-span">' + result.message + '</span> <div class="messages-openedchat-message-photo"><img src='+result.photo+'></div> <div class="messages-openedchat-message-time">' + result.messagetime + '</div></div><div class="clearfix"></div></div>')
                            }
                        } else {
                            if (result.gps !== undefined) {
                                $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-target"><span class="messages-openedchat-span">' + result.message + '</span> <div class="messages-openedchat-message-gps"  ><i class="fas fa-map-marker-alt" coord-x="'+result.gps.x+'" coord-y="'+result.gps.y+'" coord-z="'+result.gps.z+'"></i> Shared Location</div>  <div class="messages-openedchat-message-time">' + result.messagetime + '</div>    </div><div class="clearfix"></div></div>')
                            } else {
                                $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-target"><span class="messages-openedchat-span">' + result.message + '</span><div class="messages-openedchat-message-time">' + result.messagetime + '</div></div><div class="clearfix"></div></div>')
                            }
                        }
                        
                    }
                })
         
            }
        }
        $('.messages-side').animate({ scrollTop: 9999999 }, 3000);
    }
}


HSN.UpdateMessageData = function(newData , changedData, targetNumber) {
    console.log(JSON.stringify(changedData))
    $(".messages-nonenotify-a").fadeOut()
    HSN.PlayerMessages = changedData
    console.log(MessageData.number, targetNumber)
    if (MessageData.number == targetNumber) {
        if (newData.sender == "me"){
            if (newData.photo !== undefined) {
                if (newData.gps !== undefined) {
                    $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-me"><span class="messages-openedchat-span">' + newData.message + '</span> <div class="messages-openedchat-message-photo"><img src='+newData.photo+'></div> <div class="messages-openedchat-message-gps"  ><i class="fas fa-map-marker-alt" coord-x="'+newData.gps.x+'" coord-y="'+newData.gps.y+'" coord-z="'+newData.gps.z+'"></i> Shared Location</div>   <div class="messages-openedchat-message-time">' + newData.messagetime + '</div>    </div><div class="clearfix"></div></div>')
                } else {
                    $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-me"><span class="messages-openedchat-span">' + newData.message + '</span> <div class="messages-openedchat-message-photo"><img src='+newData.photo+'></div> <div class="messages-openedchat-message-time">' + newData.messagetime + '</div></div><div class="clearfix"></div></div>')
                }
            } else {
                if (newData.gps !== undefined) {
                    $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-me"><span class="messages-openedchat-span">' + newData.message + '</span> <div class="messages-openedchat-message-gps"  ><i class="fas fa-map-marker-alt" coord-x="'+newData.gps.x+'" coord-y="'+newData.gps.y+'" coord-z="'+newData.gps.z+'"></i> Shared Location</div>  <div class="messages-openedchat-message-time">' + newData.messagetime + '</div>    </div><div class="clearfix"></div></div>')
                } else {
                    $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-me"><span class="messages-openedchat-span">' + newData.message + '</span><div class="messages-openedchat-message-time">' + newData.messagetime + '</div></div><div class="clearfix"></div></div>')
                }
            }
        } else if (newData.sender == "target") {
            if (newData.photo !== undefined) {
                if (newData.gps !== undefined) {
                    $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-target"><span class="messages-openedchat-span">' + newData.message + '</span> <div class="messages-openedchat-message-photo"><img src='+newData.photo+'></div> <div class="messages-openedchat-message-gps"  ><i class="fas fa-map-marker-alt" coord-x="'+newData.gps.x+'" coord-y="'+newData.gps.y+'" coord-z="'+newData.gps.z+'"></i> Shared Location</div>   <div class="messages-openedchat-message-time">' + newData.messagetime + '</div>    </div><div class="clearfix"></div></div>')
                } else {
                    $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-target"><span class="messages-openedchat-span">' + newData.message + '</span> <div class="messages-openedchat-message-photo"><img src='+newData.photo+'></div> <div class="messages-openedchat-message-time">' + newData.messagetime + '</div></div><div class="clearfix"></div></div>')
                }
            } else {
                if (newData.gps !== undefined) {
                    $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-target"><span class="messages-openedchat-span">' + newData.message + '</span> <div class="messages-openedchat-message-gps"  ><i class="fas fa-map-marker-alt" coord-x="'+newData.gps.x+'" coord-y="'+newData.gps.y+'" coord-z="'+newData.gps.z+'"></i> Shared Location</div>  <div class="messages-openedchat-message-time">' + newData.messagetime + '</div>    </div><div class="clearfix"></div></div>')
                } else {
                    $(".messages-side").append('<div class="messages-openedchat-message messages-openedchat-message-target"><span class="messages-openedchat-span">' + newData.message + '</span><div class="messages-openedchat-message-time">' + newData.messagetime + '</div></div><div class="clearfix"></div></div>')
                }
            }
            
        }
        $('.messages-side').animate({ scrollTop: 999999 }, 3000);
    }
    HSN.GetMessagePlayers()
}

HSN.SearchMessages = function() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('messages-searchbar');
    filter = input.value.toUpperCase();
    ul = document.getElementsByClassName("messages-index");
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < ul.length; i++) {
      a = ul[i].getElementsByClassName("messages-name")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        ul[i].style.display = "";
      } else {
        ul[i].style.display = "none";
      }
    }
}


HSN.UpdateCryptoChanges = function(changes) {
    $.each(changes, function (i, result) {
        if (result.change == "same") {
            $(".cryptocurrency-side").find("[id="+i+"]").find(".cryptocurrency-side-index-change").css({"background-color": "#fca311"})
        } else if(result.change == "up") {
            $(".cryptocurrency-side").find("[id="+i+"]").find(".cryptocurrency-side-index-change").css({"background-color": "#29bf12"})
        } else if(result.change == "down") {
            $(".cryptocurrency-side").find("[id="+i+"]").find(".cryptocurrency-side-index-change").css({"background-color": "#9e2a2b"})
            
        }
        //$(".cryptocurrency-side-index").find("[financeid="+i+"]").find("p").html(value)
    })
    
}
var audioPlayer = null;
// Listen for NUI Messages.
window.addEventListener('message', function(event) {
    // Check for playSound transaction
    if (event.data.transactionType == "playSound") {
    


    }
});

HSN.PlaySound = function(data) {
    if (audioPlayer != null) {
        audioPlayer.pause();
      }

      audioPlayer = new Howl({src: ["./sounds/" + data.soundname + ".ogg"]});
      audioPlayer.volume(data.soundvolume);
      audioPlayer.play();
}
